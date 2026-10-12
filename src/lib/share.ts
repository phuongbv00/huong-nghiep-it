import type { Answers } from '../data/questions';

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Mã hoá câu trả lời vào URL để chia sẻ kết quả mà không cần máy chủ. */
export function encodeAnswers(answers: Answers): string {
  return toBase64Url(JSON.stringify(answers));
}

export function decodeAnswers(encoded: string | null): Answers | null {
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const out: Answers = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string') out[k] = v.slice(0, 40);
      else if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === 'string').slice(0, 20);
    }
    return out;
  } catch {
    return null;
  }
}
