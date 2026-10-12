import type { DimKey, Weights } from './dimensions';

export const QUIZ_VERSION = 'v1';

export type ChapterId = 0 | 1 | 2 | 3 | 4;

export interface Chapter {
  id: ChapterId;
  title: string;
  intro: string;
  optional: boolean;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    title: 'Bạn là ai',
    intro: 'Vài thông tin nhanh để gợi ý lộ trình hợp với bạn.',
    optional: false,
  },
  {
    id: 1,
    title: 'Một tuần ở công ty công nghệ',
    intro:
      'Hãy tưởng tượng bạn vừa vào làm ở một công ty công nghệ. Mỗi ngày một tình huống — chọn việc bạn MUỐN làm nhất, không phải việc bạn đang giỏi nhất.',
    optional: false,
  },
  {
    id: 2,
    title: 'Chọn nhanh',
    intro: 'Hai lựa chọn, chọn theo cảm giác đầu tiên. Không cần nghĩ lâu!',
    optional: true,
  },
  {
    id: 3,
    title: 'Thử tay 30 giây',
    intro:
      '3 thử thách nhỏ để xem năng khiếu tự nhiên của bạn. Sai không bị trừ điểm, và bạn có thể bỏ qua bất kỳ câu nào.',
    optional: true,
  },
  {
    id: 4,
    title: 'Điều bạn ưu tiên',
    intro: 'Câu cuối cùng!',
    optional: true,
  },
];

export interface Option {
  id: string;
  emoji?: string;
  label: string;
  weights?: Weights;
}

interface BaseQuestion {
  id: string;
  chapter: ChapterId;
  /** Ước lượng số giây để trả lời, dùng cho "Còn khoảng X phút". */
  seconds: number;
}

export interface ContextQuestion extends BaseQuestion {
  kind: 'context';
  prompt: string;
  hint?: string;
  multi?: boolean;
  options: Option[];
  /** Chỉ hiện khi điều kiện đúng. */
  showIf?: (answers: Answers) => boolean;
}

export interface ScenarioQuestion extends BaseQuestion {
  kind: 'scenario';
  day: string;
  emoji: string;
  prompt: string;
  options: Option[];
}

export interface PairQuestion extends BaseQuestion {
  kind: 'pair';
  left: Option;
  right: Option;
}

export interface ChallengeQuestion extends BaseQuestion {
  kind: 'challenge';
  dim: DimKey;
  title: string;
  prompt: string;
  visual: 'form' | 'chart' | 'code';
  options: Option[];
  correct: string;
  explain: string;
}

export interface PriorityQuestion extends BaseQuestion {
  kind: 'priority';
  prompt: string;
  options: Option[];
}

export type Question =
  | ContextQuestion
  | ScenarioQuestion
  | PairQuestion
  | ChallengeQuestion
  | PriorityQuestion;

/** Câu trả lời: id đáp án, 'none' (không cái nào), 'skip' (bỏ qua), hoặc mảng (chọn nhiều). */
export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export const NONE = 'none';
export const SKIP = 'skip';
export const BOTH = 'both';

export const OTHER_FIELD_STATUSES = ['other_student', 'other_worker'];

export const QUESTIONS: Question[] = [
  // ───────────── Chương 0: Bạn là ai ─────────────
  {
    id: 'status',
    chapter: 0,
    kind: 'context',
    seconds: 6,
    prompt: 'Hiện tại bạn là?',
    options: [
      { id: 'it_junior', emoji: '🎒', label: 'Sinh viên IT năm 1–2' },
      { id: 'it_senior', emoji: '🎓', label: 'Sinh viên IT năm 3–4' },
      { id: 'intern', emoji: '🧑‍💻', label: 'Intern / Fresher IT' },
      { id: 'other_student', emoji: '📚', label: 'Sinh viên ngành khác' },
      { id: 'other_worker', emoji: '💼', label: 'Đang đi làm ngành khác' },
      { id: 'it_switch', emoji: '🔄', label: 'Đã làm IT, muốn đổi hướng' },
    ],
  },
  {
    id: 'field',
    chapter: 0,
    kind: 'context',
    seconds: 6,
    prompt: 'Ngành của bạn là?',
    hint: 'Kinh nghiệm cũ thường là lợi thế khi vào IT — mình sẽ chỉ ra cụ thể.',
    showIf: (a) => OTHER_FIELD_STATUSES.includes(a.status as string),
    options: [
      { id: 'finance', emoji: '💰', label: 'Tài chính – kế toán' },
      { id: 'sales', emoji: '🤝', label: 'Kinh doanh – sales' },
      { id: 'marketing', emoji: '📣', label: 'Marketing – truyền thông' },
      { id: 'design', emoji: '🎨', label: 'Thiết kế – nghệ thuật' },
      { id: 'education', emoji: '🧑‍🏫', label: 'Giáo dục – đào tạo' },
      { id: 'engineering', emoji: '🔧', label: 'Kỹ thuật (cơ khí, điện…)' },
      { id: 'science', emoji: '🧪', label: 'Y – dược – khoa học' },
      { id: 'writing', emoji: '✍️', label: 'Ngôn ngữ – viết lách' },
      { id: 'operations', emoji: '📦', label: 'Vận hành – logistics' },
      { id: 'other', emoji: '✨', label: 'Khác' },
    ],
  },
  {
    id: 'experience',
    chapter: 0,
    kind: 'context',
    multi: true,
    seconds: 10,
    prompt: 'Bạn đã từng…',
    hint: 'Chọn tất cả những gì đúng với bạn.',
    options: [
      { id: 'code', emoji: '⌨️', label: 'Viết code (kể cả làm theo tutorial)' },
      { id: 'excel', emoji: '📈', label: 'Dùng Excel / Google Sheets thành thạo' },
      { id: 'figma', emoji: '🖌️', label: 'Dùng Figma / Canva' },
      { id: 'ai', emoji: '🤖', label: 'Dùng ChatGPT / Claude hằng ngày' },
      { id: 'website', emoji: '🌐', label: 'Tự làm website / blog' },
      { id: 'manage', emoji: '📋', label: 'Quản lý dự án / nhóm' },
      { id: 'sales', emoji: '💬', label: 'Bán hàng / chăm sóc khách hàng' },
      { id: 'none', emoji: '🌱', label: 'Chưa từng cái nào' },
    ],
  },
  {
    id: 'time',
    chapter: 0,
    kind: 'context',
    seconds: 5,
    prompt: 'Mỗi tuần bạn dành được bao nhiêu thời gian để học?',
    options: [
      { id: 'lt5', emoji: '🐢', label: 'Dưới 5 giờ' },
      { id: '5to10', emoji: '🚶', label: '5–10 giờ' },
      { id: '10to20', emoji: '🏃', label: '10–20 giờ' },
      { id: 'fulltime', emoji: '🚀', label: 'Toàn thời gian' },
    ],
  },

  // ───────────── Chương 1: Một tuần ở công ty công nghệ ─────────────
  {
    id: 's1',
    chapter: 1,
    kind: 'scenario',
    seconds: 18,
    day: 'Thứ Hai',
    emoji: '🍜',
    prompt: 'Công ty bắt đầu làm một app đặt đồ ăn. Bạn muốn nhận phần nào?',
    options: [
      { id: 'a', emoji: '📱', label: 'Vẽ màn hình đặt món sao cho người dùng bấm ít nhất', weights: { design: 2 } },
      { id: 'b', emoji: '⚙️', label: 'Viết phần xử lý đơn hàng và thanh toán', weights: { code: 2, systems: 1 } },
      { id: 'c', emoji: '📊', label: 'Phân tích dữ liệu xem món nào bán chạy vào giờ nào', weights: { data: 2 } },
      { id: 'd', emoji: '☕', label: 'Gặp nhà hàng và khách để hiểu họ thật sự cần gì', weights: { business: 2, people: 1 } },
    ],
  },
  {
    id: 's2',
    chapter: 1,
    kind: 'scenario',
    seconds: 18,
    day: 'Thứ Ba, 2 giờ sáng',
    emoji: '🚨',
    prompt: 'App bị sập, khách không đặt được món. Phản ứng tự nhiên của bạn là?',
    options: [
      { id: 'a', emoji: '🔍', label: 'Lao vào đọc nhật ký hệ thống tìm nguyên nhân — thấy hồi hộp, thú vị', weights: { systems: 2 } },
      { id: 'b', emoji: '🕳️', label: 'Tìm xem lỗ hổng nằm ở đâu để lần sau chặn trước', weights: { quality: 2, systems: 1 } },
      { id: 'c', emoji: '💌', label: 'Soạn thông báo trấn an khách hàng', weights: { people: 2 } },
      { id: 'd', emoji: '📝', label: 'Ghi lại sự cố, đề xuất quy trình để không lặp lại', weights: { quality: 2, business: 1 } },
    ],
  },
  {
    id: 's3',
    chapter: 1,
    kind: 'scenario',
    seconds: 18,
    day: 'Thứ Tư',
    emoji: '🤖',
    prompt: 'Sếp nói: "Đưa AI vào sản phẩm". Bạn muốn làm phần nào?',
    options: [
      { id: 'a', emoji: '⚡', label: 'Ghép AI vào app, làm chatbot chạy được trong 1 tuần', weights: { build: 2, code: 1 } },
      { id: 'b', emoji: '🔬', label: 'Thử nghiệm, đo xem mô hình AI nào trả lời đúng hơn', weights: { research: 2, data: 1 } },
      { id: 'c', emoji: '💰', label: 'Tìm xem tính năng AI nào khách sẵn sàng trả tiền', weights: { business: 2 } },
      { id: 'd', emoji: '🧭', label: 'Thiết kế cách app xử lý khi AI trả lời sai để người dùng vẫn tin', weights: { design: 2, quality: 1 } },
    ],
  },
  {
    id: 's4',
    chapter: 1,
    kind: 'scenario',
    seconds: 15,
    day: 'Thứ Năm',
    emoji: '🏆',
    prompt: 'Cuối buổi họp, bạn muốn được khen câu nào nhất?',
    options: [
      { id: 'a', emoji: '✨', label: '"Cái này đẹp và dễ dùng quá!"', weights: { design: 2 } },
      { id: 'b', emoji: '🚀', label: '"Phần bạn làm gọn gàng, chạy nhanh ghê!"', weights: { code: 2 } },
      { id: 'c', emoji: '💡', label: '"Nhờ phân tích của bạn mà công ty tiết kiệm được 1 tỷ"', weights: { data: 2, business: 1 } },
      { id: 'd', emoji: '🗣️', label: '"Bạn giải thích dễ hiểu, cả team đều nắm được"', weights: { people: 2 } },
    ],
  },
  {
    id: 's5',
    chapter: 1,
    kind: 'scenario',
    seconds: 18,
    day: 'Thứ Sáu',
    emoji: '🧠',
    prompt: 'Gặp một bài toán khó mà chưa ai trong team giải được. Bạn sẽ…',
    options: [
      { id: 'a', emoji: '📚', label: 'Đọc tài liệu, thử nhiều giả thuyết, chấp nhận mất vài tuần', weights: { research: 2, data: 1 } },
      { id: 'b', emoji: '🔨', label: 'Làm bản nháp chạy được ngay rồi sửa dần', weights: { build: 2 } },
      { id: 'c', emoji: '🗂️', label: 'Chia nhỏ, lên kế hoạch, kiểm tra kỹ từng phần', weights: { quality: 2, systems: 1 } },
      { id: 'd', emoji: '👥', label: 'Hỏi người đã làm, kéo mọi người cùng giải', weights: { people: 2 } },
    ],
  },
  {
    id: 's6',
    chapter: 1,
    kind: 'scenario',
    seconds: 15,
    day: 'Thứ Bảy',
    emoji: '🌤️',
    prompt: 'Cuối tuần rảnh rỗi, bạn hay…',
    options: [
      { id: 'a', emoji: '🖥️', label: 'Mày mò máy tính, cài phần mềm, tự dựng máy chủ ở nhà', weights: { systems: 2 } },
      { id: 'b', emoji: '🧩', label: 'Chơi giải đố, tìm mẹo "lách luật" trong game', weights: { quality: 2, code: 1 } },
      { id: 'c', emoji: '📸', label: 'Chỉnh ảnh, làm video, để ý font chữ và bố cục', weights: { design: 2 } },
      { id: 'd', emoji: '📰', label: 'Đọc tin kinh doanh, startup, chứng khoán', weights: { business: 2, data: 1 } },
    ],
  },
  {
    id: 's7',
    chapter: 1,
    kind: 'scenario',
    seconds: 18,
    day: 'Chủ nhật',
    emoji: '🧪',
    prompt: 'Bạn được nhờ kiểm tra một tính năng mới trước khi ra mắt. Bạn…',
    options: [
      { id: 'a', emoji: '💥', label: 'Nghĩ ra 50 cách người dùng có thể làm hỏng nó', weights: { quality: 2 } },
      { id: 'b', emoji: '🤖', label: 'Viết công cụ tự động kiểm tra thay vì bấm tay', weights: { code: 2, quality: 1 } },
      { id: 'c', emoji: '🎯', label: 'Xem nó có thật sự giải quyết đúng vấn đề của khách không', weights: { business: 2 } },
      { id: 'd', emoji: '📖', label: 'Viết hướng dẫn để người dùng không bị lạc', weights: { people: 2 } },
    ],
  },
  {
    id: 's8',
    chapter: 1,
    kind: 'scenario',
    seconds: 15,
    day: 'Tổng kết tuần',
    emoji: '🏡',
    prompt: 'Nơi làm việc lý tưởng của bạn là?',
    options: [
      { id: 'a', emoji: '🎧', label: 'Đeo tai nghe tập trung, ít họp', weights: { code: 1, research: 1 } },
      { id: 'b', emoji: '🎤', label: 'Gặp gỡ, trao đổi, thuyết trình nhiều', weights: { people: 2, business: 1 } },
      { id: 'c', emoji: '🏎️', label: 'Nhịp nhanh, ra sản phẩm liên tục kiểu startup', weights: { build: 2 } },
      { id: 'd', emoji: '🏦', label: 'Ổn định, quy trình rõ, hệ thống lớn như ngân hàng', weights: { systems: 1, quality: 1 } },
    ],
  },

  // ───────────── Chương 2: Chọn nhanh ─────────────
  {
    id: 'p1',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '👀', label: 'Làm thứ người dùng nhìn thấy', weights: { design: 2, build: 1 } },
    right: { id: 'right', emoji: '🔧', label: 'Làm thứ chạy ngầm phía sau', weights: { systems: 2, code: 1 } },
  },
  {
    id: 'p2',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '🔢', label: 'Làm với con số, bảng biểu', weights: { data: 2 } },
    right: { id: 'right', emoji: '💬', label: 'Làm với con người, câu chuyện', weights: { people: 2 } },
  },
  {
    id: 'p3',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '🌱', label: 'Xây cái mới từ đầu', weights: { build: 2 } },
    right: { id: 'right', emoji: '🏗️', label: 'Làm cái đang có chạy ổn định hơn', weights: { quality: 2, systems: 1 } },
  },
  {
    id: 'p4',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '🕳️', label: 'Hiểu thật sâu một thứ', weights: { research: 2 } },
    right: { id: 'right', emoji: '🌐', label: 'Biết rộng nhiều thứ', weights: { business: 1, build: 1 } },
  },
  {
    id: 'p5',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '🛠️', label: 'Tự tay làm', weights: { code: 2 } },
    right: { id: 'right', emoji: '🎼', label: 'Điều phối người khác làm', weights: { business: 2, people: 1 } },
  },
  {
    id: 'p6',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '🗡️', label: 'Tìm cách phá', weights: { quality: 2 } },
    right: { id: 'right', emoji: '🧱', label: 'Xây để bảo vệ', weights: { build: 2, code: 1 } },
  },
  {
    id: 'p7',
    chapter: 2,
    kind: 'pair',
    seconds: 6,
    left: { id: 'left', emoji: '⚡', label: 'Thấy kết quả ngay trong ngày', weights: { build: 2 } },
    right: { id: 'right', emoji: '🌳', label: 'Kết quả lớn sau vài tháng', weights: { research: 2, data: 1 } },
  },

  // ───────────── Chương 3: Thử tay ─────────────
  {
    id: 'c1',
    chapter: 3,
    kind: 'challenge',
    seconds: 25,
    dim: 'design',
    title: 'Mắt thẩm mỹ',
    visual: 'form',
    prompt: 'Hai mẫu form đăng ký. Mẫu nào dễ dùng hơn?',
    options: [
      { id: 'a', label: 'Mẫu A' },
      { id: 'b', label: 'Mẫu B' },
    ],
    correct: 'b',
    explain:
      'Mẫu B chỉ hỏi thứ thật sự cần, nhãn nằm trên ô nhập và nút bấm nổi bật. Mỗi ô thừa có thể làm mất 5–10% người đăng ký.',
  },
  {
    id: 'c2',
    chapter: 3,
    kind: 'challenge',
    seconds: 25,
    dim: 'data',
    title: 'Mắt dữ liệu',
    visual: 'chart',
    prompt: 'Biểu đồ trong báo cáo ghi "Doanh thu tăng gấp 3!". Điều gì không ổn?',
    options: [
      { id: 'a', label: 'Màu cột chưa đẹp' },
      { id: 'b', label: 'Trục tung bắt đầu từ 900, nên mức tăng trông lớn hơn thực tế' },
      { id: 'c', label: 'Thiếu tên công ty' },
      { id: 'd', label: 'Không có gì sai' },
    ],
    correct: 'b',
    explain:
      'Doanh thu từ 950 lên 1.050 chỉ tăng khoảng 10%. Trục tung bị cắt ở 900 khiến cột sau trông cao gấp 3 lần.',
  },
  {
    id: 'c3',
    chapter: 3,
    kind: 'challenge',
    seconds: 25,
    dim: 'code',
    title: 'Mắt logic',
    visual: 'code',
    prompt: 'Sau khi chạy đoạn hướng dẫn trên, x bằng mấy?',
    options: [
      { id: 'a', label: '2' },
      { id: 'b', label: '6' },
      { id: 'c', label: '8' },
      { id: 'd', label: '9' },
    ],
    correct: 'c',
    explain: 'x đi từ 1 → 2 → 4 → 8. Lặp 3 lần, mỗi lần nhân đôi. Đây chính là cách máy tính "nghĩ".',
  },

  // ───────────── Chương 4: Ưu tiên ─────────────
  {
    id: 'priority',
    chapter: 4,
    kind: 'priority',
    seconds: 8,
    prompt: 'Khi chọn nghề, điều bạn ưu tiên nhất là?',
    options: [
      { id: 'salary', emoji: '💸', label: 'Thu nhập cao' },
      { id: 'fast', emoji: '⏱️', label: 'Vào nghề nhanh' },
      { id: 'aiSafe', emoji: '🛡️', label: 'Ít bị AI thay thế' },
      { id: 'creative', emoji: '🎨', label: 'Được sáng tạo' },
      { id: 'stable', emoji: '🏔️', label: 'Ổn định lâu dài' },
    ],
  },
];

export const questionById = Object.fromEntries(QUESTIONS.map((q) => [q.id, q])) as Record<
  string,
  Question
>;

/** Thứ tự cố định của câu hỏi — dùng để đo phễu rời bỏ. */
export const QUESTION_ORDER = QUESTIONS.map((q) => q.id);

/** Chương kết thúc phần bắt buộc; sau chương này hiện kết quả sơ bộ. */
export const QUICK_LAST_CHAPTER: ChapterId = 1;

export function isVisible(q: Question, answers: Answers): boolean {
  return q.kind !== 'context' || !q.showIf || q.showIf(answers);
}

export function visibleQuestions(answers: Answers): Question[] {
  return QUESTIONS.filter((q) => isVisible(q, answers));
}
