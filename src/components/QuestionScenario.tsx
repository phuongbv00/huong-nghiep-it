import { useMemo } from 'react';
import { NONE, type PriorityQuestion, type ScenarioQuestion } from '../data/questions';
import { seededShuffle } from '../lib/flow';
import { useKeys } from '../lib/useKeys';
import OptionButton from './OptionButton';

interface Props {
  q: ScenarioQuestion | PriorityQuestion;
  value: string | undefined;
  seed: string;
  onAnswer: (v: string) => void;
  locked: boolean;
}

/** Câu tình huống (chương 1) và câu ưu tiên (chương 4): chọn 1, tự sang câu tiếp. */
export default function QuestionScenario({ q, value, seed, onAnswer, locked }: Props) {
  const options = useMemo(
    () => (q.kind === 'scenario' ? seededShuffle(q.options, seed + q.id) : q.options),
    [q, seed],
  );

  useKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= options.length) onAnswer(options[n - 1].id);
    else if (e.key === '0' && q.kind === 'scenario') onAnswer(NONE);
  }, !locked);

  return (
    <div className="animate-fade-up" key={q.id}>
      {q.kind === 'scenario' ? (
        <>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-2xl dark:bg-brand-950" aria-hidden>
              {q.emoji}
            </span>
            <span className="eyebrow">{q.day}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-[28px]">{q.prompt}</h1>
        </>
      ) : (
        <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{q.prompt}</h1>
      )}
      <div className="mt-6 grid gap-2.5">
        {options.map((o, i) => (
          <OptionButton key={o.id} index={i} emoji={o.emoji} selected={value === o.id} disabled={locked} onClick={() => onAnswer(o.id)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
      {q.kind === 'scenario' && (
        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={locked}
            onClick={() => onAnswer(NONE)}
            className={`rounded-lg px-3 py-2 text-sm font-medium underline-offset-4 hover:underline ${
              value === NONE ? 'text-brand-700 underline dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Không cái nào giống mình
          </button>
        </div>
      )}
    </div>
  );
}
