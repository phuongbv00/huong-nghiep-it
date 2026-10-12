import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DIM_KEYS } from '../data/dimensions';
import { QUESTION_ORDER, QUIZ_VERSION } from '../data/questions';
import { ROLES } from '../data/roles';

/** apps-script/Code.gs chạy riêng trên Google nên giữ bản sao danh sách — test này bắt lệch. */
const gs = readFileSync(new URL('../../apps-script/Code.gs', import.meta.url), 'utf8');
const arrayIn = (name: string) => {
  const m = gs.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  if (!m) throw new Error(`Không tìm thấy ${name}`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
};

describe('apps-script/Code.gs đồng bộ với web', () => {
  it('QUESTION_ORDER', () => expect(arrayIn('QUESTION_ORDER')).toEqual(QUESTION_ORDER));
  it('ROLE_IDS', () => expect(arrayIn('ROLE_IDS')).toEqual(ROLES.map((r) => r.id)));
  it('DIMS', () => expect(arrayIn('DIMS')).toEqual(DIM_KEYS));
  it('VERSIONS chứa phiên bản hiện tại', () => expect(arrayIn('VERSIONS')).toContain(QUIZ_VERSION));
});
