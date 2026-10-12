import { describe, expect, it } from 'vitest';
import { QUESTIONS, type Answers } from '../data/questions';
import { ROLES } from '../data/roles';
import { collect, leaning, score, weightedCorrelation } from './scoring';

const top = (a: Answers, n = 3) => score(a).ranking.slice(0, n).map((m) => m.role.id);

const scenarios = (picks: string) =>
  Object.fromEntries(picks.split('').map((p, i) => [`s${i + 1}`, p])) as Answers;

describe('score', () => {
  it('người thích thiết kế → UI/UX hoặc Frontend trong top 3', () => {
    const a: Answers = { ...scenarios('acdacdda'), p1: 'left', p2: 'right' };
    const t = top(a);
    expect(t).toContain('uiux');
  });

  it('người thích toán + nghiên cứu → Data Scientist hoặc ML Engineer trong top 3', () => {
    const a: Answers = { ...scenarios('cabcadba'), p2: 'left', p4: 'left', p7: 'right' };
    const t = top(a);
    expect(t.some((id) => id === 'data-scientist' || id === 'ml-eng')).toBe(true);
  });

  it('dân tài chính không biết code → Data Analyst hoặc BA trong top 3', () => {
    const a: Answers = {
      status: 'other_worker',
      field: 'finance',
      experience: ['excel'],
      ...scenarios('cdccc dcd'.replace(' ', '')),
    };
    const t = top(a);
    expect(t.some((id) => id === 'data-analyst' || id === 'ba')).toBe(true);
  });

  it('người thích hệ thống → DevOps hoặc MLOps trong top 3', () => {
    const a: Answers = { ...scenarios('babbcaad'), p1: 'right', p3: 'right' };
    const t = top(a);
    expect(t.some((id) => id === 'devops' || id === 'mlops')).toBe(true);
  });

  it('người thích tìm lỗ hổng → Security hoặc QA trong top 3', () => {
    const a: Answers = { ...scenarios('bbdbcbad'), p6: 'left' };
    const t = top(a);
    expect(t.some((id) => id === 'security' || id === 'qa')).toBe(true);
  });

  it('người thích giao tiếp + kinh doanh → PM/BA/Solutions trong top 3', () => {
    const a: Answers = { ...scenarios('dcccddcb'), p5: 'right' };
    const t = top(a);
    expect(t.some((id) => ['pm', 'ba', 'solutions'].includes(id))).toBe(true);
  });

  it('người thích xây nhanh + AI → AI App Engineer hoặc Fullstack trong top 3', () => {
    const a: Answers = { ...scenarios('babbbbbc'), p3: 'left', p7: 'left' };
    const t = top(a);
    expect(t.some((id) => id === 'ai-app' || id === 'fullstack')).toBe(true);
  });

  it('chọn toàn "không cái nào" → không lỗi và báo chưa đủ dữ liệu', () => {
    const a: Answers = Object.fromEntries(
      QUESTIONS.filter((q) => q.kind === 'scenario').map((q) => [q.id, 'none']),
    );
    const r = score(a);
    expect(r.insufficient).toBe(true);
    expect(r.ranking).toHaveLength(ROLES.length);
    expect(r.ranking.every((m) => Number.isFinite(m.percent))).toBe(true);
  });

  it('điểm luôn trong khoảng 0–100 với câu trả lời ngẫu nhiên', () => {
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 200; i++) {
      const a: Answers = {};
      for (const q of QUESTIONS) {
        if (q.kind === 'scenario' || q.kind === 'challenge' || q.kind === 'priority' || q.kind === 'context') {
          const opts = [...q.options.map((o) => o.id), 'none'];
          a[q.id] = opts[Math.floor(rand() * opts.length)];
        } else {
          a[q.id] = ['left', 'right', 'both'][Math.floor(rand() * 3)];
        }
      }
      const r = score(a);
      for (const v of Object.values(r.profile)) expect(v).toBeGreaterThanOrEqual(0), expect(v).toBeLessThanOrEqual(100);
      for (const m of r.ranking) expect(m.percent).toBeGreaterThanOrEqual(0), expect(m.percent).toBeLessThanOrEqual(99);
    }
  });

  it('xếp hạng ổn định (cùng input → cùng output)', () => {
    const a: Answers = scenarios('abcdabcd');
    expect(top(a, 18)).toEqual(top(a, 18));
  });

  it('thử thách sai không làm giảm điểm, đúng thì tăng', () => {
    const base: Answers = scenarios('abcdabcd');
    const wrong = { ...base, c3: 'a' };
    const right = { ...base, c3: 'c' };
    const p0 = collect(base).normalized.code;
    expect(collect(wrong).normalized.code).toBe(p0);
    expect(collect(right).normalized.code).toBeGreaterThan(p0);
  });

  it('ngành cũ tạo lợi thế và giải thích', () => {
    const a: Answers = { status: 'other_worker', field: 'design', ...scenarios('acdacdda') };
    const ui = score(a).ranking.find((m) => m.role.id === 'uiux')!;
    expect(ui.advantage).toBeTruthy();
  });

  it('lý do trích lại đáp án người dùng', () => {
    const a: Answers = scenarios('acdacdda');
    const ui = score(a).ranking.find((m) => m.role.id === 'uiux')!;
    expect(ui.reasons.length).toBeGreaterThan(0);
    expect(ui.reasons[0].text).toMatch(/bạn chọn|Bạn thích/);
  });
});

describe('weightedCorrelation', () => {
  it('vector giống nhau → 1', () => {
    const r = ROLES[0].vector;
    expect(weightedCorrelation(r, r)).toBeCloseTo(1);
  });
});

describe('leaning', () => {
  it('trả về rỗng khi chưa trả lời', () => {
    expect(leaning({})).toEqual([]);
  });
  it('nghiêng về thiết kế khi chọn thiết kế', () => {
    expect(leaning({ s1: 'a', s4: 'a' })[0]).toBe('design');
  });
});
