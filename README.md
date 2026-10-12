# 🧭 Hướng nghiệp IT thời AI

Web trắc nghiệm giúp sinh viên, intern và người trái ngành **trong ~5 phút** biết mình hợp với vai trò nào trong ngành IT, mức độ AI tác động tới vai trò đó và lộ trình bắt đầu.

- **Static site**: Vite + React + TypeScript + Tailwind, không cần backend.
- **Chấm điểm rule-based**, minh bạch: `src/lib/scoring.ts`.
- **Thu thập dữ liệu ẩn danh** qua Google Sheets + Apps Script (tuỳ chọn).

## Chạy thử

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # test engine chấm điểm + tracking
npm run build    # xuất ra dist/
```

## Cấu trúc bài trắc nghiệm

| Chương | Dạng | Số câu | Bắt buộc |
|---|---|---|---|
| 0. Bạn là ai | Chọn nhanh | 3–4 | ✔ |
| 1. Một tuần ở công ty công nghệ | Tình huống, chọn 1/4 | 8 | ✔ |
| → Kết quả sơ bộ | Xem ngay hoặc làm thêm ~3 phút | | |
| 2. Chọn nhanh | This-or-That | 7 | tuỳ chọn |
| 3. Thử tay 30 giây | Thử thách mini | 3 | tuỳ chọn |
| 4. Điều bạn ưu tiên | Chọn 1 | 1 | tuỳ chọn |

Nội dung nằm trong `src/data/`:

- `questions.ts` — câu hỏi và trọng số từng đáp án lên 8 chiều (+ tín hiệu phụ "build").
- `roles.ts` — 18 vai trò: vector phù hợp, mô tả, tác động AI, lộ trình, lương tham khảo, tài nguyên; lợi thế theo ngành cũ.
- `dimensions.ts` — 8 chiều năng lực/sở thích.

Thuật toán: cộng điểm theo đáp án → chuẩn hoá 0–100 mỗi chiều → tương quan (Pearson có trọng số) với vector từng vai trò → cộng nhẹ theo ngành cũ, kinh nghiệm, ưu tiên → xếp hạng.

> Khi sửa câu hỏi hoặc vai trò, chạy `npm test`: có test kiểm tra các hồ sơ mẫu và kiểm tra `apps-script/Code.gs` còn khớp.
> Nếu đổi ý nghĩa câu hỏi, tăng `QUIZ_VERSION` (và thêm vào `VERSIONS` trong `Code.gs`) để tách dữ liệu cũ/mới.

## Deploy lên GitHub Pages

1. Repo › **Settings › Pages** › Source: **GitHub Actions**.
2. Push lên `main`/`master` — workflow `.github/workflows/deploy.yml` sẽ test, build và deploy.

Web dùng đường dẫn tương đối + hash routing nên chạy được ở bất kỳ thư mục nào (GitHub Pages, Netlify, Vercel…).

## Thu thập dữ liệu với Google Sheets (~5 phút)

1. Tạo một Google Sheet mới.
2. **Extensions › Apps Script**, xoá code mẫu, dán toàn bộ `apps-script/Code.gs`, lưu.
3. Chọn hàm **`setup`** › **Run** (cấp quyền lần đầu). Sheet sẽ có các tab `dashboard`, `sessions`, `events`, `results`, `feedback`, `emails`.
4. **Deploy › New deployment** › loại **Web app**: *Execute as*: **Me**, *Who has access*: **Anyone** › Deploy › copy URL kết thúc bằng `/exec`.
5. Repo GitHub › **Settings › Secrets and variables › Actions › Variables** › tạo biến `VITE_SHEETS_ENDPOINT` = URL vừa copy. Chạy lại workflow deploy.
   - Chạy local: tạo file `.env.local` với `VITE_SHEETS_ENDPOINT=...`.
6. Kiểm tra: làm thử 1 lượt trắc nghiệm, xem dữ liệu xuất hiện trong Sheet.

Khi sửa `Code.gs`, cần **Deploy › Manage deployments › Edit › New version** để cập nhật (URL giữ nguyên).

### Dữ liệu thu được

| Tab | Mỗi dòng | Dùng để |
|---|---|---|
| `dashboard` | công thức sẵn | lượt bắt đầu/hoàn thành, phễu rời bỏ theo từng câu, % làm tiếp sau kết quả sơ bộ, phân bố vai trò #1, đánh giá theo vai trò |
| `sessions` | 1 lượt làm bài | câu xa nhất đã tới, có xem sơ bộ / làm tiếp / hoàn thành không |
| `events` | 1 sự kiện | log thô, kèm thời gian dừng ở từng câu |
| `results` | 1 kết quả | bối cảnh, đáp án, 8 chiều, top 3 |
| `feedback` | 1 đánh giá | số sao, vai trò người dùng nghĩ hợp hơn, góp ý |
| `emails` | 1 email | **tách riêng** để có thể chia sẻ các tab còn lại mà không lộ email |

Bảo vệ: kiểm tra định dạng & độ dài từng trường, chặn chèn công thức, ô bẫy chống bot, giới hạn request mỗi lượt làm bài, khoá ghi khi nhiều người gửi cùng lúc. Người dùng có thể tắt gửi dữ liệu tự động ở trang **Quyền riêng tư**.

Giới hạn: phù hợp tới khoảng vài chục nghìn lượt. Khi lớn hơn, chuyển sang Supabase/Postgres chỉ cần sửa `src/lib/tracking.ts`.
