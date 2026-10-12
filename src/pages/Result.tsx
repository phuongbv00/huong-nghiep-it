import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import EmailCapture from '../components/EmailCapture';
import FeedbackBox from '../components/FeedbackBox';
import RadarChart from '../components/RadarChart';
import RoleMatchCard from '../components/RoleMatchCard';
import { dimByKey } from '../data/dimensions';
import { loadLastResult } from '../lib/quizState';
import { paceFor, score } from '../lib/scoring';
import { decodeAnswers } from '../lib/share';
import { tracker } from '../lib/tracking';

function ShareButton({ encoded }: { encoded: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/ket-qua?a=${encoded}`;
  const onClick = async () => {
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title: 'Kết quả hướng nghiệp IT của mình', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Sao chép link này:', url);
    }
  };
  return (
    <button type="button" className="btn-secondary" onClick={onClick}>
      {copied ? '✅ Đã sao chép link' : '🔗 Chia sẻ kết quả'}
    </button>
  );
}

export default function Result() {
  const [params] = useSearchParams();
  const encoded = params.get('a');
  const answers = useMemo(() => decodeAnswers(encoded), [encoded]);
  const last = useMemo(() => loadLastResult(), []);
  const own = Boolean(last && encoded && last.encoded === encoded);
  const result = useMemo(() => (answers ? score(answers) : null), [answers]);

  useEffect(() => {
    if (own && last) tracker.setAttempt(last.id);
  }, [own, last]);

  if (!encoded && last) return <Navigate to={`/ket-qua?a=${last.encoded}`} replace />;

  if (!answers || !result) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-5xl" aria-hidden>
          🧭
        </p>
        <h1 className="mt-4 text-2xl font-bold">Chưa có kết quả</h1>
        <p className="muted mt-2">Link không hợp lệ hoặc bạn chưa làm trắc nghiệm.</p>
        <Link to="/trac-nghiem" className="btn-primary mt-6">
          Làm trắc nghiệm 5 phút
        </Link>
      </div>
    );
  }

  const mode = own ? last!.mode : answers.p1 || answers.priority ? 'full' : 'quick';
  const pace = paceFor(answers);
  const top = result.ranking.slice(0, 3);
  const rest = result.ranking.slice(3);

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Hồ sơ */}
      <section className="grid items-center gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          <span className="eyebrow">{own ? 'Kết quả của bạn' : 'Kết quả được chia sẻ'}</span>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{result.summary}</h1>
          {result.topDims.length > 0 && (
            <ul className="mt-5 space-y-2">
              {result.topDims.slice(0, 3).map((k) => (
                <li key={k} className="flex gap-3">
                  <span className="text-xl" aria-hidden>
                    {dimByKey[k].emoji}
                  </span>
                  <span>
                    <span className="font-semibold">{dimByKey[k].label}</span>
                    <span className="muted"> — {dimByKey[k].description}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {result.insufficient && (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
              🤔 Bạn chọn “Không cái nào giống mình” khá nhiều nên kết quả chưa đủ tin cậy. Hãy thử làm lại và chọn đáp án gần nhất với bạn nhé.
            </p>
          )}
        </div>
        <div className="card p-4">
          <RadarChart profile={result.profile} />
        </div>
      </section>

      {own && mode === 'quick' && (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-brand-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-bold">Đây là kết quả nhanh.</span> Làm thêm khoảng 3 phút (chọn nhanh + thử tay) để kết quả chính xác hơn.
          </p>
          <Link to="/trac-nghiem?tiep=1" className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-50">
            Làm tiếp →
          </Link>
        </div>
      )}

      {/* Top 3 */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight">3 vai trò hợp với bạn nhất</h2>
          <p className="muted text-sm">
            {result.confidence === 'clear'
              ? '🎯 Xu hướng khá rõ'
              : result.confidence === 'medium'
                ? '👍 Xu hướng tương đối rõ'
                : `⚖️ Bạn hợp với nhiều hướng — ${top[0].role.name} và ${top[1].role.name} sát nhau`}
          </p>
        </div>
        <div className="mt-5 space-y-4">
          {top.map((m, i) => (
            <RoleMatchCard key={m.role.id} match={m} rank={i + 1} pace={pace} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* Xếp hạng đầy đủ */}
      <details className="card mt-6 group">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-bold [&::-webkit-details-marker]:hidden">
          Xem mức phù hợp với cả {result.ranking.length} vai trò
          <span className="text-slate-400 transition group-open:rotate-180" aria-hidden>
            ▾
          </span>
        </summary>
        <ol className="space-y-2 border-t border-slate-100 p-5 dark:border-slate-800">
          {rest.map((m, i) => (
            <li key={m.role.id}>
              <Link to={`/vai-tro/${m.role.id}`} className="flex items-center gap-3 rounded-lg py-1 hover:text-brand-700 dark:hover:text-brand-300">
                <span className="w-6 text-right text-sm text-slate-400">{i + 4}</span>
                <span aria-hidden>{m.role.emoji}</span>
                <span className="w-44 truncate text-sm font-medium sm:w-64">{m.role.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <span className="block h-full rounded-full bg-brand-400" style={{ width: `${m.percent}%` }} />
                </span>
                <span className="w-10 text-right text-sm font-semibold">{m.percent}%</span>
              </Link>
            </li>
          ))}
        </ol>
      </details>

      <div className="mt-6 flex flex-wrap gap-2">
        <ShareButton encoded={encoded!} />
        <Link to="/trac-nghiem?moi=1" className="btn-secondary">
          🔄 Làm lại
        </Link>
        <Link to="/vai-tro" className="btn-ghost">
          Khám phá tất cả vai trò →
        </Link>
      </div>

      {own && last && (
        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <FeedbackBox attemptId={last.id} top1={top[0].role.id} />
          <EmailCapture attemptId={last.id} />
        </section>
      )}

      {!own && (
        <div className="card mt-10 p-6 text-center">
          <h2 className="text-xl font-bold">Còn bạn thì sao?</h2>
          <p className="muted mt-1">5 phút để biết bạn hợp với vai trò nào trong ngành IT.</p>
          <Link to="/trac-nghiem?moi=1" className="btn-primary mt-4">
            Làm trắc nghiệm của riêng bạn
          </Link>
        </div>
      )}
    </div>
  );
}
