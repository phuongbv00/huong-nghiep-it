import { useState } from 'react';
import { ROLES } from '../data/roles';
import { KEYS, load, save } from '../lib/storage';
import { tracker } from '../lib/tracking';

const FACES = [
  { v: 1, e: '😞', l: 'Hoàn toàn sai' },
  { v: 2, e: '🙁', l: 'Khá sai' },
  { v: 3, e: '😐', l: 'Tạm được' },
  { v: 4, e: '🙂', l: 'Khá đúng' },
  { v: 5, e: '🤩', l: 'Rất đúng' },
];

export default function FeedbackBox({ attemptId, top1 }: { attemptId: string; top1: string }) {
  const [sent, setSent] = useState(() => load<string>(KEYS.feedbackSent) === attemptId);
  const [rating, setRating] = useState<number | null>(null);
  const [better, setBetter] = useState('');
  const [comment, setComment] = useState('');

  const submit = (r: number, b = '', c = '') => {
    tracker.feedback(r, b, c, top1);
    save(KEYS.feedbackSent, attemptId);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card p-5 text-center">
        <p className="text-2xl" aria-hidden>
          💙
        </p>
        <p className="mt-1 font-semibold">Cảm ơn bạn! Góp ý của bạn giúp công cụ chính xác hơn cho người sau.</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg font-bold">Kết quả này có đúng với bạn không?</h2>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {FACES.map((f) => (
          <button
            key={f.v}
            type="button"
            aria-pressed={rating === f.v}
            onClick={() => (f.v >= 4 ? submit(f.v) : setRating(f.v))}
            className="flex flex-col items-center gap-1 rounded-xl border-2 border-transparent p-2 transition hover:bg-slate-100 aria-pressed:border-brand-500 aria-pressed:bg-brand-50 dark:hover:bg-slate-800 dark:aria-pressed:bg-brand-950"
          >
            <span className="text-3xl" aria-hidden>
              {f.e}
            </span>
            <span className="text-[11px] font-medium text-slate-500 sm:text-xs">{f.l}</span>
          </button>
        ))}
      </div>

      {rating !== null && rating <= 3 && (
        <form
          className="mt-5 animate-fade-up space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit(rating, better, comment);
          }}
        >
          <label className="block">
            <span className="text-sm font-semibold">Bạn nghĩ mình hợp với vai trò nào hơn?</span>
            <select
              value={better}
              onChange={(e) => setBetter(e.target.value)}
              className="mt-1.5 block min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">Chưa biết</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Góp ý thêm (tuỳ chọn)</span>
            <textarea
              value={comment}
              maxLength={1000}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Câu hỏi nào khó hiểu? Kết quả sai ở đâu?"
              className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Gửi góp ý
          </button>
        </form>
      )}
    </div>
  );
}
