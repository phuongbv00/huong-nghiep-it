import type { AnswerValue, ContextQuestion } from '../data/questions';
import { useKeys } from '../lib/useKeys';
import OptionButton from './OptionButton';

interface Props {
  q: ContextQuestion;
  value: AnswerValue | undefined;
  onAnswer: (v: AnswerValue, advance: boolean) => void;
  locked: boolean;
}

/** Câu hỏi bối cảnh (chương 0): chọn 1 thì tự sang câu; chọn nhiều thì có nút Tiếp. */
export default function ChipSelect({ q, value, onAnswer, locked }: Props) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (id: string) => {
    if (!q.multi) return onAnswer(id, true);
    let next: string[];
    if (id === 'none') next = selected.includes('none') ? [] : ['none'];
    else {
      const base = selected.filter((x) => x !== 'none');
      next = base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    }
    onAnswer(next, false);
  };

  useKeys((e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= q.options.length) toggle(q.options[n - 1].id);
    else if (e.key === 'Enter' && q.multi && selected.length) onAnswer(selected, true);
  }, !locked);

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{q.prompt}</h1>
      {q.hint && <p className="muted mt-2">{q.hint}</p>}
      {q.multi ? (
        <>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {q.options.map((o) => (
              <button key={o.id} type="button" className="chip" aria-pressed={selected.includes(o.id)} onClick={() => toggle(o.id)}>
                <span aria-hidden>{o.emoji}</span>
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <button type="button" className="btn-primary w-full sm:w-auto" disabled={!selected.length || locked} onClick={() => onAnswer(selected, true)}>
              Tiếp tục →
            </button>
          </div>
        </>
      ) : (
        <div className={`mt-6 grid gap-2.5 ${q.options.length > 6 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
          {q.options.map((o, i) => (
            <OptionButton key={o.id} index={i < 9 ? i : undefined} emoji={o.emoji} selected={selected.includes(o.id)} disabled={locked} onClick={() => toggle(o.id)}>
              {o.label}
            </OptionButton>
          ))}
        </div>
      )}
    </div>
  );
}
