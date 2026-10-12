import {
  CHAPTERS,
  QUICK_LAST_CHAPTER,
  visibleQuestions,
  type Answers,
  type ChapterId,
  type Question,
} from '../data/questions';

export type Step =
  | { type: 'intro'; chapter: ChapterId }
  | { type: 'question'; q: Question }
  | { type: 'checkpoint' };

/** Chuỗi màn hình của bài trắc nghiệm, tính lại mỗi khi câu trả lời thay đổi (câu điều kiện). */
export function buildSteps(answers: Answers): Step[] {
  const qs = visibleQuestions(answers);
  const steps: Step[] = [];
  for (const ch of CHAPTERS) {
    const inChapter = qs.filter((q) => q.chapter === ch.id);
    if (!inChapter.length) continue;
    // Chương 0 đã được giới thiệu ở trang chủ; chương 4 chỉ có 1 câu.
    if (ch.id !== 0 && ch.id !== 4) steps.push({ type: 'intro', chapter: ch.id });
    for (const q of inChapter) steps.push({ type: 'question', q });
    if (ch.id === QUICK_LAST_CHAPTER) steps.push({ type: 'checkpoint' });
  }
  return steps;
}

export function checkpointIndex(steps: Step[]): number {
  return steps.findIndex((s) => s.type === 'checkpoint');
}

export function chapterOfStep(step: Step | undefined): ChapterId {
  if (!step) return 0;
  if (step.type === 'intro') return step.chapter;
  if (step.type === 'question') return step.q.chapter;
  return QUICK_LAST_CHAPTER;
}

/** Số giây ước tính cho các câu hỏi từ vị trí `from` tới `to` (không tính `to`). */
export function secondsBetween(steps: Step[], from: number, to: number): number {
  let s = 0;
  for (let i = Math.max(0, from); i < Math.min(to, steps.length); i++) {
    const st = steps[i];
    if (st.type === 'question') s += st.q.seconds;
    else if (st.type === 'intro') s += 4;
  }
  return s;
}

export function remainingLabel(seconds: number): string {
  if (seconds <= 0) return 'Sắp xong!';
  if (seconds < 60) return 'Còn chưa tới 1 phút';
  return `Còn khoảng ${Math.ceil(seconds / 60)} phút`;
}

/** Tiến độ từng chương (0–1) để vẽ thanh tiến độ chia đoạn. */
export function chapterProgress(steps: Step[], current: number): { chapter: ChapterId; done: number }[] {
  return CHAPTERS.map((ch) => {
    const idx = steps
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.type === 'question' && s.q.chapter === ch.id)
      .map(({ i }) => i);
    if (!idx.length) return { chapter: ch.id, done: 0 };
    const done = idx.filter((i) => i < current).length / idx.length;
    return { chapter: ch.id, done };
  });
}

/** Trộn thứ tự đáp án theo seed để tránh thiên vị vị trí nhưng vẫn ổn định khi quay lại. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
