import { useState } from 'react';
import { isOptedOut, setOptOut, trackingEnabled } from '../lib/tracking';

export default function Privacy() {
  const [optedOut, setOpted] = useState(isOptedOut());
  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Quyền riêng tư</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        <p>Mình thu thập dữ liệu <b>ẩn danh</b> để hiểu công cụ có hữu ích không và cải thiện độ chính xác của kết quả.</p>
        <h2 className="pt-2 text-lg font-bold">Mình lưu những gì</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Câu trả lời trắc nghiệm và kết quả (hồ sơ 8 chiều, top 3 vai trò).</li>
          <li>Bạn dừng ở câu nào, mất bao lâu mỗi câu (để biết câu nào khó hiểu).</li>
          <li>Loại thiết bị: điện thoại hay máy tính.</li>
          <li>Đánh giá & góp ý, nếu bạn tự gửi.</li>
          <li>Email, chỉ khi bạn tự nhập và đồng ý — được lưu tách riêng khỏi câu trả lời.</li>
        </ul>
        <h2 className="pt-2 text-lg font-bold">Mình không lưu</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Tên, số điện thoại hay bất kỳ thông tin định danh nào khác.</li>
          <li>Không dùng cookie quảng cáo, không bán hay chia sẻ dữ liệu cho bên thứ ba.</li>
        </ul>
        <p>Mỗi lượt làm bài được gắn một mã ngẫu nhiên, không liên kết với danh tính của bạn. Tiến độ làm bài được lưu ngay trên trình duyệt của bạn.</p>
        <p>Muốn xoá email đã đăng ký? Hãy liên hệ chủ trang web để được xoá.</p>
      </div>

      <div className="card mt-8 p-5">
        <h2 className="font-bold">Tự động gửi dữ liệu ẩn danh</h2>
        {trackingEnabled() ? (
          <>
            <p className="muted mt-1 text-sm">
              Trạng thái: <b className={optedOut ? 'text-rose-600' : 'text-emerald-600'}>{optedOut ? 'Đã tắt' : 'Đang bật'}</b>. Khi tắt, chỉ những gì bạn tự bấm gửi (góp ý, email) mới được gửi đi.
            </p>
            <button
              type="button"
              className={optedOut ? 'btn-primary mt-4' : 'btn-secondary mt-4'}
              onClick={() => {
                setOptOut(!optedOut);
                setOpted(!optedOut);
              }}
            >
              {optedOut ? 'Bật lại' : 'Không gửi dữ liệu của tôi'}
            </button>
          </>
        ) : (
          <p className="muted mt-1 text-sm">Phiên bản này chưa cấu hình thu thập dữ liệu — không có gì được gửi đi.</p>
        )}
      </div>
    </div>
  );
}
