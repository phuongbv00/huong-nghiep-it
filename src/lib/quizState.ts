import type { Answers } from '../data/questions';
import { KEYS, load, remove, save } from './storage';

export interface QuizState {
  id: string;
  answers: Answers;
  step: number;
  startedAt: number;
  /** Số mili-giây người dùng dừng ở mỗi câu. */
  times: Record<string, number>;
  finished?: 'quick' | 'full';
}

export interface LastResult {
  id: string;
  encoded: string;
  mode: 'quick' | 'full';
  at: number;
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function newQuizState(): QuizState {
  return { id: newId(), answers: {}, step: 0, startedAt: Date.now(), times: {} };
}

export function loadQuiz(): QuizState | null {
  const s = load<QuizState>(KEYS.quiz);
  if (!s || typeof s !== 'object' || !s.id || typeof s.answers !== 'object') return null;
  return s;
}

export const saveQuiz = (s: QuizState) => save(KEYS.quiz, s);
export const clearQuiz = () => remove(KEYS.quiz);

/** Có bài đang làm dở (đã trả lời ít nhất 1 câu, chưa xong). */
export function hasQuizInProgress(): boolean {
  const s = loadQuiz();
  return Boolean(s && !s.finished && Object.keys(s.answers).length > 0);
}

export const loadLastResult = () => load<LastResult>(KEYS.lastResult);
export const saveLastResult = (r: LastResult) => save(KEYS.lastResult, r);
