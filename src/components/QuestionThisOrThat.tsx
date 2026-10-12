import { BOTH, type PairQuestion } from '../data/questions';
import { useKeys } from '../lib/useKeys';

interface Props {
  q: PairQuestion;
  value: string | undefined;
  onAnswer: (v: string) => void;
  locked: boolean;
}

export default function QuestionThisOrThat({ q, value, onAnswer, locked }: Props) {
  useKeys((e) => {
    if (e.key === '1') onAnswer('left');
    else if (e.key === '2') onAnswer('right');
    else if (e.key === '3') onAnswer(BOTH);
  }, !locked);

  const card = (side: 'left' | 'right', i: number) => {
    const o = side === 'left' ? q.left : q.right;
    return (
      <button
        type="button"
        aria-pressed={value === side}
        disabled={locked}
        onClick={() => onAnswer(side)}
        className="option-card relative min-h-[150px] flex-col items-center justify-center gap-3 px-3 py-6 text-center sm:min-h-[190px]"
      >
        <span className="text-4xl sm:text-5xl" aria-hidden>
          {o.emoji}
        </span>
        <span className="text-base font-semibold sm:text-lg">{o.label}</span>
        <span className="kbd absolute right-3 top-3">{i}</span>
      </button>
    );
  };

  return (
    <div className="animate-fade-up" key={q.id}>
      <h1 className="text-center text-xl font-bold sm:text-2xl">Bạn thích hơn?</h1>
      <div className="relative mt-6 grid grid-cols-2 gap-3">
        {card('left', 1)}
        {card('right', 2)}
        <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-slate-50 bg-slate-900 text-xs font-extrabold text-white dark:border-slate-950 dark:bg-white dark:text-slate-900">
          VS
        </span>
      </div>
      <div className="mt-4 text-center">
        <button
          type="button"
          disabled={locked}
          aria-pressed={value === BOTH}
          onClick={() => onAnswer(BOTH)}
          className={`chip ${value === BOTH ? '' : 'border-dashed'}`}
        >
          🤷 Cả hai đều được <span className="kbd">3</span>
        </button>
      </div>
    </div>
  );
}
