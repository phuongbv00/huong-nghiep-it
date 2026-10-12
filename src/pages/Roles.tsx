import { useMemo, useState } from 'react';
import RoleCard from '../components/RoleCard';
import { AI_IMPACT, GROUPS, ROLES, type AiImpactLevel, type GroupId } from '../data/roles';
import { loadLastResult } from '../lib/quizState';
import { score } from '../lib/scoring';
import { decodeAnswers } from '../lib/share';

export default function Roles() {
  const [group, setGroup] = useState<GroupId | 'all'>('all');
  const [impact, setImpact] = useState<AiImpactLevel | 'all'>('all');
  const [easy, setEasy] = useState(false);

  const myMatch = useMemo(() => {
    const last = loadLastResult();
    const a = decodeAnswers(last?.encoded ?? null);
    if (!a) return null;
    return Object.fromEntries(score(a).ranking.map((m) => [m.role.id, m.percent]));
  }, []);

  const roles = ROLES.filter(
    (r) => (group === 'all' || r.group === group) && (impact === 'all' || r.aiImpact.level === impact) && (!easy || r.entryDifficulty <= 2),
  ).sort((a, b) => (myMatch ? myMatch[b.id] - myMatch[a.id] : 0));

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{ROLES.length} vai trò trong ngành IT thời AI</h1>
      <p className="muted mt-2 max-w-2xl">
        Mỗi vai trò có mô tả một ngày làm việc, mức độ AI tác động, độ khó bắt đầu và lộ trình học.
        {myMatch && ' Đang sắp xếp theo mức phù hợp với kết quả gần nhất của bạn.'}
      </p>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo nhóm">
          <button type="button" className="chip" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>
            Tất cả
          </button>
          {GROUPS.map((g) => (
            <button key={g.id} type="button" className="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.emoji} {g.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo tác động AI">
          {(Object.keys(AI_IMPACT) as AiImpactLevel[]).map((l) => (
            <button key={l} type="button" className="chip" aria-pressed={impact === l} onClick={() => setImpact(impact === l ? 'all' : l)}>
              {AI_IMPACT[l].emoji} {AI_IMPACT[l].short}
            </button>
          ))}
          <button type="button" className="chip" aria-pressed={easy} onClick={() => setEasy(!easy)}>
            🌱 Dễ bắt đầu
          </button>
        </div>
      </div>

      {roles.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <RoleCard key={r.id} role={r} percent={myMatch?.[r.id]} />
          ))}
        </div>
      ) : (
        <p className="muted mt-10 text-center">Không có vai trò nào khớp bộ lọc.</p>
      )}
    </div>
  );
}
