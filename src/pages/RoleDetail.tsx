import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AiImpactBadge from '../components/AiImpactBadge';
import RadarChart from '../components/RadarChart';
import RoleCard from '../components/RoleCard';
import {
  AiImpactBlock,
  DifficultyDots,
  FirstWeek,
  Resources,
  Roadmap,
  Salary,
  Section,
  SkillList,
} from '../components/RoleSections';
import { DIM_KEYS, type DimKey } from '../data/dimensions';
import { groupById, roleById } from '../data/roles';
import { loadLastResult } from '../lib/quizState';
import { DIFFICULTY_LABEL, score } from '../lib/scoring';
import { decodeAnswers } from '../lib/share';

export default function RoleDetail() {
  const { id = '' } = useParams();
  const role = roleById[id];

  const match = useMemo(() => {
    const a = decodeAnswers(loadLastResult()?.encoded ?? null);
    return a ? score(a).ranking.find((m) => m.role.id === id) : undefined;
  }, [id]);

  if (!role) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy vai trò</h1>
        <Link to="/vai-tro" className="btn-primary mt-6">
          Xem tất cả vai trò
        </Link>
      </div>
    );
  }

  const roleProfile = Object.fromEntries(DIM_KEYS.map((k) => [k, role.vector[k] * 20])) as Record<DimKey, number>;

  return (
    <div className="container-page py-8 sm:py-12">
      <Link to="/vai-tro" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
        ← Tất cả vai trò
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {groupById[role.group].emoji} {groupById[role.group].name}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {role.emoji} {role.name}
          </h1>
          <p className="muted mt-1 text-lg">{role.plain}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <AiImpactBadge level={role.aiImpact.level} long />
            <DifficultyDots value={role.entryDifficulty} label={DIFFICULTY_LABEL[role.entryDifficulty]} />
            {match && (
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {match.percent}% phù hợp với bạn
              </span>
            )}
          </div>
          <p className="mt-6 text-lg font-medium">{role.tagline}</p>

          <Section title="Một ngày làm việc">
            <p className="text-[15px] leading-relaxed">{role.dayInLife}</p>
          </Section>
          <Section title="Tác động của AI">
            <AiImpactBlock role={role} />
          </Section>
          <Section title="Kỹ năng">
            <SkillList role={role} />
          </Section>
          <Section title="Lộ trình gợi ý (~1 tháng/chặng với 10–20 giờ/tuần)">
            <Roadmap role={role} />
          </Section>
          <Section title="Việc làm ngay tuần này">
            <FirstWeek role={role} />
          </Section>
          <Section title="Tài nguyên học miễn phí">
            <Resources role={role} />
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-4">
            <p className="text-center text-sm font-bold">Hồ sơ phù hợp với vai trò này</p>
            <RadarChart profile={roleProfile} />
          </div>
          <div className="card p-4">
            <p className="mb-2 text-sm font-bold">Lương tham khảo</p>
            <Salary role={role} />
          </div>
          {!match && (
            <Link to="/trac-nghiem" className="btn-primary w-full">
              Xem bạn hợp bao nhiêu % →
            </Link>
          )}
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Vai trò liên quan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {role.related.map((rid) => roleById[rid]).filter(Boolean).map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
