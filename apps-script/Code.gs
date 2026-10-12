/**
 * Hướng nghiệp IT thời AI — nhận dữ liệu từ web và ghi vào Google Sheet.
 *
 * Cài đặt (xem README):
 *  1. Tạo Google Sheet mới → Extensions › Apps Script → dán toàn bộ file này.
 *  2. Chọn hàm `setup` → Run (cấp quyền lần đầu). Hàm tạo các tab và dashboard.
 *  3. Deploy › New deployment › Web app: Execute as "Me", Who has access "Anyone".
 *  4. Copy URL kết thúc bằng /exec → đặt vào biến VITE_SHEETS_ENDPOINT của web.
 */

const VERSIONS = ['v1'];

// Phải khớp với QUESTION_ORDER trong src/data/questions.ts (dùng cho phễu rời bỏ).
const QUESTION_ORDER = [
  'status', 'field', 'experience', 'time',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8',
  'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7',
  'c1', 'c2', 'c3',
  'priority',
];

const ROLE_IDS = [
  'frontend', 'backend', 'fullstack', 'mobile', 'ai-app', 'ml-eng', 'mlops', 'data-eng', 'data-analyst',
  'data-scientist', 'devops', 'security', 'qa', 'pm', 'ba', 'solutions', 'uiux', 'tech-writer',
];

const DIMS = ['code', 'data', 'design', 'people', 'business', 'systems', 'research', 'quality'];

const EVENT_NAMES = ['quiz_start', 'chapter_done', 'preview_shown', 'continue_full', 'quiz_done', 'page_hidden'];

const HEADERS = {
  sessions: ['aid', 'first_seen', 'last_seen', 'device', 'version', 'furthest_idx', 'furthest_qid',
    'reached_preview', 'continued_full', 'completed_mode', 'events_count'],
  events: ['time', 'aid', 'event', 'qid', 'idx', 'data', 'device', 'version'],
  results: ['time', 'aid', 'version', 'device', 'mode', 'status', 'field', 'experience', 'time_per_week', 'priority']
    .concat(DIMS)
    .concat(['top1', 'top1_pct', 'top2', 'top2_pct', 'top3', 'top3_pct', 'confidence', 'duration_s', 'answers']),
  feedback: ['time', 'aid', 'version', 'rating', 'better_role', 'comment', 'top1'],
  emails: ['time', 'aid', 'email', 'consent'],
};

const RATE_LIMIT = 60; // số request tối đa mỗi lượt làm bài trong 10 phút
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ───────────────────────── Web app ─────────────────────────

function doGet() {
  return json({ ok: true, service: 'huong-nghiep-it' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const err = validate(body);
    if (err) return json({ ok: false, error: err });
    if (!rateLimitOk(body.aid)) return json({ ok: false, error: 'rate_limited' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      route(body);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function route(b) {
  const now = new Date();
  if (b.type === 'events') return handleEvents(b, now);
  if (b.type === 'result') return handleResult(b, now);
  if (b.type === 'feedback') {
    return append('feedback', [now, b.aid, b.v, b.rating, roleOrEmpty(b.better_role), text(b.comment, 1000), roleOrEmpty(b.top1)]);
  }
  if (b.type === 'email') {
    if (b.hp) return; // bot điền ô bẫy
    return append('emails', [now, b.aid, text(b.email, 200), b.consent === true]);
  }
}

function handleEvents(b, now) {
  const events = b.events.slice(0, 50);
  const rows = events.map(function (ev) {
    return [new Date(Number(ev.ts) || now.getTime()), b.aid, ev.name, text(ev.qid, 20), Number(ev.idx) || -1,
      ev.data ? text(JSON.stringify(ev.data), 2000) : '', text(b.device, 10), b.v];
  });
  const sheet = sh('events');
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);

  // Cập nhật bảng sessions (1 dòng / lượt làm bài) để đo phễu rời bỏ.
  const s = getSession(b.aid, now, b);
  events.forEach(function (ev) {
    const idx = Number(ev.idx);
    if (idx > s.values[5]) {
      s.values[5] = idx;
      s.values[6] = QUESTION_ORDER[idx] || '';
    }
    if (ev.name === 'preview_shown') s.values[7] = true;
    if (ev.name === 'continue_full') s.values[8] = true;
    if (ev.name === 'quiz_done') s.values[9] = text(ev.data && ev.data.mode, 10);
  });
  s.values[2] = now;
  s.values[10] = (Number(s.values[10]) || 0) + events.length;
  saveSession(s);
}

function handleResult(b, now) {
  const top = (b.top || []).slice(0, 3);
  const topCells = [];
  for (let i = 0; i < 3; i++) {
    topCells.push(top[i] ? roleOrEmpty(top[i].id) : '', top[i] ? Number(top[i].percent) || 0 : '');
  }
  const profile = b.profile || {};
  append('results', [now, b.aid, b.v, text(b.device, 10), text(b.mode, 10), text(b.status, 30), text(b.field, 30),
    text(b.experience, 200), text(b.time, 20), text(b.priority, 20)]
    .concat(DIMS.map(function (d) { return Number(profile[d]) || 0; }))
    .concat(topCells)
    .concat([text(b.confidence, 10), Number(b.duration) || 0, text(JSON.stringify(b.answers || {}), 3000)]));
}

// ───────────────────────── Kiểm tra dữ liệu ─────────────────────────

function validate(b) {
  if (!b || typeof b !== 'object') return 'bad_body';
  if (VERSIONS.indexOf(b.v) < 0) return 'bad_version';
  if (typeof b.aid !== 'string' || !/^[A-Za-z0-9-]{8,64}$/.test(b.aid)) return 'bad_aid';
  switch (b.type) {
    case 'events':
      if (!Array.isArray(b.events) || !b.events.length) return 'bad_events';
      for (let i = 0; i < b.events.length; i++) {
        if (EVENT_NAMES.indexOf(b.events[i].name) < 0) return 'bad_event_name';
      }
      return null;
    case 'result':
      return Array.isArray(b.top) && b.profile && typeof b.profile === 'object' ? null : 'bad_result';
    case 'feedback':
      return Number(b.rating) >= 1 && Number(b.rating) <= 5 ? null : 'bad_rating';
    case 'email':
      return typeof b.email === 'string' && EMAIL_RE.test(b.email) && b.email.length <= 200 && b.consent === true
        ? null : 'bad_email';
    default:
      return 'bad_type';
  }
}

function rateLimitOk(aid) {
  const cache = CacheService.getScriptCache();
  const key = 'rl_' + aid;
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 600);
  return n <= RATE_LIMIT;
}

/** Cắt độ dài và chặn chèn công thức (=, +, -, @) vào Sheet. */
function text(v, max) {
  let s = v === undefined || v === null ? '' : String(v);
  s = s.slice(0, max || 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function roleOrEmpty(id) {
  return ROLE_IDS.indexOf(id) >= 0 ? id : '';
}

// ───────────────────────── Sheet helpers ─────────────────────────

function sh(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (HEADERS[name]) {
      sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function append(name, row) {
  sh(name).appendRow(row);
}

function getSession(aid, now, b) {
  const sheet = sh('sessions');
  const last = sheet.getLastRow();
  if (last >= 2) {
    const cell = sheet.getRange(2, 1, last - 1, 1).createTextFinder(aid).matchEntireCell(true).findNext();
    if (cell) {
      const row = cell.getRow();
      return { row: row, values: sheet.getRange(row, 1, 1, HEADERS.sessions.length).getValues()[0] };
    }
  }
  return { row: 0, values: [aid, now, now, text(b.device, 10), b.v, -1, '', false, false, '', 0] };
}

function saveSession(s) {
  const sheet = sh('sessions');
  if (s.row) sheet.getRange(s.row, 1, 1, s.values.length).setValues([s.values]);
  else sheet.appendRow(s.values);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ───────────────────────── Cài đặt & dashboard ─────────────────────────

function setup() {
  Object.keys(HEADERS).forEach(sh);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);

  let d = ss.getSheetByName('dashboard');
  if (d) d.clear();
  else d = ss.insertSheet('dashboard', 0);

  const rows = [
    ['TỔNG QUAN', ''],
    ['Lượt bắt đầu', '=COUNTA(sessions!A2:A)'],
    ['Tới kết quả sơ bộ', '=COUNTIF(sessions!H2:H,TRUE)'],
    ['Chọn làm tiếp bản đầy đủ', '=COUNTIF(sessions!I2:I,TRUE)'],
    ['Hoàn thành — bản nhanh', '=COUNTIF(sessions!J2:J,"quick")'],
    ['Hoàn thành — bản đầy đủ', '=COUNTIF(sessions!J2:J,"full")'],
    ['% tới kết quả sơ bộ', '=IFERROR(B3/B2,0)'],
    ['% làm tiếp sau kết quả sơ bộ', '=IFERROR(B4/B3,0)'],
    ['Điểm đánh giá trung bình (1–5)', '=IFERROR(AVERAGE(feedback!D2:D),"")'],
    ['Số góp ý', '=COUNTA(feedback!A2:A)'],
    ['Số email', '=COUNTA(emails!A2:A)'],
  ];
  d.getRange(1, 1, rows.length, 2).setValues(rows);
  d.getRange('B7:B8').setNumberFormat('0%');

  // Phễu rời bỏ theo từng câu (câu "field" chỉ hiện với người trái ngành nên tỉ lệ có thể hụt ở đó).
  d.getRange('D1:F1').setValues([['PHỄU: câu hỏi', 'Số lượt đi tới', '% so với lượt bắt đầu']]);
  const funnel = QUESTION_ORDER.map(function (qid, i) {
    const r = i + 2;
    return [qid, '=COUNTIF(sessions!F2:F,">=' + i + '")', '=IFERROR(E' + r + '/$B$2,0)'];
  });
  d.getRange(2, 4, funnel.length, 3).setValues(funnel);
  d.getRange(2, 6, funnel.length, 1).setNumberFormat('0%');

  // Phân bố vai trò #1 và đánh giá theo vai trò.
  d.getRange('H1').setValue('VAI TRÒ #1 PHỔ BIẾN');
  d.getRange('H2').setFormula('=IFERROR(QUERY(results!S2:S,"select S, count(S) where S is not null group by S order by count(S) desc label count(S) \'\'",0),"")');
  d.getRange('K1').setValue('ĐÁNH GIÁ THEO VAI TRÒ #1 (trung bình, số lượt)');
  d.getRange('K2').setFormula('=IFERROR(QUERY(feedback!D2:G,"select G, avg(D), count(D) where D is not null group by G label avg(D) \'\', count(D) \'\'",0),"")');
  d.getRange('O1').setValue('NGƯỜI DÙNG NGHĨ HỢP HƠN VỚI');
  d.getRange('O2').setFormula('=IFERROR(QUERY(feedback!E2:E,"select E, count(E) where E is not null and E <> \'\' group by E order by count(E) desc label count(E) \'\'",0),"")');

  d.getRange('A1:O1').setFontWeight('bold');
  d.setFrozenRows(1);
  d.autoResizeColumns(1, 15);
}
