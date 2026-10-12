import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ChapterInterstitial from '../components/ChapterInterstitial';
import ChapterProgress from '../components/ChapterProgress';
import ChipSelect from '../components/ChipSelect';
import PreviewCheckpoint from '../components/PreviewCheckpoint';
import QuestionChallenge from '../components/QuestionChallenge';
import QuestionScenario from '../components/QuestionScenario';
import QuestionThisOrThat from '../components/QuestionThisOrThat';
import {
  CHAPTERS,
  OTHER_FIELD_STATUSES,
  QUESTIONS,
  type AnswerValue,
  type Answers,
  type ChapterId,
} from '../data/questions';
import {
  buildSteps,
  chapterOfStep,
  chapterProgress,
  checkpointIndex,
  remainingLabel,
  secondsBetween,
  type Step,
} from '../lib/flow';
import { loadQuiz, newQuizState, saveLastResult, saveQuiz, type QuizState } from '../lib/quizState';
import { leaning, score } from '../lib/scoring';
import { encodeAnswers } from '../lib/share';
import { tracker } from '../lib/tracking';
import { useKeys } from '../lib/useKeys';

const ADVANCE_DELAY = 280;

function initState(params: URLSearchParams): { state: QuizState; isNew: boolean } {
  const saved = loadQuiz();
  if (params.has('moi') || !saved) return { state: newQuizState(), isNew: true };
  if (saved.finished === 'quick' && params.has('tiep')) {
    const steps = buildSteps(saved.answers);
    return { state: { ...saved, finished: undefined, step: checkpointIndex(steps) + 1 }, isNew: false };
  }
  if (saved.finished) return { state: newQuizState(), isNew: true };
  return { state: saved, isNew: false };
}

const lastIndexOfChapter = (steps: Step[], ch: ChapterId) =>
  steps.reduce((acc, s, i) => (s.type === 'question' && s.q.chapter === ch ? i : acc), -1);

export default function Quiz() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const init = useRef<ReturnType<typeof initState>>();
  if (!init.current) init.current = initState(params);

  const [state, setState] = useState<QuizState>(init.current.state);
  const [locked, setLocked] = useState(false);
  const enteredAt = useRef(Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;

  const steps = useMemo(() => buildSteps(state.answers), [state.answers]);
  const stepIdx = Math.min(Math.max(state.step, 0), steps.length - 1);
  const step = steps[stepIdx];
  const checkpoint = checkpointIndex(steps);
  const chapter = chapterOfStep(step);
  const pastCheckpoint = stepIdx > checkpoint;

  // Gắn lượt làm với tracker, ghi nhận lượt bắt đầu (một lần), xoá ?moi khỏi URL.
  useEffect(() => {
    tracker.setAttempt(state.id);
    if (init.current?.isNew) {
      init.current.isNew = false;
      tracker.event('quiz_start', {});
      tracker.flush();
    }
    if (params.has('moi') || params.has('tiep')) setParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => saveQuiz(state), [state]);

  // Người dùng rời trang/chuyển tab: gửi vị trí hiện tại bằng sendBeacon.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== 'hidden' || stateRef.current.finished) return;
      tracker.event('page_hidden', stateRef.current.answers);
      tracker.flush(true);
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  const goTo = useCallback((idx: number) => {
    enteredAt.current = Date.now();
    setState((s) => ({ ...s, step: idx }));
    window.scrollTo(0, 0);
  }, []);

  const finish = useCallback(
    (mode: 'quick' | 'full') => {
      const s = stateRef.current;
      const r = score(s.answers);
      tracker.event('quiz_done', s.answers, { mode });
      tracker.flush();
      tracker.result(s.answers, r, mode, (Date.now() - s.startedAt) / 1000);
      const encoded = encodeAnswers(s.answers);
      saveLastResult({ id: s.id, encoded, mode, at: Date.now() });
      const done = { ...s, finished: mode };
      saveQuiz(done);
      setState(done);
      navigate(`/ket-qua?a=${encoded}`);
    },
    [navigate],
  );

  const next = useCallback(() => {
    const s = stateRef.current;
    const st = buildSteps(s.answers);
    const idx = Math.min(s.step, st.length - 1);
    const cur = st[idx];
    if (cur?.type === 'question' && lastIndexOfChapter(st, cur.q.chapter) === idx) {
      const ids = QUESTIONS.filter((q) => q.chapter === cur.q.chapter).map((q) => q.id);
      const times = Object.fromEntries(ids.filter((id) => s.times[id]).map((id) => [id, Math.round(s.times[id] / 100) / 10]));
      tracker.event('chapter_done', s.answers, { chapter: cur.q.chapter, times });
    }
    if (idx + 1 >= st.length) return finish('full');
    if (st[idx + 1].type === 'checkpoint') tracker.event('preview_shown', s.answers);
    tracker.flush();
    goTo(idx + 1);
  }, [finish, goTo]);

  const answer = useCallback(
    (qid: string, value: AnswerValue, advance: boolean) => {
      if (locked) return;
      const spent = Date.now() - enteredAt.current;
      setState((s) => {
        const answers: Answers = { ...s.answers, [qid]: value };
        // Đổi trạng thái sang IT thì bỏ câu "ngành của bạn" đã trả lời trước đó.
        if (qid === 'status' && !OTHER_FIELD_STATUSES.includes(value as string)) delete answers.field;
        const next = { ...s, answers, times: { ...s.times, [qid]: (s.times[qid] ?? 0) + spent } };
        stateRef.current = next;
        return next;
      });
      enteredAt.current = Date.now();
      if (advance) {
        setLocked(true);
        window.setTimeout(() => {
          setLocked(false);
          next();
        }, ADVANCE_DELAY);
      }
    },
    [locked, next],
  );

  const back = useCallback(() => {
    if (stepIdx === 0) navigate('/');
    else goTo(stepIdx - 1);
  }, [stepIdx, goTo, navigate]);

  useKeys((e) => {
    if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
      e.preventDefault();
      back();
    }
  }, !locked);

  const preview = useMemo(() => (step?.type === 'checkpoint' ? score(state.answers) : null), [step, state.answers]);
  const lean = useMemo(() => (step?.type === 'intro' ? leaning(state.answers) : []), [step, state.answers]);

  const segments = chapterProgress(steps, stepIdx).map((p) => ({
    ...p,
    count: steps.filter((s) => s.type === 'question' && s.q.chapter === p.chapter).length,
  }));
  const remaining = !pastCheckpoint && checkpoint >= 0
    ? secondsBetween(steps, stepIdx, checkpoint)
    : secondsBetween(steps, stepIdx, steps.length);
  const chapterQs = steps.filter((s): s is Extract<Step, { type: 'question' }> => s.type === 'question' && s.q.chapter === chapter);
  const posInChapter = step?.type === 'question' ? chapterQs.findIndex((s) => s.q.id === step.q.id) + 1 : 0;

  const renderStep = () => {
    if (!step) return null;
    if (step.type === 'intro') {
      const chEnd = steps.findIndex((s, i) => i > stepIdx && s.type === 'question' && s.q.chapter !== step.chapter);
      const chSeconds = secondsBetween(steps, stepIdx + 1, chEnd === -1 ? steps.length : chEnd);
      const skippable = step.chapter === 3;
      return (
        <ChapterInterstitial
          chapter={step.chapter}
          seconds={chSeconds}
          leaning={lean}
          onStart={() => goTo(stepIdx + 1)}
          onSkip={skippable ? () => goTo(lastIndexOfChapter(steps, 3) + 1) : undefined}
        />
      );
    }
    if (step.type === 'checkpoint' && preview) {
      return (
        <PreviewCheckpoint
          result={preview}
          extraMinutes={Math.max(1, Math.ceil(secondsBetween(steps, checkpoint + 1, steps.length) / 60))}
          onContinue={() => {
            tracker.event('continue_full', state.answers);
            goTo(checkpoint + 1);
          }}
          onFinish={() => finish('quick')}
        />
      );
    }
    if (step.type !== 'question') return null;
    const q = step.q;
    const value = state.answers[q.id];
    switch (q.kind) {
      case 'context':
        return <ChipSelect key={q.id} q={q} value={value} locked={locked} onAnswer={(v, adv) => answer(q.id, v, adv)} />;
      case 'scenario':
      case 'priority':
        return (
          <QuestionScenario key={q.id} q={q} value={value as string | undefined} seed={state.id} locked={locked} onAnswer={(v) => answer(q.id, v, true)} />
        );
      case 'pair':
        return <QuestionThisOrThat key={q.id} q={q} value={value as string | undefined} locked={locked} onAnswer={(v) => answer(q.id, v, true)} />;
      case 'challenge':
        return (
          <QuestionChallenge
            key={q.id}
            q={q}
            value={value as string | undefined}
            locked={locked}
            onAnswer={(v) => answer(q.id, v, v === 'skip')}
            onNext={next}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/90">
        <div className="mx-auto w-full max-w-xl px-4 pb-3 pt-3">
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={back} className="btn-ghost min-h-[40px] px-2.5 py-1.5 text-sm" aria-label="Quay lại câu trước">
              ← <span className="hidden sm:inline">Quay lại</span>
            </button>
            <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">
              <span className="text-slate-400">Chương {chapter} · </span>
              {CHAPTERS[chapter].title}
              {posInChapter > 0 && <span className="ml-1.5 text-slate-400">{posInChapter}/{chapterQs.length}</span>}
            </p>
            <Link to="/" className="btn-ghost min-h-[40px] px-2.5 py-1.5 text-sm" aria-label="Lưu và thoát" title="Tiến độ đã được lưu">
              ✕
            </Link>
          </div>
          <div className="mt-2.5">
            <ChapterProgress segments={segments} current={chapter} optionalLocked={!pastCheckpoint} />
          </div>
          <p className="muted mt-1.5 text-right text-xs">
            {step?.type === 'checkpoint'
              ? 'Đã xong phần bắt buộc'
              : `${remainingLabel(remaining)}${!pastCheckpoint ? ' tới kết quả sơ bộ' : ''}`}
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-6 sm:pt-10">{renderStep()}</main>
    </div>
  );
}
