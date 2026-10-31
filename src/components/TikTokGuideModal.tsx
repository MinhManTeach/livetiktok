import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Radio, Tv, Volume2, Sparkles } from 'lucide-react';

interface TikTokGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  overlayUrl: string;
}

export const TikTokGuideModal: React.FC<TikTokGuideModalProps> = ({
  isOpen,
  onClose,
  overlayUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1c0f07] border-2 border-amber-500 rounded-xl shadow-[0_0_35px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#421b06] via-[#652c0a] to-[#421b06] p-3.5 border-b border-amber-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="text-amber-400 animate-pulse" size={20} />
            <div>
              <h2 className="text-amber-200 font-extrabold text-base tracking-wide font-buddhist">
                HƯỚNG DẪN KẾT NỐI TIKTOK LIVE STUDIO & OBS STUDIO
              </h2>
              <p className="text-amber-300/80 text-xs">
                Đưa Màn Hình Chánh Điện 9:16 Lên Sóng Trực Tiếp Chuyên Nghiệp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-black/40 text-amber-300 hover:text-white border border-amber-500/40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-sm text-[#f5e6d3]">
          {/* URL Box */}
          <div className="bg-[#120703] border-2 border-amber-500/70 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1.5">
              <span>ĐƯỜNG LINK OVERLAY 9:16 (DÁN VÀO TIKTOK LIVE STUDIO / OBS):</span>
              <span className="text-[10px] text-emerald-400 font-normal">Tỷ lệ dọc 1080x1920</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={overlayUrl}
                className="w-full bg-black/60 border border-amber-600/60 rounded px-2.5 py-1.5 text-xs text-amber-200 font-mono select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép'}</span>
              </button>
            </div>
          </div>

          {/* 4 Steps */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="bg-[#140a05] border border-amber-700/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center font-extrabold text-[11px]">
                  1
                </span>
                <span>GIỮ NGUYÊN BẢNG ĐIỀU KHIỂN NÀY ĐANG CHẠY</span>
              </div>
              <p className="text-xs text-zinc-300 pl-7 leading-relaxed">
                Bảng điều khiển này là trung tâm điều phối âm thanh (Chuông, Mõ, Nhạc thiền 432Hz, Giọng đọc sớ TTS) và xử lý danh sách Phật tử vào bồ đoàn thời gian thực.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#140a05] border border-amber-700/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center font-extrabold text-[11px]">
                  2
                </span>
                <span>THÊM NGUỒN VÀO TIKTOK LIVE STUDIO (HOẶC OBS)</span>
              </div>
              <ul className="text-xs text-zinc-300 pl-7 space-y-1 list-disc list-inside leading-relaxed">
                <li>
                  Mở <b>TikTok LIVE Studio</b> ➔ Chọn bố cục <b>Màn hình dọc (Portrait 9:16)</b>.
                </li>
                <li>
                  Tại mục <b>Nguồn (Sources)</b> ➔ Bấm dấu <b>+ Thêm nguồn</b> ➔ Chọn <b>Liên kết (Link / Browser)</b>.
                </li>
                <li>
                  Dán đường dẫn vừa sao chép ở trên vào ô <b>URL</b>.
                </li>
                <li>
                  Cài đặt thông số: Chiều rộng <b>1080</b>, Chiều cao <b>1920</b>, Tốc độ khung hình <b>60 FPS</b>.
                </li>
                <li>
                  Bấm <b>Lưu</b> (Nếu khung hình chưa khít, bấm chuột phải vào nguồn ➔ Chọn <i>Chỉnh sửa ➔ Vừa với màn hình</i>).
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-[#140a05] border border-amber-700/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center font-extrabold text-[11px]">
                  3
                </span>
                <span>CÀI ĐẶT ÂM THANH (CHUÔNG, MÕ & GIỌNG ĐỌC SỚ)</span>
              </div>
              <div className="text-xs text-zinc-300 pl-7 space-y-1 leading-relaxed">
                <p>
                  • Trong TikTok LIVE Studio, đảm bảo mục <b>Âm thanh máy tính (Desktop Audio / Speaker)</b> đang được <b>BẬT (Xanh lá)</b>.
                </p>
                <p>
                  • Bạn có thể <b>Tắt Micrô (Mute Mic)</b> trên TikTok Studio để không bị lẫn tiếng ồn phòng bên ngoài vào không gian thanh tịnh của Chánh Điện.
                </p>
                <p>
                  • Bấm thử nút <b>🔔 Thỉnh Chuông</b> trên bảng điều khiển: nếu thấy cột âm lượng máy tính trên TikTok Studio nhảy xanh là khán giả đã nghe rõ!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#140a05] border border-amber-700/40 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center font-extrabold text-[11px]">
                  4
                </span>
                <span>BẤM "PHÁT LIVE" & KẾT NỐI TIKTOK THẬT</span>
              </div>
              <div className="text-xs text-zinc-300 pl-7 space-y-1.5 leading-relaxed">
                <p>
                  • <b>Quan trọng:</b> Bấm nút <b>Phát LIVE (Go LIVE)</b> trên TikTok Studio trước để phòng live chuyển sang trạng thái online.
                </p>
                <p>
                  • Quay lại bảng điều khiển này, nhập chính xác <b>@ID_Kênh_TikTok</b> của bạn vào mục số 3 rồi bấm <b>🔗 Kết Nối</b>.
                </p>
                <p className="text-amber-300">
                  • <i>Mẹo khi mới mở live:</i> Hãy bấm nút <b>36 Người</b> hoặc bật nút <b>🤖 Auto</b> để phòng luôn đông đúc Phật tử áo lam ngồi hai bên bồ đoàn, kích thích người lướt qua dừng lại thắp hương và cúng dường!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#120703] p-3 border-t border-amber-700/50 flex items-center justify-between">
          <div className="text-[11px] text-amber-300/80 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>Chúc phòng Live Chánh Điện của bạn vạn duyên hòa hợp, công đức viên mãn!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-colors"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
