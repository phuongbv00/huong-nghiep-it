import { Link } from 'react-router-dom';
import { groupById, type Role } from '../data/roles';
import { DIFFICULTY_LABEL } from '../lib/scoring';
import AiImpactBadge from './AiImpactBadge';
import { DifficultyDots } from './RoleSections';

/** Thẻ gọn cho trang danh mục vai trò. */
export default function RoleCard({ role, percent }: { role: Role; percent?: number }) {
  return (
    <Link to={`/vai-tro/${role.id}`} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:hover:border-brand-800">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800" aria-hidden>
          {role.emoji}
        </span>
        {percent !== undefined ? (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">{percent}% hợp</span>
        ) : (
          <AiImpactBadge level={role.aiImpact.level} />
        )}
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">
        {groupById[role.group].emoji} {groupById[role.group].name}
      </p>
      <h3 className="mt-0.5 text-lg font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">{role.name}</h3>
      <p className="muted text-sm">{role.plain}</p>
      <p className="mt-3 flex-1 text-[15px]">{role.tagline}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <DifficultyDots value={role.entryDifficulty} label={DIFFICULTY_LABEL[role.entryDifficulty]} />
        {percent !== undefined && <AiImpactBadge level={role.aiImpact.level} />}
      </div>
    </Link>
  );
}
