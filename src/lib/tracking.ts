import { QUESTION_ORDER, QUIZ_VERSION, type Answers } from '../data/questions';
import type { ScoreResult } from './scoring';
import { KEYS, load, remove, save } from './storage';

/**
 * Gửi dữ liệu ẩn danh tới Google Apps Script (xem apps-script/Code.gs).
 * - Content-Type text/plain + mode no-cors: tránh CORS preflight mà Apps Script không hỗ trợ.
 * - Gửi xong không chờ phản hồi, lỗi thì bỏ qua: không bao giờ làm chậm hay chặn bài trắc nghiệm.
 * - Sự kiện phễu được gom lại và gửi theo đợt (cuối chương, khi ra kết quả, khi rời trang).
 */

export type EventName =
  | 'quiz_start'
  | 'chapter_done'
  | 'preview_shown'
  | 'continue_full'
  | 'quiz_done'
  | 'page_hidden';

export interface TrackedEvent {
  ts: number;
  name: EventName;
  qid: string;
  idx: number;
  data?: Record<string, unknown>;
}

export interface TrackerDeps {
  endpoint?: string;
  post?: (url: string, body: string) => void;
  beacon?: (url: string, body: string) => boolean;
  isOptedOut?: () => boolean;
  device?: () => 'mobile' | 'desktop';
  now?: () => number;
}

/** Vị trí xa nhất người dùng đã trả lời, theo thứ tự cố định của câu hỏi. */
export function furthestIndex(answers: Answers): { qid: string; idx: number } {
  let idx = -1;
  for (const qid of Object.keys(answers)) idx = Math.max(idx, QUESTION_ORDER.indexOf(qid));
  return { qid: idx >= 0 ? QUESTION_ORDER[idx] : '', idx };
}

export function createTracker(deps: TrackerDeps) {
  const now = deps.now ?? Date.now;
  const device = deps.device ?? (() => 'desktop' as const);
  const configured = () => Boolean(deps.endpoint);
  const enabled = () => configured() && !(deps.isOptedOut?.() ?? false);
  let buffer: TrackedEvent[] = [];
  let attempt = '';

  /** `explicit`: người dùng tự bấm gửi (góp ý, email) — vẫn gửi kể cả khi đã tắt thu thập tự động. */
  const send = (payload: Record<string, unknown>, useBeacon = false, explicit = false) => {
    if (!(explicit ? configured() : enabled())) return;
    const body = JSON.stringify({ v: QUIZ_VERSION, aid: attempt, device: device(), ...payload });
    try {
      if (useBeacon && deps.beacon?.(deps.endpoint!, body)) return;
      deps.post?.(deps.endpoint!, body);
    } catch {
      /* bỏ qua */
    }
  };

  return {
    setAttempt(id: string) {
      attempt = id;
    },
    get attempt() {
      return attempt;
    },
    get pending() {
      return buffer.length;
    },
    event(name: EventName, answers: Answers, data?: Record<string, unknown>) {
      if (!enabled()) return;
      const { qid, idx } = furthestIndex(answers);
      buffer.push({ ts: now(), name, qid, idx, ...(data ? { data } : {}) });
    },
    flush(useBeacon = false) {
      if (!buffer.length) return;
      const events = buffer;
      buffer = [];
      send({ type: 'events', events }, useBeacon);
    },
    result(answers: Answers, r: ScoreResult, mode: 'quick' | 'full', durationSec: number) {
      send({
        type: 'result',
        mode,
        status: answers.status ?? '',
        field: answers.field ?? '',
        experience: Array.isArray(answers.experience) ? answers.experience.join(',') : '',
        time: answers.time ?? '',
        priority: answers.priority ?? '',
        answers,
        profile: r.profile,
        top: r.ranking.slice(0, 3).map((m) => ({ id: m.role.id, percent: m.percent })),
        confidence: r.confidence,
        duration: Math.round(durationSec),
      });
    },
    feedback(rating: number, betterRole: string, comment: string, top1: string) {
      send({ type: 'feedback', rating, better_role: betterRole, comment: comment.slice(0, 1000), top1 }, false, true);
    },
    email(email: string, consent: boolean, honeypot: string) {
      send({ type: 'email', email: email.trim().slice(0, 200), consent, hp: honeypot }, false, true);
    },
  };
}

export type Tracker = ReturnType<typeof createTracker>;

export function isOptedOut(): boolean {
  return load<boolean>(KEYS.optOut) === true;
}

export function setOptOut(value: boolean): void {
  if (value) save(KEYS.optOut, true);
  else remove(KEYS.optOut);
}

const endpoint = (import.meta.env.VITE_SHEETS_ENDPOINT as string | undefined)?.trim() || undefined;

export const tracker = createTracker({
  endpoint,
  isOptedOut,
  post: (url, body) => {
    void fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
    }).catch(() => undefined);
  },
  beacon: (url, body) =>
    typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function'
      ? navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=utf-8' }))
      : false,
  device: () =>
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 768px)').matches ? 'mobile' : 'desktop',
});

export const trackingEnabled = () => Boolean(endpoint);
