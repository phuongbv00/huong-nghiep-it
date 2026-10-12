import {
  DIM_KEYS,
  SIGNAL_KEYS,
  SIGNAL_MATCH_WEIGHT,
  dimByKey,
  type DimKey,
  type SignalKey,
  type Weights,
} from '../data/dimensions';
import {
  BOTH,
  NONE,
  SKIP,
  visibleQuestions,
  type Answers,
  type Question,
} from '../data/questions';
import { EXPERIENCE_BONUS, FIELD_TRANSFER, ROLES, type PriorityKey, type Role } from '../data/roles';

/** Hệ số theo chương (xem kế hoạch: tình huống 1.0, chọn nhanh 0.7, thử tay tối đa 0.5). */
export const FACTOR = { scenario: 1, pair: 0.7, challenge: 0.5 } as const;
const CHALLENGE_WEIGHT = 2;
/** Ưu tiên ở chương 4 chỉ đủ để đảo thứ tự khi hai vai trò chênh nhau rất ít. */
const PRIORITY_STEP = 0.012;
const MIN_ANSWERS = 3;

export interface Contribution {
  qid: string;
  weights: Weights;
  factor: number;
  reason: string;
}

export interface Reason {
  qid: string;
  text: string;
}

export interface RoleMatch {
  role: Role;
  /** 0–99 */
  percent: number;
  score: number;
  reasons: Reason[];
  advantage?: string;
  /** Độ khó vào nghề với hồ sơ của người dùng, 1–5. */
  difficulty: number;
}

export type Confidence = 'clear' | 'medium' | 'mixed';

export interface ScoreResult {
  profile: Record<DimKey, number>;
  build: number;
  ranking: RoleMatch[];
  confidence: Confidence;
  insufficient: boolean;
  answeredCount: number;
  topDims: DimKey[];
  summary: string;
}

const unquote = (s: string) => s.replace(/^"|"$/g, '');

const emptySignals = (): Record<SignalKey, number> =>
  Object.fromEntries(SIGNAL_KEYS.map((k) => [k, 0])) as Record<SignalKey, number>;

function addWeights(target: Record<SignalKey, number>, w: Weights, factor: number) {
  for (const k of SIGNAL_KEYS) target[k] += (w[k] ?? 0) * factor;
}

function maxWeights(options: { weights?: Weights }[]): Record<SignalKey, number> {
  const m = emptySignals();
  for (const o of options) for (const k of SIGNAL_KEYS) m[k] = Math.max(m[k], o.weights?.[k] ?? 0);
  return m;
}

/** Biến câu trả lời thành danh sách đóng góp điểm + mức tối đa có thể đạt cho từng chiều. */
export function collect(answers: Answers, questions: Question[] = visibleQuestions(answers)) {
  const raw = emptySignals();
  const max = emptySignals();
  const contributions: Contribution[] = [];
  let answeredCount = 0;

  for (const q of questions) {
    const a = answers[q.id];
    if (a === undefined || a === NONE || a === SKIP) continue;

    if (q.kind === 'scenario') {
      const opt = q.options.find((o) => o.id === a);
      if (!opt?.weights) continue;
      answeredCount++;
      addWeights(raw, opt.weights, FACTOR.scenario);
      addWeights(max, maxWeights(q.options), FACTOR.scenario);
      contributions.push({
        qid: q.id,
        weights: opt.weights,
        factor: FACTOR.scenario,
        reason: `${q.day}: bạn chọn “${unquote(opt.label)}”`,
      });
    } else if (q.kind === 'pair') {
      const picks = a === BOTH ? [q.left, q.right] : a === 'left' ? [q.left] : a === 'right' ? [q.right] : [];
      if (!picks.length) continue;
      answeredCount++;
      const factor = a === BOTH ? FACTOR.pair / 2 : FACTOR.pair;
      for (const p of picks) {
        addWeights(raw, p.weights ?? {}, factor);
        contributions.push({
          qid: q.id,
          weights: p.weights ?? {},
          factor,
          reason: `Bạn thích “${p.label.toLowerCase()}”`,
        });
      }
      addWeights(max, maxWeights([q.left, q.right]), FACTOR.pair);
    } else if (q.kind === 'challenge') {
      // Sai không bị trừ: chỉ khi đúng mới cộng cả điểm lẫn mức tối đa.
      if (a !== q.correct) continue;
      const w: Weights = { [q.dim]: CHALLENGE_WEIGHT };
      addWeights(raw, w, FACTOR.challenge);
      addWeights(max, w, FACTOR.challenge);
      contributions.push({
        qid: q.id,
        weights: w,
        factor: FACTOR.challenge,
        reason: `Bạn giải đúng thử thách “${q.title}”`,
      });
    }
  }

  const normalized = emptySignals();
  for (const k of SIGNAL_KEYS) normalized[k] = max[k] > 0 ? Math.round((raw[k] / max[k]) * 100) : 0;

  return { normalized, contributions, answeredCount };
}

/** Tương quan Pearson có trọng số giữa hai vector tín hiệu, trong khoảng [-1, 1]. */
export function weightedCorrelation(
  a: Record<SignalKey, number>,
  b: Record<SignalKey, number>,
): number {
  const w = SIGNAL_MATCH_WEIGHT;
  const wSum = SIGNAL_KEYS.reduce((s, k) => s + w[k], 0);
  const meanA = SIGNAL_KEYS.reduce((s, k) => s + w[k] * a[k], 0) / wSum;
  const meanB = SIGNAL_KEYS.reduce((s, k) => s + w[k] * b[k], 0) / wSum;
  let num = 0;
  let da = 0;
  let db = 0;
  for (const k of SIGNAL_KEYS) {
    const x = a[k] - meanA;
    const y = b[k] - meanB;
    num += w[k] * x * y;
    da += w[k] * x * x;
    db += w[k] * y * y;
  }
  if (da === 0 || db === 0) return 0;
  return num / Math.sqrt(da * db);
}

function contextBonus(role: Role, answers: Answers): { bonus: number; advantage?: string } {
  let bonus = 0;
  let advantage: string | undefined;
  const field = answers.field;
  if (typeof field === 'string' && FIELD_TRANSFER[field]) {
    bonus += FIELD_TRANSFER[field].bonus[role.id] ?? 0;
    advantage = FIELD_TRANSFER[field].advantage[role.id];
  }
  const exp = Array.isArray(answers.experience) ? answers.experience : [];
  for (const e of exp) bonus += EXPERIENCE_BONUS[e]?.[role.id] ?? 0;
  const priority = answers.priority as PriorityKey | undefined;
  if (priority && role.attrs[priority]) bonus += PRIORITY_STEP * (role.attrs[priority] - 2);
  return { bonus, advantage };
}

const IT_STATUSES = ['it_junior', 'it_senior', 'intern', 'it_switch'];

export function personalDifficulty(role: Role, answers: Answers, hasFieldAdvantage: boolean): number {
  let d: number = role.entryDifficulty;
  if (IT_STATUSES.includes(answers.status as string)) d -= 1;
  if (hasFieldAdvantage) d -= 1;
  const exp = Array.isArray(answers.experience) ? answers.experience : [];
  if (exp.includes('code') && ['build', 'ai', 'data', 'infra'].includes(role.group)) d -= 0.5;
  return Math.max(1, Math.min(5, Math.round(d)));
}

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Rất dễ bắt đầu',
  2: 'Dễ bắt đầu',
  3: 'Vừa sức',
  4: 'Thử thách',
  5: 'Khó, cần đầu tư dài hạn',
};

function reasonsFor(role: Role, contributions: Contribution[]): Reason[] {
  const mean = SIGNAL_KEYS.reduce((s, k) => s + role.vector[k], 0) / SIGNAL_KEYS.length;
  return contributions
    .map((c) => ({
      c,
      rel: SIGNAL_KEYS.reduce((s, k) => s + (c.weights[k] ?? 0) * c.factor * (role.vector[k] - mean), 0),
    }))
    .filter((x) => x.rel > 0.5)
    .sort((x, y) => y.rel - x.rel)
    .slice(0, 3)
    .map((x) => ({ qid: x.c.qid, text: x.c.reason }));
}

export function score(answers: Answers): ScoreResult {
  const { normalized, contributions, answeredCount } = collect(answers);

  const ranking: RoleMatch[] = ROLES.map((role) => {
    const r = weightedCorrelation(normalized, role.vector);
    const { bonus, advantage } = contextBonus(role, answers);
    const s = r + bonus;
    return {
      role,
      score: s,
      percent: Math.max(0, Math.min(99, Math.round(50 + 50 * s))),
      reasons: reasonsFor(role, contributions),
      advantage,
      difficulty: personalDifficulty(role, answers, Boolean(advantage)),
    };
  }).sort((a, b) => b.score - a.score);

  const gap = ranking[0].percent - ranking[2].percent;
  const confidence: Confidence = gap >= 8 ? 'clear' : gap >= 4 ? 'medium' : 'mixed';

  const profile = Object.fromEntries(DIM_KEYS.map((k) => [k, normalized[k]])) as Record<DimKey, number>;
  const topDims = [...DIM_KEYS].sort((a, b) => profile[b] - profile[a]).filter((k) => profile[k] > 0);
  const summary =
    topDims.length >= 2
      ? `Bạn là ${dimByKey[topDims[0]].noun}, ${dimByKey[topDims[1]].modifier}.`
      : topDims.length === 1
        ? `Bạn là ${dimByKey[topDims[0]].noun}.`
        : 'Chưa đủ dữ liệu để phác hoạ hồ sơ của bạn.';

  return {
    profile,
    build: normalized.build,
    ranking,
    confidence,
    insufficient: answeredCount < MIN_ANSWERS,
    answeredCount,
    topDims,
    summary,
  };
}

/** Hai chiều nổi bật nhất hiện tại — dùng cho màn hình "Bạn đang nghiêng về…". */
export function leaning(answers: Answers): DimKey[] {
  const { normalized, answeredCount } = collect(answers);
  if (answeredCount === 0) return [];
  return [...DIM_KEYS]
    .filter((k) => normalized[k] > 0)
    .sort((a, b) => normalized[b] - normalized[a])
    .slice(0, 2);
}

export const PACE: Record<string, { perPhase: string; total: string }> = {
  lt5: { perPhase: '~2 tháng', total: 'khoảng 6 tháng' },
  '5to10': { perPhase: '~6 tuần', total: 'khoảng 4–5 tháng' },
  '10to20': { perPhase: '~1 tháng', total: 'khoảng 3 tháng' },
  fulltime: { perPhase: '2–3 tuần', total: 'khoảng 6–8 tuần' },
};

export function paceFor(answers: Answers) {
  return PACE[answers.time as string] ?? PACE['10to20'];
}
