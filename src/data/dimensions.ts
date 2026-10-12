/** 8 chiều hiển thị trên radar + 1 tín hiệu phụ "build" (thích xây nhanh, thấy kết quả ngay). */
export type DimKey =
  | 'code'
  | 'data'
  | 'design'
  | 'people'
  | 'business'
  | 'systems'
  | 'research'
  | 'quality';

export type SignalKey = DimKey | 'build';

export type Weights = Partial<Record<SignalKey, number>>;

export interface Dimension {
  key: DimKey;
  label: string;
  short: string;
  emoji: string;
  description: string;
  /** Dùng để ghép câu tóm tắt: "Bạn là <noun> <modifier>". */
  noun: string;
  modifier: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    key: 'code',
    label: 'Code & logic',
    short: 'Logic',
    emoji: '🧩',
    description: 'Thích giải quyết vấn đề bằng các bước rõ ràng, tự tay làm cho máy chạy.',
    noun: 'người giải quyết vấn đề bằng logic',
    modifier: 'có tư duy logic chặt chẽ',
  },
  {
    key: 'data',
    label: 'Toán & dữ liệu',
    short: 'Dữ liệu',
    emoji: '📊',
    description: 'Nhạy với con số, thích tìm quy luật và ra quyết định dựa trên dữ liệu.',
    noun: 'người kể chuyện bằng số liệu',
    modifier: 'nhạy bén với con số',
  },
  {
    key: 'design',
    label: 'Thiết kế & trải nghiệm',
    short: 'Thiết kế',
    emoji: '🎨',
    description: 'Để ý cái đẹp, sự tiện dụng và cảm giác của người dùng.',
    noun: 'người tạo ra trải nghiệm',
    modifier: 'có óc thẩm mỹ',
  },
  {
    key: 'people',
    label: 'Con người & giao tiếp',
    short: 'Giao tiếp',
    emoji: '🤝',
    description: 'Giỏi lắng nghe, giải thích và kết nối mọi người.',
    noun: 'người kết nối',
    modifier: 'giỏi giao tiếp',
  },
  {
    key: 'business',
    label: 'Kinh doanh & sản phẩm',
    short: 'Kinh doanh',
    emoji: '💼',
    description: 'Quan tâm sản phẩm tạo ra giá trị gì, ai trả tiền và vì sao.',
    noun: 'người nhìn ra giá trị',
    modifier: 'có đầu óc kinh doanh',
  },
  {
    key: 'systems',
    label: 'Hệ thống & hạ tầng',
    short: 'Hệ thống',
    emoji: '⚙️',
    description: 'Tò mò mọi thứ vận hành phía sau thế nào, thích làm cho chúng ổn định.',
    noun: 'người giữ cho hệ thống vận hành',
    modifier: 'hiểu cách mọi thứ vận hành',
  },
  {
    key: 'research',
    label: 'Nghiên cứu & đào sâu',
    short: 'Nghiên cứu',
    emoji: '🔬',
    description: 'Kiên nhẫn đào sâu một vấn đề, thử nghiệm nhiều giả thuyết.',
    noun: 'người thích đào sâu',
    modifier: 'ham tìm tòi',
  },
  {
    key: 'quality',
    label: 'Chất lượng & bảo mật',
    short: 'Chất lượng',
    emoji: '🛡️',
    description: 'Tỉ mỉ, hay nghĩ đến chỗ có thể hỏng và cách phòng ngừa.',
    noun: 'người gác cổng chất lượng',
    modifier: 'cẩn thận, tỉ mỉ',
  },
];

export const DIM_KEYS: DimKey[] = DIMENSIONS.map((d) => d.key);
export const SIGNAL_KEYS: SignalKey[] = [...DIM_KEYS, 'build'];

/** Tín hiệu phụ "build" được tính nhẹ hơn trong so khớp. */
export const SIGNAL_MATCH_WEIGHT: Record<SignalKey, number> = {
  code: 1,
  data: 1,
  design: 1,
  people: 1,
  business: 1,
  systems: 1,
  research: 1,
  quality: 1,
  build: 0.6,
};

export const dimByKey = Object.fromEntries(DIMENSIONS.map((d) => [d.key, d])) as Record<
  DimKey,
  Dimension
>;
