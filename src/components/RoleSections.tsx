import type { ReactNode } from 'react';
import type { Role } from '../data/roles';
import AiImpactBadge from './AiImpactBadge';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function AiImpactBlock({ role }: { role: Role }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <AiImpactBadge level={role.aiImpact.level} long />
      <p className="mt-2 text-[15px] leading-relaxed">{role.aiImpact.text}</p>
    </div>
  );
}

export function SkillList({ role }: { role: Role }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold">Kỹ năng cốt lõi</p>
        <ul className="flex flex-wrap gap-1.5">
          {role.coreSkills.map((s) => (
            <li key={s} className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm dark:bg-slate-800">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">🤖 Kỹ năng AI cần thêm</p>
        <ul className="flex flex-wrap gap-1.5">
          {role.aiSkills.map((s) => (
            <li key={s} className="rounded-lg bg-sky-50 px-2.5 py-1 text-sm text-sky-900 dark:bg-sky-950/60 dark:text-sky-200">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Roadmap({ role, perPhase }: { role: Role; perPhase?: string }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-brand-200 pl-5 dark:border-brand-900">
      {role.roadmap.map((phase, i) => (
        <li key={phase.title} className="relative">
          <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {i + 1}
          </span>
          <p className="font-semibold">
            {phase.title}
            {perPhase && <span className="ml-2 text-sm font-medium text-slate-500">{perPhase}</span>}
          </p>
          <ul className="muted mt-1 list-disc space-y-0.5 pl-5 text-[15px]">
            {phase.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function FirstWeek({ role }: { role: Role }) {
  return (
    <ul className="space-y-2">
      {role.firstWeek.map((t) => (
        <li key={t} className="flex gap-2.5 text-[15px]">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-brand-400" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Resources({ role }: { role: Role }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {role.resources.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium hover:border-brand-400 hover:text-brand-700 dark:border-slate-800 dark:hover:text-brand-300"
          >
            {r.label}
            <span aria-hidden>↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Salary({ role }: { role: Role }) {
  const rows = [
    ['Junior', role.salary.junior],
    ['Middle', role.salary.middle],
    ['Senior', role.salary.senior],
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {rows.map(([k, val]) => (
          <div key={k} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
            <p className="text-xs font-semibold text-slate-500">{k}</p>
            <p className="mt-0.5 font-bold">{val}</p>
          </div>
        ))}
      </div>
      <p className="muted mt-1.5 text-xs">Triệu VND/tháng (gross), ước lượng tham khảo — dao động lớn theo công ty và năng lực.</p>
    </div>
  );
}

export function DifficultyDots({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" title={`Độ khó: ${value}/5`}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i <= value ? 'bg-brand-600 dark:bg-brand-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </span>
      <span className="font-medium">{label}</span>
    </span>
  );
}
