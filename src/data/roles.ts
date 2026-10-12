import type { SignalKey } from './dimensions';

export type GroupId = 'build' | 'ai' | 'data' | 'infra' | 'product' | 'design';

export interface Group {
  id: GroupId;
  name: string;
  emoji: string;
}

export const GROUPS: Group[] = [
  { id: 'build', name: 'Xây sản phẩm', emoji: '🛠️' },
  { id: 'ai', name: 'AI', emoji: '🤖' },
  { id: 'data', name: 'Dữ liệu', emoji: '📊' },
  { id: 'infra', name: 'Hạ tầng & Bảo mật', emoji: '🛡️' },
  { id: 'product', name: 'Sản phẩm & Kinh doanh', emoji: '💼' },
  { id: 'design', name: 'Thiết kế & Nội dung', emoji: '🎨' },
];

export const groupById = Object.fromEntries(GROUPS.map((g) => [g.id, g])) as Record<GroupId, Group>;

export type AiImpactLevel = 'ai-native' | 'boosted' | 'shifting';

export const AI_IMPACT: Record<AiImpactLevel, { label: string; emoji: string; short: string }> = {
  'ai-native': { label: 'Vai trò mới nhờ AI', emoji: '🔵', short: 'Sinh ra nhờ AI' },
  boosted: { label: 'AI giúp làm nhanh hơn, nhu cầu tăng', emoji: '🟢', short: 'Được AI tăng sức' },
  shifting: { label: 'Đang thay đổi mạnh vì AI', emoji: '🟡', short: 'Đang thay đổi' },
};

export type PriorityKey = 'salary' | 'fast' | 'aiSafe' | 'creative' | 'stable';

export interface Role {
  id: string;
  name: string;
  /** Tên dễ hiểu cho người ngoài ngành. */
  plain: string;
  group: GroupId;
  emoji: string;
  tagline: string;
  dayInLife: string;
  /** Mức độ phù hợp với từng chiều, 0–5. */
  vector: Record<SignalKey, number>;
  coreSkills: string[];
  aiSkills: string[];
  aiImpact: { level: AiImpactLevel; text: string };
  /** Độ khó vào nghề cho người mới bắt đầu từ con số 0, 1 (dễ) – 5 (khó). */
  entryDifficulty: 1 | 2 | 3 | 4 | 5;
  /** Lương tham khảo, triệu VND/tháng (gross). */
  salary: { junior: string; middle: string; senior: string };
  /** Điểm 1–3 theo từng tiêu chí ưu tiên, dùng để phân định khi sát điểm. */
  attrs: Record<PriorityKey, 1 | 2 | 3>;
  /** Lộ trình 3 chặng (mặc định ~1 tháng/chặng với 10–20 giờ/tuần). */
  roadmap: { title: string; items: string[] }[];
  firstWeek: string[];
  resources: { label: string; url: string }[];
  related: string[];
}

const v = (
  code: number,
  data: number,
  design: number,
  people: number,
  business: number,
  systems: number,
  research: number,
  quality: number,
  build: number,
): Record<SignalKey, number> => ({ code, data, design, people, business, systems, research, quality, build });

export const ROLES: Role[] = [
  // ───────────── Xây sản phẩm ─────────────
  {
    id: 'frontend',
    name: 'Frontend Developer',
    plain: 'Lập trình viên giao diện web',
    group: 'build',
    emoji: '🖥️',
    tagline: 'Biến bản thiết kế thành trang web người dùng chạm vào được.',
    dayInLife:
      'Nhận thiết kế từ designer, dựng thành giao diện bằng React/Vue, nối với dữ liệu từ backend, chỉnh cho mượt trên cả điện thoại lẫn máy tính, và sửa lỗi "nút này bấm không ăn".',
    vector: v(4, 1, 4, 2, 1, 1, 1, 2, 4),
    coreSkills: ['HTML, CSS, JavaScript/TypeScript', 'React hoặc Vue', 'Responsive & accessibility', 'Gọi API, quản lý state', 'Git'],
    aiSkills: ['Dùng AI coding assistant để dựng UI nhanh', 'Đánh giá & sửa code AI sinh ra', 'Làm giao diện chat/streaming cho tính năng AI'],
    aiImpact: {
      level: 'shifting',
      text: 'AI đã dựng được giao diện cơ bản trong vài phút, nên việc "cắt HTML" thuần đang giảm. Người thắng là người hiểu sâu trải nghiệm, hiệu năng và biết làm giao diện cho sản phẩm AI.',
    },
    entryDifficulty: 2,
    salary: { junior: '12–20', middle: '25–40', senior: '45–70' },
    attrs: { salary: 2, fast: 3, aiSafe: 1, creative: 3, stable: 2 },
    roadmap: [
      { title: 'Nền tảng web', items: ['HTML & CSS: tự dựng lại 3 trang web bạn thích', 'JavaScript cơ bản: biến, hàm, mảng, DOM', 'Git & GitHub: đưa mọi bài tập lên GitHub'] },
      { title: 'Framework & dự án', items: ['React + TypeScript cơ bản', 'Gọi API thật (thời tiết, phim…) và hiển thị', 'Dự án 1: app quản lý chi tiêu cá nhân'] },
      { title: 'Sẵn sàng đi làm', items: ['Dự án 2: giao diện chat gọi API AI', 'Tối ưu tốc độ, responsive, accessibility', 'Portfolio + CV + luyện phỏng vấn'] },
    ],
    firstWeek: ['Học xong 5 bài đầu Responsive Web Design trên freeCodeCamp', 'Dựng lại trang chủ của một website bạn thích chỉ bằng HTML/CSS', 'Tạo tài khoản GitHub và đẩy trang đó lên GitHub Pages'],
    resources: [
      { label: 'roadmap.sh — Frontend', url: 'https://roadmap.sh/frontend' },
      { label: 'freeCodeCamp — Responsive Web Design', url: 'https://www.freecodecamp.org/learn' },
      { label: 'The Odin Project', url: 'https://www.theodinproject.com/' },
      { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/vi/' },
    ],
    related: ['fullstack', 'mobile', 'uiux'],
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    plain: 'Lập trình viên phía máy chủ',
    group: 'build',
    emoji: '🗄️',
    tagline: 'Xây phần "não" phía sau: dữ liệu, xử lý nghiệp vụ, thanh toán.',
    dayInLife:
      'Thiết kế API cho app gọi vào, viết logic xử lý đơn hàng, làm việc với cơ sở dữ liệu, tối ưu cho hệ thống chịu được hàng nghìn người dùng cùng lúc và đảm bảo dữ liệu không sai.',
    vector: v(5, 2, 0, 1, 1, 4, 1, 3, 3),
    coreSkills: ['Một ngôn ngữ: Java, Go, Python, Node.js hoặc C#', 'SQL & thiết kế cơ sở dữ liệu', 'REST/gRPC API', 'Cache, message queue', 'Docker cơ bản'],
    aiSkills: ['Tích hợp LLM API vào dịch vụ', 'Vector database & tìm kiếm ngữ nghĩa', 'Dùng AI để viết test, refactor'],
    aiImpact: {
      level: 'boosted',
      text: 'AI viết code nhanh hơn, nhưng thiết kế hệ thống, xử lý dữ liệu đúng và an toàn vẫn cần người. Hầu hết tính năng AI đều cần backend để chạy thật trong sản phẩm.',
    },
    entryDifficulty: 3,
    salary: { junior: '13–22', middle: '28–45', senior: '50–80' },
    attrs: { salary: 3, fast: 2, aiSafe: 2, creative: 2, stable: 3 },
    roadmap: [
      { title: 'Lập trình nền tảng', items: ['Chọn 1 ngôn ngữ (gợi ý: Python hoặc Java) và học chắc cú pháp', 'Cấu trúc dữ liệu cơ bản: mảng, map, hàng đợi', 'SQL: SELECT, JOIN, GROUP BY'] },
      { title: 'Xây API', items: ['Framework web (FastAPI / Spring Boot / Express)', 'Dự án 1: API quản lý thư viện có đăng nhập', 'Docker hoá dự án'] },
      { title: 'Sẵn sàng đi làm', items: ['Dự án 2: API có tích hợp LLM (tóm tắt, phân loại)', 'Cache, phân trang, xử lý lỗi, viết test', 'Deploy lên cloud miễn phí + viết README tốt'] },
    ],
    firstWeek: ['Làm 10 bài SQL đầu tiên trên SQLBolt', 'Cài Python và viết chương trình nhỏ đọc file CSV', 'Xem cách một API hoạt động: mở DevTools > Network trên một website bất kỳ'],
    resources: [
      { label: 'roadmap.sh — Backend', url: 'https://roadmap.sh/backend' },
      { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
      { label: 'CS50x (Harvard)', url: 'https://cs50.harvard.edu/x/' },
      { label: 'Full Stack Open', url: 'https://fullstackopen.com/en/' },
    ],
    related: ['fullstack', 'data-eng', 'devops'],
  },
  {
    id: 'fullstack',
    name: 'Fullstack Developer',
    plain: 'Lập trình viên làm cả giao diện lẫn máy chủ',
    group: 'build',
    emoji: '🧱',
    tagline: 'Một mình dựng được sản phẩm từ màn hình tới cơ sở dữ liệu.',
    dayInLife:
      'Sáng làm giao diện, chiều viết API, tối deploy. Thường ở startup hoặc team nhỏ, nơi cần người "cân" được nhiều việc và ra tính năng nhanh.',
    vector: v(5, 1, 3, 2, 2, 3, 1, 2, 5),
    coreSkills: ['JavaScript/TypeScript', 'React/Next.js', 'Node.js hoặc Python', 'SQL/NoSQL', 'Deploy (Vercel, Docker)'],
    aiSkills: ['Xây app AI end-to-end (giao diện + LLM + dữ liệu)', 'Dùng AI agent để tăng tốc phát triển', 'RAG cơ bản'],
    aiImpact: {
      level: 'boosted',
      text: 'Với AI, một fullstack dev có thể làm khối lượng việc của cả team nhỏ. Đây là kiểu người startup AI tuyển nhiều nhất.',
    },
    entryDifficulty: 3,
    salary: { junior: '13–22', middle: '28–45', senior: '50–80' },
    attrs: { salary: 3, fast: 2, aiSafe: 2, creative: 3, stable: 2 },
    roadmap: [
      { title: 'Web nền tảng', items: ['HTML, CSS, JavaScript', 'Git & GitHub', 'React cơ bản'] },
      { title: 'Ghép hai đầu', items: ['Node.js/Express hoặc Next.js API routes', 'Cơ sở dữ liệu PostgreSQL', 'Dự án 1: mạng xã hội mini có đăng nhập'] },
      { title: 'Sản phẩm thật', items: ['Dự án 2: app có tính năng AI (hỏi đáp tài liệu)', 'Deploy, domain, theo dõi lỗi', 'Portfolio + kể câu chuyện sản phẩm'] },
    ],
    firstWeek: ['Bắt đầu phần 0–1 của Full Stack Open', 'Dựng một trang web giới thiệu bản thân', 'Đẩy lên GitHub và deploy miễn phí'],
    resources: [
      { label: 'Full Stack Open', url: 'https://fullstackopen.com/en/' },
      { label: 'roadmap.sh — Full Stack', url: 'https://roadmap.sh/full-stack' },
      { label: 'The Odin Project', url: 'https://www.theodinproject.com/' },
    ],
    related: ['frontend', 'backend', 'ai-app'],
  },
  {
    id: 'mobile',
    name: 'Mobile Developer',
    plain: 'Lập trình viên ứng dụng điện thoại',
    group: 'build',
    emoji: '📱',
    tagline: 'Làm app trên iOS và Android mà mọi người dùng hằng ngày.',
    dayInLife:
      'Dựng màn hình app, xử lý cảm ứng, thông báo đẩy, chạy offline, tối ưu pin và tốc độ, rồi đưa app lên App Store / Google Play.',
    vector: v(4, 1, 4, 1, 1, 2, 1, 3, 4),
    coreSkills: ['Flutter hoặc React Native', 'Hoặc Swift (iOS) / Kotlin (Android)', 'Gọi API, lưu trữ cục bộ', 'Quy trình phát hành app'],
    aiSkills: ['Tích hợp AI trên thiết bị (on-device)', 'Tính năng camera/giọng nói dùng AI', 'Dùng AI để dựng UI nhanh'],
    aiImpact: {
      level: 'boosted',
      text: 'AI trên điện thoại (nhận diện ảnh, giọng nói, trợ lý) đang mở ra nhiều tính năng mới. Phần đặc thù thiết bị vẫn cần người hiểu sâu.',
    },
    entryDifficulty: 3,
    salary: { junior: '12–20', middle: '25–40', senior: '45–70' },
    attrs: { salary: 2, fast: 2, aiSafe: 2, creative: 3, stable: 2 },
    roadmap: [
      { title: 'Nền tảng', items: ['Dart + Flutter cơ bản (hoặc Kotlin)', 'Layout, điều hướng giữa màn hình', 'Git'] },
      { title: 'App thật', items: ['Gọi API, lưu dữ liệu offline', 'Dự án 1: app ghi chú có đồng bộ', 'Quản lý state'] },
      { title: 'Phát hành', items: ['Dự án 2: app có tính năng AI (chụp ảnh → mô tả)', 'Đưa app lên Google Play (bản thử nghiệm)', 'Portfolio + CV'] },
    ],
    firstWeek: ['Cài Flutter và chạy app mẫu trên điện thoại của bạn', 'Làm lại màn hình đăng nhập của một app bạn hay dùng', 'Xem 1 codelab trên trang Flutter'],
    resources: [
      { label: 'Flutter — Learn', url: 'https://docs.flutter.dev/get-started/learn-flutter' },
      { label: 'Android Developers — Courses', url: 'https://developer.android.com/courses' },
      { label: 'roadmap.sh — Android', url: 'https://roadmap.sh/android' },
    ],
    related: ['frontend', 'fullstack', 'uiux'],
  },

  // ───────────── AI ─────────────
  {
    id: 'ai-app',
    name: 'AI / LLM Application Engineer',
    plain: 'Kỹ sư xây ứng dụng AI',
    group: 'ai',
    emoji: '🤖',
    tagline: 'Ghép các mô hình AI như Claude, GPT vào sản phẩm thật.',
    dayInLife:
      'Thiết kế prompt, xây chatbot và AI agent, kết nối AI với dữ liệu công ty (RAG), đo xem AI trả lời đúng tới đâu và tối ưu chi phí gọi mô hình.',
    vector: v(4, 2, 1, 2, 2, 2, 2, 2, 5),
    coreSkills: ['Python hoặc TypeScript', 'LLM API (Claude, OpenAI…)', 'Prompt engineering', 'RAG & vector database', 'Đánh giá (eval) chất lượng AI'],
    aiSkills: ['AI agent & tool use', 'MCP, function calling', 'Kiểm soát chi phí, độ trễ, an toàn'],
    aiImpact: {
      level: 'ai-native',
      text: 'Vai trò gần như mới hoàn toàn từ 2023. Nhu cầu tăng rất nhanh vì công ty nào cũng muốn đưa AI vào sản phẩm, và chưa có nhiều người có kinh nghiệm thực tế.',
    },
    entryDifficulty: 3,
    salary: { junior: '18–28', middle: '35–60', senior: '60–100+' },
    attrs: { salary: 3, fast: 2, aiSafe: 3, creative: 3, stable: 1 },
    roadmap: [
      { title: 'Lập trình & API', items: ['Python cơ bản', 'Gọi LLM API đầu tiên, hiểu token, nhiệt độ', 'Prompt engineering có hệ thống'] },
      { title: 'Ứng dụng AI', items: ['RAG: hỏi đáp trên tài liệu PDF của bạn', 'Tool use / AI agent đơn giản', 'Dự án 1: trợ lý hỏi đáp quy định công ty'] },
      { title: 'Đưa vào sản phẩm', items: ['Viết bộ eval để đo chất lượng', 'Giao diện web cho app AI + deploy', 'Dự án 2: agent tự động hoá một việc thật'] },
    ],
    firstWeek: ['Làm bài đầu tiên trong khoá Prompt Engineering của Anthropic', 'Gọi thử một LLM API bằng Python (10 dòng code)', 'Liệt kê 3 việc lặp đi lặp lại trong đời sống có thể dùng AI tự động hoá'],
    resources: [
      { label: 'Anthropic Courses (GitHub)', url: 'https://github.com/anthropics/courses' },
      { label: 'roadmap.sh — AI Engineer', url: 'https://roadmap.sh/ai-engineer' },
      { label: 'DeepLearning.AI — Short courses', url: 'https://www.deeplearning.ai/short-courses/' },
      { label: 'Hugging Face Learn', url: 'https://huggingface.co/learn' },
    ],
    related: ['fullstack', 'ml-eng', 'backend'],
  },
  {
    id: 'ml-eng',
    name: 'Machine Learning Engineer',
    plain: 'Kỹ sư huấn luyện mô hình máy học',
    group: 'ai',
    emoji: '🧠',
    tagline: 'Huấn luyện và tinh chỉnh mô hình để máy "học" từ dữ liệu.',
    dayInLife:
      'Chuẩn bị dữ liệu, huấn luyện và tinh chỉnh mô hình (gợi ý sản phẩm, nhận diện ảnh, fine-tune LLM), đo độ chính xác và đưa mô hình vào chạy thật.',
    vector: v(4, 5, 0, 1, 1, 2, 4, 2, 2),
    coreSkills: ['Python, NumPy, Pandas', 'Toán: xác suất, đại số tuyến tính', 'PyTorch / scikit-learn', 'Huấn luyện & đánh giá mô hình', 'Fine-tuning'],
    aiSkills: ['Fine-tune LLM (LoRA)', 'Đánh giá mô hình ngôn ngữ', 'Tối ưu suy luận (inference)'],
    aiImpact: {
      level: 'boosted',
      text: 'Nhiều bài toán giờ dùng mô hình có sẵn thay vì tự huấn luyện, nên vai trò dịch chuyển sang tinh chỉnh và đánh giá. Yêu cầu toán và kinh nghiệm cao hơn mặt bằng chung.',
    },
    entryDifficulty: 5,
    salary: { junior: '18–30', middle: '35–60', senior: '60–110' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 2, stable: 2 },
    roadmap: [
      { title: 'Toán & Python', items: ['Python + NumPy + Pandas', 'Ôn xác suất thống kê, đại số tuyến tính', 'Machine learning cơ bản với scikit-learn'] },
      { title: 'Deep learning', items: ['PyTorch, mạng nơ-ron', 'Dự án 1: phân loại ảnh / văn bản tiếng Việt', 'Thi một cuộc thi Kaggle cho người mới'] },
      { title: 'Mô hình hiện đại', items: ['Transformer & fine-tune mô hình nhỏ', 'Đưa mô hình thành API', 'Dự án 2 + bài viết giải thích kết quả'] },
    ],
    firstWeek: ['Học bài 1 của Practical Deep Learning (fast.ai)', 'Làm khoá Intro to Machine Learning trên Kaggle Learn', 'Ôn lại khái niệm trung bình, phương sai, xác suất có điều kiện'],
    resources: [
      { label: 'fast.ai — Practical Deep Learning', url: 'https://course.fast.ai/' },
      { label: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
      { label: 'ML Zoomcamp', url: 'https://github.com/DataTalksClub/machine-learning-zoomcamp' },
      { label: 'roadmap.sh — Machine Learning', url: 'https://roadmap.sh/machine-learning' },
    ],
    related: ['data-scientist', 'ai-app', 'mlops'],
  },
  {
    id: 'mlops',
    name: 'MLOps / AI Platform Engineer',
    plain: 'Kỹ sư vận hành hệ thống AI',
    group: 'ai',
    emoji: '🏭',
    tagline: 'Làm cho mô hình AI chạy ổn định, nhanh và rẻ trên hạ tầng thật.',
    dayInLife:
      'Dựng pipeline huấn luyện tự động, triển khai mô hình lên GPU/cloud, theo dõi mô hình có "xuống phong độ" không, và tối ưu chi phí chạy AI.',
    vector: v(4, 2, 0, 1, 0, 5, 1, 3, 2),
    coreSkills: ['Python', 'Docker, Kubernetes', 'Cloud (AWS/GCP/Azure)', 'CI/CD', 'Giám sát hệ thống'],
    aiSkills: ['Phục vụ LLM (vLLM, model serving)', 'Quản lý GPU & chi phí', 'Theo dõi chất lượng mô hình'],
    aiImpact: {
      level: 'ai-native',
      text: 'Càng nhiều công ty chạy AI thật, càng cần người giữ cho hệ thống AI ổn định và không "đốt tiền". Nhu cầu đang tăng, ít người có kinh nghiệm.',
    },
    entryDifficulty: 4,
    salary: { junior: '18–28', middle: '35–55', senior: '60–100' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 1, stable: 3 },
    roadmap: [
      { title: 'Hạ tầng nền tảng', items: ['Linux & dòng lệnh', 'Python', 'Docker'] },
      { title: 'Cloud & tự động hoá', items: ['Một cloud (gợi ý AWS) ở mức cơ bản', 'CI/CD với GitHub Actions', 'Kubernetes cơ bản'] },
      { title: 'Hệ thống AI', items: ['Triển khai một mô hình thành API có giám sát', 'Theo dõi thí nghiệm (MLflow)', 'Dự án: pipeline huấn luyện → triển khai tự động'] },
    ],
    firstWeek: ['Học buổi 1 của The Missing Semester (dòng lệnh)', 'Cài Docker và chạy container đầu tiên', 'Đọc tuần 1 của MLOps Zoomcamp'],
    resources: [
      { label: 'MLOps Zoomcamp', url: 'https://github.com/DataTalksClub/mlops-zoomcamp' },
      { label: 'roadmap.sh — MLOps', url: 'https://roadmap.sh/mlops' },
      { label: 'The Missing Semester (MIT)', url: 'https://missing.csail.mit.edu/' },
    ],
    related: ['devops', 'ml-eng', 'data-eng'],
  },

  // ───────────── Dữ liệu ─────────────
  {
    id: 'data-eng',
    name: 'Data Engineer',
    plain: 'Kỹ sư xây "đường ống" dữ liệu',
    group: 'data',
    emoji: '🚰',
    tagline: 'Gom, làm sạch và chuyển dữ liệu tới đúng nơi, đúng lúc.',
    dayInLife:
      'Xây pipeline lấy dữ liệu từ app, website, hệ thống bán hàng về kho dữ liệu; làm sạch, chuẩn hoá để analyst và AI dùng được; đảm bảo dữ liệu đến đúng giờ và không sai.',
    vector: v(4, 4, 0, 1, 1, 4, 1, 3, 2),
    coreSkills: ['SQL nâng cao', 'Python', 'Data warehouse (BigQuery, Snowflake)', 'Airflow / dbt', 'Spark cơ bản'],
    aiSkills: ['Chuẩn bị dữ liệu cho AI/RAG', 'Pipeline cho vector database', 'Chất lượng & quản trị dữ liệu'],
    aiImpact: {
      level: 'boosted',
      text: 'AI chỉ tốt khi dữ liệu tốt. Mọi dự án AI đều cần dữ liệu sạch, nên Data Engineer đang được săn đón nhiều hơn.',
    },
    entryDifficulty: 4,
    salary: { junior: '15–25', middle: '30–50', senior: '55–90' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 1, stable: 3 },
    roadmap: [
      { title: 'SQL & Python', items: ['SQL chắc tay: JOIN, window function', 'Python xử lý dữ liệu với Pandas', 'Mô hình hoá dữ liệu cơ bản'] },
      { title: 'Pipeline', items: ['Docker, Airflow', 'Kho dữ liệu trên cloud (BigQuery free tier)', 'Dự án 1: pipeline lấy dữ liệu công khai mỗi ngày'] },
      { title: 'Sẵn sàng đi làm', items: ['dbt, kiểm tra chất lượng dữ liệu', 'Spark cơ bản', 'Dự án 2: dashboard từ dữ liệu pipeline của bạn'] },
    ],
    firstWeek: ['Làm hết SQLBolt', 'Đọc tuần 1 của Data Engineering Zoomcamp', 'Tải một bộ dữ liệu công khai và đọc bằng Python'],
    resources: [
      { label: 'Data Engineering Zoomcamp', url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp' },
      { label: 'roadmap.sh — Data Engineer', url: 'https://roadmap.sh/data-engineer' },
      { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
    ],
    related: ['backend', 'data-analyst', 'mlops'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst / BI Analyst',
    plain: 'Chuyên viên phân tích dữ liệu',
    group: 'data',
    emoji: '📈',
    tagline: 'Trả lời câu hỏi kinh doanh bằng dữ liệu và biểu đồ.',
    dayInLife:
      'Nhận câu hỏi như "Vì sao doanh thu tháng này giảm?", viết SQL lấy dữ liệu, phân tích, làm dashboard và trình bày cho sếp kèm đề xuất hành động.',
    vector: v(1, 5, 2, 3, 4, 0, 2, 2, 1),
    coreSkills: ['Excel / Google Sheets nâng cao', 'SQL', 'Power BI / Tableau / Looker Studio', 'Thống kê cơ bản', 'Kể chuyện bằng dữ liệu'],
    aiSkills: ['Dùng AI để viết SQL, phân tích nhanh', 'Kiểm chứng kết quả AI đưa ra', 'Python cơ bản cho phân tích'],
    aiImpact: {
      level: 'shifting',
      text: 'AI đã tự viết SQL và vẽ biểu đồ đơn giản, nên phần "kéo số" giảm giá trị. Analyst giỏi sẽ tập trung vào đặt đúng câu hỏi, hiểu nghiệp vụ và thuyết phục người ra quyết định.',
    },
    entryDifficulty: 2,
    salary: { junior: '10–18', middle: '20–35', senior: '40–60' },
    attrs: { salary: 2, fast: 3, aiSafe: 1, creative: 2, stable: 3 },
    roadmap: [
      { title: 'Công cụ', items: ['Excel/Sheets: pivot, VLOOKUP/XLOOKUP', 'SQL cơ bản tới JOIN, GROUP BY', 'Thống kê mô tả'] },
      { title: 'Phân tích', items: ['Power BI hoặc Looker Studio', 'Dự án 1: phân tích dữ liệu bán hàng công khai', 'Dùng AI hỗ trợ phân tích và tự kiểm chứng'] },
      { title: 'Sẵn sàng đi làm', items: ['Dự án 2: dashboard cho một ngành bạn hiểu', 'Viết báo cáo insight 1 trang', 'Portfolio + luyện case phỏng vấn'] },
    ],
    firstWeek: ['Làm 10 bài đầu trên SQLBolt', 'Tạo pivot table từ một file dữ liệu bán hàng mẫu', 'Viết 3 câu hỏi kinh doanh bạn muốn trả lời từ dữ liệu đó'],
    resources: [
      { label: 'roadmap.sh — Data Analyst', url: 'https://roadmap.sh/data-analyst' },
      { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
      { label: 'Kaggle Learn — Pandas', url: 'https://www.kaggle.com/learn/pandas' },
      { label: 'roadmap.sh — BI Analyst', url: 'https://roadmap.sh/bi-analyst' },
    ],
    related: ['ba', 'data-scientist', 'pm'],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    plain: 'Nhà khoa học dữ liệu',
    group: 'data',
    emoji: '🔭',
    tagline: 'Dùng thống kê và mô hình để dự đoán và tìm ra quy luật ẩn.',
    dayInLife:
      'Xây mô hình dự đoán khách nào sắp rời bỏ, chạy thử nghiệm A/B, phân tích sâu nguyên nhân, và trình bày kết quả để công ty ra quyết định.',
    vector: v(3, 5, 1, 2, 2, 1, 5, 1, 1),
    coreSkills: ['Python, Pandas', 'Thống kê & xác suất', 'Machine learning', 'SQL', 'Thiết kế thí nghiệm (A/B test)'],
    aiSkills: ['Dùng LLM cho phân tích văn bản', 'Đánh giá mô hình AI', 'Kết hợp ML truyền thống với LLM'],
    aiImpact: {
      level: 'boosted',
      text: 'Công cụ AI giúp làm nhanh phần kỹ thuật, nhưng tư duy thống kê và khả năng đặt đúng giả thuyết vẫn khan hiếm. Vai trò đang gần lại với ML Engineer.',
    },
    entryDifficulty: 4,
    salary: { junior: '15–25', middle: '30–50', senior: '55–90' },
    attrs: { salary: 3, fast: 1, aiSafe: 2, creative: 2, stable: 2 },
    roadmap: [
      { title: 'Nền tảng', items: ['Python + Pandas', 'Thống kê: phân phối, kiểm định giả thuyết', 'SQL'] },
      { title: 'Mô hình', items: ['scikit-learn: hồi quy, phân loại, phân cụm', 'Dự án 1: dự đoán giá nhà / khách rời bỏ', 'Thi Kaggle cho người mới'] },
      { title: 'Sẵn sàng đi làm', items: ['A/B test & suy luận nhân quả cơ bản', 'Dự án 2: phân tích bình luận tiếng Việt bằng LLM', 'Viết blog giải thích dự án'] },
    ],
    firstWeek: ['Làm khoá Python và Pandas trên Kaggle Learn', 'Ôn khái niệm p-value, khoảng tin cậy', 'Chọn một bộ dữ liệu trên Kaggle bạn thấy thú vị'],
    resources: [
      { label: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
      { label: 'roadmap.sh — AI & Data Scientist', url: 'https://roadmap.sh/ai-data-scientist' },
      { label: 'fast.ai', url: 'https://course.fast.ai/' },
    ],
    related: ['ml-eng', 'data-analyst', 'ai-app'],
  },

  // ───────────── Hạ tầng & Bảo mật ─────────────
  {
    id: 'devops',
    name: 'DevOps / SRE / Cloud Engineer',
    plain: 'Kỹ sư vận hành hệ thống & cloud',
    group: 'infra',
    emoji: '☁️',
    tagline: 'Giữ cho hệ thống luôn chạy, tự động hoá việc triển khai.',
    dayInLife:
      'Dựng hạ tầng trên cloud, viết pipeline tự động đưa code lên production, theo dõi hệ thống, và là người được gọi dậy lúc 2 giờ sáng khi có sự cố.',
    vector: v(3, 1, 0, 1, 0, 5, 1, 4, 2),
    coreSkills: ['Linux', 'Mạng máy tính cơ bản', 'Docker, Kubernetes', 'Cloud (AWS/GCP/Azure)', 'Terraform, CI/CD'],
    aiSkills: ['Hạ tầng cho AI (GPU, model serving)', 'AIOps: dùng AI phát hiện sự cố', 'Tự động hoá bằng AI agent'],
    aiImpact: {
      level: 'boosted',
      text: 'AI giúp viết cấu hình và phân tích log nhanh hơn, nhưng chịu trách nhiệm cho hệ thống thật vẫn là con người. Hạ tầng cho AI là mảng tăng trưởng mạnh.',
    },
    entryDifficulty: 4,
    salary: { junior: '15–25', middle: '30–50', senior: '55–90' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 1, stable: 3 },
    roadmap: [
      { title: 'Linux & mạng', items: ['Dòng lệnh Linux, shell script', 'Mạng: IP, DNS, HTTP', 'Git'] },
      { title: 'Container & cloud', items: ['Docker, Docker Compose', 'Một cloud ở mức cơ bản', 'CI/CD với GitHub Actions'] },
      { title: 'Sẵn sàng đi làm', items: ['Kubernetes, Terraform', 'Giám sát: Prometheus, Grafana', 'Dự án: tự động deploy một app có giám sát'] },
    ],
    firstWeek: ['Cài Linux (hoặc WSL) và dùng dòng lệnh mỗi ngày', 'Học 2 buổi đầu The Missing Semester', 'Tìm hiểu chuyện gì xảy ra khi bạn gõ một địa chỉ web'],
    resources: [
      { label: 'roadmap.sh — DevOps', url: 'https://roadmap.sh/devops' },
      { label: 'The Missing Semester (MIT)', url: 'https://missing.csail.mit.edu/' },
      { label: 'DevOps Exercises', url: 'https://github.com/bregman-arie/devops-exercises' },
    ],
    related: ['mlops', 'security', 'backend'],
  },
  {
    id: 'security',
    name: 'Security Engineer',
    plain: 'Kỹ sư an ninh mạng',
    group: 'infra',
    emoji: '🔐',
    tagline: 'Tìm lỗ hổng trước kẻ xấu và bảo vệ hệ thống.',
    dayInLife:
      'Kiểm thử xâm nhập (pentest) để tìm lỗ hổng, rà soát code, theo dõi cảnh báo tấn công, điều tra sự cố và hướng dẫn team cách làm an toàn.',
    vector: v(3, 1, 0, 1, 0, 4, 3, 5, 1),
    coreSkills: ['Mạng & Linux', 'Lỗ hổng web (OWASP Top 10)', 'Một ngôn ngữ script (Python/Bash)', 'Công cụ pentest', 'Tư duy kẻ tấn công'],
    aiSkills: ['Bảo mật ứng dụng AI (prompt injection)', 'Dùng AI để phân tích mối đe doạ', 'Red teaming mô hình AI'],
    aiImpact: {
      level: 'boosted',
      text: 'AI giúp cả người tấn công lẫn người phòng thủ. Ứng dụng AI tạo ra loại lỗ hổng mới (prompt injection, rò rỉ dữ liệu), nên nhu cầu bảo mật tăng.',
    },
    entryDifficulty: 4,
    salary: { junior: '13–22', middle: '28–50', senior: '55–100' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 2, stable: 3 },
    roadmap: [
      { title: 'Nền tảng', items: ['Mạng máy tính, Linux', 'Python/Bash cơ bản', 'Cách web hoạt động (HTTP, cookie, session)'] },
      { title: 'Tấn công & phòng thủ', items: ['OWASP Top 10', 'Làm lab trên TryHackMe / PortSwigger', 'Chơi CTF cho người mới'] },
      { title: 'Sẵn sàng đi làm', items: ['Bảo mật ứng dụng AI', 'Viết write-up các bài đã giải', 'Cân nhắc chứng chỉ nhập môn (Security+)'] },
    ],
    firstWeek: ['Tạo tài khoản TryHackMe và làm phòng "Pre Security"', 'Đọc OWASP Top 10', 'Làm lab SQL injection đầu tiên trên PortSwigger'],
    resources: [
      { label: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security' },
      { label: 'TryHackMe', url: 'https://tryhackme.com/' },
      { label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
      { label: 'roadmap.sh — Cyber Security', url: 'https://roadmap.sh/cyber-security' },
    ],
    related: ['devops', 'qa', 'backend'],
  },
  {
    id: 'qa',
    name: 'QA / Test Automation & AI Eval',
    plain: 'Kỹ sư kiểm thử & đánh giá chất lượng AI',
    group: 'infra',
    emoji: '🧪',
    tagline: 'Đảm bảo sản phẩm (và AI) chạy đúng trước khi tới tay người dùng.',
    dayInLife:
      'Thiết kế kịch bản kiểm thử, viết test tự động, tìm lỗi trước khi người dùng gặp, và ngày càng nhiều: xây bộ đánh giá xem AI trả lời có đúng, có an toàn không.',
    vector: v(2, 1, 1, 2, 1, 1, 1, 5, 1),
    coreSkills: ['Tư duy kiểm thử, thiết kế test case', 'Test tự động (Playwright, Selenium)', 'API testing', 'Một ngôn ngữ (JS/Python)', 'Quy trình phát triển phần mềm'],
    aiSkills: ['Thiết kế bộ eval cho AI', 'Red teaming, kiểm thử an toàn AI', 'Dùng AI sinh test case'],
    aiImpact: {
      level: 'shifting',
      text: 'Kiểm thử bấm tay đang bị thu hẹp mạnh. Nhưng AI làm sai theo những cách khó lường, nên "kiểm thử AI" (AI eval) đang là hướng mới rất cần người tỉ mỉ.',
    },
    entryDifficulty: 2,
    salary: { junior: '9–16', middle: '18–32', senior: '35–55' },
    attrs: { salary: 1, fast: 3, aiSafe: 1, creative: 1, stable: 2 },
    roadmap: [
      { title: 'Tư duy kiểm thử', items: ['Các loại kiểm thử, viết test case, báo lỗi', 'Kiểm thử API với Postman', 'SQL cơ bản'] },
      { title: 'Tự động hoá', items: ['JavaScript/Python cơ bản', 'Playwright: test tự động một website', 'CI chạy test tự động'] },
      { title: 'Đánh giá AI', items: ['Viết bộ eval cho một chatbot', 'Kiểm thử prompt injection cơ bản', 'Portfolio: báo cáo chất lượng một sản phẩm thật'] },
    ],
    firstWeek: ['Chọn một app bạn dùng, viết 20 test case cho chức năng đăng nhập', 'Cài Playwright và chạy test mẫu', 'Thử "phá" một chatbot AI và ghi lại các câu trả lời sai'],
    resources: [
      { label: 'roadmap.sh — QA', url: 'https://roadmap.sh/qa' },
      { label: 'Playwright Docs', url: 'https://playwright.dev/' },
      { label: 'Anthropic Courses (eval)', url: 'https://github.com/anthropics/courses' },
    ],
    related: ['security', 'ai-app', 'ba'],
  },

  // ───────────── Sản phẩm & Kinh doanh ─────────────
  {
    id: 'pm',
    name: 'Product Manager / AI PM',
    plain: 'Quản lý sản phẩm',
    group: 'product',
    emoji: '🎯',
    tagline: 'Quyết định làm gì, cho ai, vì sao — và dẫn cả team tới đích.',
    dayInLife:
      'Nói chuyện với khách hàng, xem dữ liệu, quyết định tính năng nào làm trước, viết yêu cầu cho team, cân bằng giữa kỹ thuật, thiết kế và kinh doanh.',
    vector: v(1, 2, 3, 5, 5, 0, 1, 1, 3),
    coreSkills: ['Hiểu người dùng (phỏng vấn, khảo sát)', 'Ưu tiên & ra quyết định', 'Phân tích số liệu sản phẩm', 'Giao tiếp, thuyết phục', 'Hiểu kỹ thuật ở mức đủ'],
    aiSkills: ['Hiểu AI làm được gì / không làm được gì', 'Thiết kế tính năng AI & cách đo', 'Prototype nhanh bằng công cụ AI'],
    aiImpact: {
      level: 'boosted',
      text: 'AI giúp PM tự làm prototype, phân tích phản hồi nhanh hơn. PM hiểu AI (AI PM) đang được săn đón, nhưng vị trí PM đầu tiên vẫn cạnh tranh cao.',
    },
    entryDifficulty: 4,
    salary: { junior: '15–25', middle: '30–55', senior: '60–100' },
    attrs: { salary: 3, fast: 1, aiSafe: 3, creative: 3, stable: 2 },
    roadmap: [
      { title: 'Tư duy sản phẩm', items: ['Đọc & phân tích 5 sản phẩm bạn dùng hằng ngày', 'Phỏng vấn người dùng, viết user story', 'Chỉ số sản phẩm: activation, retention'] },
      { title: 'Công cụ', items: ['SQL & dashboard cơ bản', 'Figma cơ bản để vẽ wireframe', 'Prototype bằng công cụ AI'] },
      { title: 'Sẵn sàng đi làm', items: ['Case study: đề xuất 1 tính năng AI cho sản phẩm thật', 'Tham gia dự án thực tế (hackathon, dự án cộng đồng)', 'Thường bắt đầu từ BA, QA, dev hoặc Associate PM'] },
    ],
    firstWeek: ['Chọn một app, viết 1 trang: ai dùng, vấn đề gì, đo thành công thế nào', 'Phỏng vấn 3 người dùng app đó', 'Đọc roadmap.sh Product Manager'],
    resources: [
      { label: 'roadmap.sh — Product Manager', url: 'https://roadmap.sh/product-manager' },
      { label: 'Laws of UX', url: 'https://lawsofux.com/' },
      { label: 'DeepLearning.AI — AI for Everyone', url: 'https://www.deeplearning.ai/courses/ai-for-everyone/' },
    ],
    related: ['ba', 'uiux', 'solutions'],
  },
  {
    id: 'ba',
    name: 'Business Analyst',
    plain: 'Chuyên viên phân tích nghiệp vụ',
    group: 'product',
    emoji: '🗂️',
    tagline: 'Cầu nối giữa người dùng nghiệp vụ và đội kỹ thuật.',
    dayInLife:
      'Gặp phòng ban nghiệp vụ (kế toán, bán hàng…) để hiểu quy trình, viết tài liệu yêu cầu, vẽ luồng nghiệp vụ, giải thích cho dev và kiểm tra sản phẩm có đúng yêu cầu không.',
    vector: v(0, 3, 1, 4, 5, 1, 1, 3, 1),
    coreSkills: ['Thu thập & phân tích yêu cầu', 'Vẽ quy trình (BPMN, flowchart)', 'Viết tài liệu rõ ràng', 'SQL / Excel', 'Agile, Jira'],
    aiSkills: ['Dùng AI soạn tài liệu, user story', 'Phân tích quy trình nào nên tự động hoá bằng AI', 'Kiểm chứng đầu ra AI'],
    aiImpact: {
      level: 'shifting',
      text: 'AI viết tài liệu nhanh, nên giá trị của BA dịch chuyển sang hiểu nghiệp vụ sâu và tư vấn chuyển đổi số/AI. Người có kinh nghiệm ngành (ngân hàng, logistics…) có lợi thế lớn.',
    },
    entryDifficulty: 2,
    salary: { junior: '10–18', middle: '20–35', senior: '40–60' },
    attrs: { salary: 2, fast: 3, aiSafe: 2, creative: 1, stable: 3 },
    roadmap: [
      { title: 'Nền tảng', items: ['Quy trình phát triển phần mềm, Agile/Scrum', 'Viết user story & tiêu chí chấp nhận', 'Vẽ luồng nghiệp vụ'] },
      { title: 'Công cụ', items: ['SQL & Excel', 'Jira/Confluence', 'Wireframe bằng Figma'] },
      { title: 'Sẵn sàng đi làm', items: ['Case study: phân tích và số hoá một quy trình bạn biết rõ', 'Đề xuất chỗ áp dụng AI trong quy trình đó', 'Portfolio tài liệu mẫu'] },
    ],
    firstWeek: ['Vẽ lại quy trình xử lý một đơn hàng ở nơi bạn làm/học', 'Viết 5 user story cho một app quen thuộc', 'Làm 10 bài SQLBolt'],
    resources: [
      { label: 'Agile with Atlassian Jira (Coursera)', url: 'https://www.coursera.org/learn/agile-atlassian-jira' },
      { label: 'SQLBolt', url: 'https://sqlbolt.com/' },
      { label: 'roadmap.sh — Product Manager', url: 'https://roadmap.sh/product-manager' },
    ],
    related: ['pm', 'data-analyst', 'qa'],
  },
  {
    id: 'solutions',
    name: 'Solutions Engineer / DevRel',
    plain: 'Kỹ sư giải pháp & kết nối cộng đồng',
    group: 'product',
    emoji: '🎤',
    tagline: 'Hiểu kỹ thuật, nói chuyện được với khách và cộng đồng.',
    dayInLife:
      'Demo sản phẩm cho khách, thiết kế giải pháp kỹ thuật phù hợp với nhu cầu của họ, viết hướng dẫn, nói ở sự kiện, và mang phản hồi của khách về cho team sản phẩm.',
    vector: v(3, 1, 1, 5, 4, 2, 1, 1, 3),
    coreSkills: ['Nền tảng lập trình & API', 'Thuyết trình, demo', 'Hiểu nhu cầu khách hàng', 'Viết nội dung kỹ thuật', 'Cloud cơ bản'],
    aiSkills: ['Demo & tư vấn giải pháp AI', 'Prototype nhanh cho khách', 'Nội dung hướng dẫn về AI'],
    aiImpact: {
      level: 'boosted',
      text: 'Các công ty AI đang tuyển nhiều người vừa hiểu kỹ thuật vừa giao tiếp tốt để giúp khách hàng dùng AI. Kết hợp hiếm nên giá trị cao.',
    },
    entryDifficulty: 3,
    salary: { junior: '15–25', middle: '30–50', senior: '55–90' },
    attrs: { salary: 3, fast: 2, aiSafe: 3, creative: 2, stable: 2 },
    roadmap: [
      { title: 'Kỹ thuật đủ dùng', items: ['Python/JavaScript cơ bản', 'Gọi API, đọc tài liệu API', 'Cloud cơ bản'] },
      { title: 'Giải pháp', items: ['Xây 2 demo nhỏ dùng API AI', 'Viết bài hướng dẫn cho mỗi demo', 'Luyện thuyết trình 5 phút'] },
      { title: 'Sẵn sàng đi làm', items: ['Nói ở một meetup / làm video hướng dẫn', 'Tham gia cộng đồng công nghệ', 'Portfolio: demo + bài viết + video'] },
    ],
    firstWeek: ['Gọi thử một API công khai và ghi lại các bước', 'Viết bài hướng dẫn 500 chữ về điều vừa làm', 'Tham gia 1 cộng đồng công nghệ (Facebook/Discord)'],
    resources: [
      { label: 'roadmap.sh — DevRel', url: 'https://roadmap.sh/devrel' },
      { label: 'Anthropic Courses (GitHub)', url: 'https://github.com/anthropics/courses' },
      { label: 'Google Technical Writing', url: 'https://developers.google.com/tech-writing' },
    ],
    related: ['pm', 'ai-app', 'tech-writer'],
  },

  // ───────────── Thiết kế & Nội dung ─────────────
  {
    id: 'uiux',
    name: 'UI/UX / Product Designer',
    plain: 'Nhà thiết kế trải nghiệm sản phẩm',
    group: 'design',
    emoji: '🎨',
    tagline: 'Làm sản phẩm dễ dùng, dễ hiểu và đẹp.',
    dayInLife:
      'Nghiên cứu người dùng, vẽ luồng sử dụng, thiết kế màn hình trên Figma, làm prototype để thử với người dùng thật, rồi làm việc với dev để đưa vào sản phẩm.',
    vector: v(0, 1, 5, 4, 2, 0, 2, 2, 2),
    coreSkills: ['Figma', 'Nghiên cứu người dùng', 'Wireframe, prototype', 'Nguyên lý thị giác, typography', 'Design system'],
    aiSkills: ['Thiết kế trải nghiệm cho sản phẩm AI', 'Dùng AI tạo phương án nhanh', 'Thiết kế khi AI sai/không chắc chắn'],
    aiImpact: {
      level: 'shifting',
      text: 'AI vẽ được giao diện cơ bản, nên việc "vẽ màn hình" thuần giảm giá trị. Designer hiểu người dùng, giỏi giải quyết vấn đề và biết thiết kế cho sản phẩm AI sẽ rất được cần.',
    },
    entryDifficulty: 2,
    salary: { junior: '10–18', middle: '20–35', senior: '40–65' },
    attrs: { salary: 2, fast: 2, aiSafe: 2, creative: 3, stable: 2 },
    roadmap: [
      { title: 'Nền tảng', items: ['Figma cơ bản', 'Nguyên lý: bố cục, màu sắc, chữ', 'Vẽ lại 5 màn hình app bạn thích'] },
      { title: 'Quy trình UX', items: ['Phỏng vấn người dùng, persona', 'Wireframe → prototype', 'Dự án 1: thiết kế lại một app có vấn đề'] },
      { title: 'Sẵn sàng đi làm', items: ['Dự án 2: thiết kế tính năng AI (chatbot, gợi ý)', 'Case study có quy trình & số liệu', 'Portfolio trên Behance/website'] },
    ],
    firstWeek: ['Cài Figma, làm theo một bài hướng dẫn cho người mới', 'Chụp 3 màn hình khó dùng trong app quen thuộc, ghi lý do', 'Đọc 10 nguyên tắc trên Laws of UX'],
    resources: [
      { label: 'Laws of UX', url: 'https://lawsofux.com/' },
      { label: 'roadmap.sh — UX Design', url: 'https://roadmap.sh/ux-design' },
      { label: 'Figma Learn', url: 'https://help.figma.com/' },
    ],
    related: ['frontend', 'pm', 'mobile'],
  },
  {
    id: 'tech-writer',
    name: 'Technical Writer / AI Content',
    plain: 'Người viết nội dung kỹ thuật',
    group: 'design',
    emoji: '✍️',
    tagline: 'Giải thích những thứ phức tạp sao cho ai cũng hiểu.',
    dayInLife:
      'Viết tài liệu hướng dẫn, tài liệu API, bài trợ giúp; phỏng vấn kỹ sư để hiểu tính năng; ngày càng nhiều: biên soạn dữ liệu, viết prompt và kiểm duyệt nội dung cho hệ thống AI.',
    vector: v(1, 1, 2, 5, 2, 1, 3, 3, 1),
    coreSkills: ['Viết rõ ràng, có cấu trúc', 'Hiểu kỹ thuật ở mức đọc được code/API', 'Markdown, Git cơ bản', 'Tiếng Anh tốt', 'Phỏng vấn chuyên gia'],
    aiSkills: ['Viết prompt & hướng dẫn hệ thống cho AI', 'Biên soạn dữ liệu đánh giá', 'Biên tập, kiểm chứng nội dung AI viết'],
    aiImpact: {
      level: 'shifting',
      text: 'AI viết bản nháp rất nhanh, nên công việc dịch chuyển sang biên tập, kiểm chứng và "dạy" AI (viết prompt, dữ liệu mẫu). Người viết giỏi + hiểu AI vẫn có chỗ đứng.',
    },
    entryDifficulty: 2,
    salary: { junior: '9–15', middle: '18–30', senior: '35–50' },
    attrs: { salary: 1, fast: 3, aiSafe: 1, creative: 2, stable: 2 },
    roadmap: [
      { title: 'Viết kỹ thuật', items: ['Khoá Technical Writing của Google', 'Markdown, Git cơ bản', 'Viết lại tài liệu khó hiểu của một sản phẩm'] },
      { title: 'Hiểu kỹ thuật', items: ['Gọi một API và viết hướng dẫn', 'Đọc hiểu code cơ bản', 'Viết prompt hệ thống cho một chatbot'] },
      { title: 'Sẵn sàng đi làm', items: ['Đóng góp tài liệu cho dự án mã nguồn mở', 'Portfolio 3–5 bài mẫu', 'Ứng tuyển vị trí docs / AI content'] },
    ],
    firstWeek: ['Học phần 1 khoá Technical Writing của Google', 'Viết hướng dẫn cài đặt một phần mềm cho người lớn tuổi', 'Thử viết prompt hướng dẫn AI trả lời theo phong cách của bạn'],
    resources: [
      { label: 'Google Technical Writing', url: 'https://developers.google.com/tech-writing' },
      { label: 'roadmap.sh — Technical Writer', url: 'https://roadmap.sh/technical-writer' },
      { label: 'Anthropic Prompt Engineering', url: 'https://github.com/anthropics/courses' },
    ],
    related: ['solutions', 'qa', 'ba'],
  },
];

export const roleById = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<string, Role>;

/** Ngành cũ → lợi thế cụ thể cho từng vai trò (dùng cả để cộng điểm và để giải thích). */
export const FIELD_TRANSFER: Record<string, { bonus: Record<string, number>; advantage: Record<string, string> }> = {
  finance: {
    bonus: { 'data-analyst': 0.08, ba: 0.06, 'data-scientist': 0.03 },
    advantage: {
      'data-analyst': 'Hiểu báo cáo tài chính là lợi thế lớn khi làm Data Analyst ở ngân hàng, fintech.',
      ba: 'Ngân hàng và fintech rất cần BA hiểu nghiệp vụ tài chính.',
      'data-scientist': 'Kinh nghiệm phân tích rủi ro, dự báo giúp bạn làm mô hình tài chính tốt hơn.',
    },
  },
  sales: {
    bonus: { solutions: 0.07, pm: 0.06, ba: 0.05 },
    advantage: {
      solutions: 'Kỹ năng bán hàng + hiểu kỹ thuật là kết hợp hiếm cho Solutions Engineer.',
      pm: 'Bạn đã quen lắng nghe khách hàng — kỹ năng cốt lõi của PM.',
      ba: 'Hiểu quy trình bán hàng giúp bạn phân tích yêu cầu CRM, thương mại điện tử.',
    },
  },
  marketing: {
    bonus: { pm: 0.05, 'data-analyst': 0.05, uiux: 0.04, 'tech-writer': 0.03 },
    advantage: {
      pm: 'Hiểu khách hàng và thị trường là nền tảng của Product Manager.',
      'data-analyst': 'Marketing analytics (đo chiến dịch, phễu chuyển đổi) là mảng rất cần người.',
      uiux: 'Bạn đã quen tư duy về thông điệp và hành vi người dùng.',
      'tech-writer': 'Kỹ năng viết nội dung là lợi thế khi làm content kỹ thuật.',
    },
  },
  design: {
    bonus: { uiux: 0.08, frontend: 0.05, mobile: 0.03 },
    advantage: {
      uiux: 'Nền tảng thị giác giúp bạn đi nhanh hơn hẳn người mới trong UI/UX.',
      frontend: 'Frontend dev có mắt thẩm mỹ rất được designer và khách hàng quý.',
      mobile: 'App đẹp và mượt là lợi thế cạnh tranh — bạn có sẵn mắt nhìn đó.',
    },
  },
  education: {
    bonus: { 'tech-writer': 0.07, solutions: 0.05, pm: 0.02 },
    advantage: {
      'tech-writer': 'Giải thích dễ hiểu là nghề của bạn — đúng thứ Technical Writer cần.',
      solutions: 'DevRel về bản chất là "dạy" cộng đồng dùng sản phẩm.',
      pm: 'Edtech rất cần PM hiểu người học và người dạy.',
    },
  },
  engineering: {
    bonus: { devops: 0.05, backend: 0.04, 'data-eng': 0.03, qa: 0.04 },
    advantage: {
      devops: 'Tư duy hệ thống và quy trình kỹ thuật chuyển sang DevOps rất tự nhiên.',
      backend: 'Nền tảng toán, logic kỹ thuật giúp bạn học lập trình nhanh.',
      'data-eng': 'Kinh nghiệm với cảm biến, dữ liệu sản xuất là lợi thế ở mảng IoT/công nghiệp.',
      qa: 'Quen kiểm định, tiêu chuẩn chất lượng — rất hợp với QA.',
    },
  },
  science: {
    bonus: { 'data-scientist': 0.07, 'ml-eng': 0.04, 'data-analyst': 0.04 },
    advantage: {
      'data-scientist': 'Tư duy thí nghiệm, thống kê từ nghiên cứu khoa học là nền tảng của Data Scientist.',
      'ml-eng': 'AI trong y sinh, dược đang cần người hiểu cả chuyên môn lẫn mô hình.',
      'data-analyst': 'Healthtech cần analyst hiểu dữ liệu y tế.',
    },
  },
  writing: {
    bonus: { 'tech-writer': 0.08, pm: 0.03, uiux: 0.02 },
    advantage: {
      'tech-writer': 'Viết tốt là kỹ năng cốt lõi — bạn chỉ cần thêm phần kỹ thuật.',
      pm: 'PM viết tài liệu và giao tiếp rất nhiều, viết rõ ràng là lợi thế.',
      uiux: 'UX writing (chữ trên giao diện) là mảng ngách đang cần người.',
    },
  },
  operations: {
    bonus: { ba: 0.06, qa: 0.04, pm: 0.03, devops: 0.02 },
    advantage: {
      ba: 'Hiểu quy trình vận hành thực tế giúp bạn làm BA cho hệ thống logistics, ERP.',
      qa: 'Tư duy quy trình, kiểm soát lỗi rất hợp với QA.',
      pm: 'Sản phẩm cho logistics, chuỗi cung ứng cần PM hiểu vận hành.',
      devops: 'Tư duy "giữ cho mọi thứ chạy trơn tru" giống DevOps.',
    },
  },
  other: { bonus: {}, advantage: {} },
};

/** Kinh nghiệm đã có → cộng điểm nhẹ. */
export const EXPERIENCE_BONUS: Record<string, Record<string, number>> = {
  code: { backend: 0.02, frontend: 0.02, fullstack: 0.02, mobile: 0.02, 'ai-app': 0.02 },
  excel: { 'data-analyst': 0.03, ba: 0.02 },
  figma: { uiux: 0.03, frontend: 0.02 },
  ai: { 'ai-app': 0.03, pm: 0.01, qa: 0.01 },
  website: { frontend: 0.03, fullstack: 0.03 },
  manage: { pm: 0.03, ba: 0.02 },
  sales: { solutions: 0.03, pm: 0.01 },
};
