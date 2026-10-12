import { describe, expect, it } from 'vitest';
import { score } from './scoring';
import { createTracker, furthestIndex } from './tracking';

const setup = (opts: { endpoint?: string; optedOut?: boolean } = {}) => {
  const posts: unknown[] = [];
  const beacons: unknown[] = [];
  const t = createTracker({
    endpoint: 'endpoint' in opts ? opts.endpoint : 'https://example.test/exec',
    post: (_u, b) => posts.push(JSON.parse(b)),
    beacon: (_u, b) => (beacons.push(JSON.parse(b)), true),
    isOptedOut: () => opts.optedOut ?? false,
    now: () => 1000,
  });
  t.setAttempt('abc');
  return { t, posts, beacons };
};

describe('tracker', () => {
  it('gom sự kiện và chỉ gửi một request khi flush', () => {
    const { t, posts } = setup();
    t.event('quiz_start', {});
    t.event('chapter_done', { status: 'intern', s1: 'a' }, { chapter: 1 });
    expect(posts).toHaveLength(0);
    t.flush();
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      type: 'events',
      aid: 'abc',
      v: 'v1',
      events: [
        { name: 'quiz_start', idx: -1 },
        { name: 'chapter_done', qid: 's1', data: { chapter: 1 } },
      ],
    });
    t.flush();
    expect(posts).toHaveLength(1);
  });

  it('dùng sendBeacon khi rời trang', () => {
    const { t, posts, beacons } = setup();
    t.event('page_hidden', { s1: 'a' });
    t.flush(true);
    expect(beacons).toHaveLength(1);
    expect(posts).toHaveLength(0);
  });

  it('không tự gửi gì khi người dùng đã tắt, chỉ gửi khi họ tự bấm gửi góp ý', () => {
    const { t, posts } = setup({ optedOut: true });
    t.event('quiz_start', {});
    t.flush();
    t.result({ s1: 'a' }, score({ s1: 'a' }), 'quick', 1);
    expect(posts).toHaveLength(0);
    t.feedback(5, '', '', 'uiux');
    expect(posts).toHaveLength(1);
  });

  it('không gửi gì khi chưa cấu hình endpoint', () => {
    const { t, posts } = setup({ endpoint: undefined });
    t.event('quiz_start', {});
    t.flush();
    t.email('a@b.com', true, '');
    expect(posts).toHaveLength(0);
  });

  it('payload kết quả có top 3 và hồ sơ', () => {
    const { t, posts } = setup();
    const answers = { status: 'intern', experience: ['code', 'ai'], s1: 'a', s2: 'b', s3: 'c', s4: 'd' };
    t.result(answers, score(answers), 'quick', 123.4);
    const p = posts[0] as Record<string, unknown>;
    expect(p).toMatchObject({ type: 'result', mode: 'quick', status: 'intern', experience: 'code,ai', duration: 123 });
    expect(p.top).toHaveLength(3);
    expect(Object.keys(p.profile as object)).toHaveLength(8);
  });

  it('furthestIndex theo thứ tự cố định', () => {
    expect(furthestIndex({ status: 'x', s3: 'a', s1: 'b' }).qid).toBe('s3');
  });
});
