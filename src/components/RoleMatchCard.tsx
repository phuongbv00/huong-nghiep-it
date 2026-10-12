import { Link } from 'react-router-dom';
import { groupById } from '../data/roles';
import { DIFFICULTY_LABEL, type RoleMatch } from '../lib/scoring';
import { AiImpactBlock, DifficultyDots, FirstWeek, Roadmap, Salary, Section } from './RoleSections';

interface Props {
  match: RoleMatch;
  rank: number;
  pace: { perPhase: string; total: string };
  defaultOpen?: boolean;
}

function PercentRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16 shrink-0" aria-label={`${value}% phù hợp`}>
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} className="fill-none stroke-slate-100 dark:stroke-slate-800" strokeWidth="7" />
        <circle cx="32" cy="32" r={r} className="fill-none stroke-brand-600 dark:stroke-brand-400" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-extrabold">{value}%</span>
    </div>
  );
}

/** Thẻ chi tiết cho top 3 ở trang kết quả. */
export default function RoleMatchCard({ match, rank, pace, defaultOpen }: Props) {
  const { role } = match;
  return (
    <details className="card group overflow-hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <PercentRing value={match.percent} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-500">
            #{rank} · {groupById[role.group].emoji} {groupById[role.group].name}
          </p>
          <h3 className="text-lg font-bold leading-snug sm:text-xl">
            {role.emoji} {role.name}
          </h3>
          <p className="muted text-sm">{role.plain}</p>
        </div>
        <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>

      <div className="border-t border-slate-100 px-5 pb-6 pt-1 dark:border-slate-800">
        <p className="mt-4 text-[15px]">{role.dayInLife}</p>

        {match.reasons.length > 0 && (
          <Section title="Vì sao hợp với bạn">
            <ul className="space-y-1.5">
              {match.reasons.map((r) => (
                <li key={r.qid + r.text} className="flex gap-2 text-[15px]">
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {r.text}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {match.advantage && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[15px] text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <span className="font-bold">⭐ Lợi thế từ ngành cũ: </span>
            {match.advantage}
          </div>
        )}

        <Section title="Tác động của AI">
          <AiImpactBlock role={role} />
        </Section>

        <Section title="Độ khó bắt đầu với hồ sơ của bạn">
          <DifficultyDots value={match.difficulty} label={DIFFICULTY_LABEL[match.difficulty]} />
        </Section>

        <Section title={`Lộ trình · ${pace.total} với thời gian học của bạn`}>
          <Roadmap role={role} perPhase={pace.perPhase} />
        </Section>

        <Section title="Việc làm ngay tuần này">
          <FirstWeek role={role} />
        </Section>

        <Section title="Lương tham khảo">
          <Salary role={role} />
        </Section>

        <Link to={`/vai-tro/${role.id}`} className="btn-secondary mt-6 w-full">
          Xem chi tiết vai trò & tài nguyên học →
        </Link>
      </div>
    </details>
  );
}
