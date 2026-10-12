import { AI_IMPACT, type AiImpactLevel } from '../data/roles';

const STYLE: Record<AiImpactLevel, string> = {
  'ai-native': 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  boosted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  shifting: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
};

export default function AiImpactBadge({ level, long = false }: { level: AiImpactLevel; long?: boolean }) {
  const info = AI_IMPACT[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLE[level]}`}>
      <span aria-hidden>{info.emoji}</span>
      {long ? info.label : info.short}
    </span>
  );
}
