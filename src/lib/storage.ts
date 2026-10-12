/** localStorage có thể bị chặn (chế độ ẩn danh, trình duyệt cũ) — mọi truy cập đều bọc try/catch. */
export function load<T>(key: string): T | null {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function save(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* bỏ qua */
  }
}

export function remove(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* bỏ qua */
  }
}

export const KEYS = {
  quiz: 'hn_quiz_v1',
  lastResult: 'hn_last_result_v1',
  optOut: 'hn_optout',
  feedbackSent: 'hn_feedback_sent',
  emailSent: 'hn_email_sent',
} as const;
