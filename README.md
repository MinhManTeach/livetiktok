# Thiền Đường Tịnh Tâm – TikTok Live Studio

Ứng dụng tạo **phòng live TikTok tương tác** theo khung dọc 9:16, dùng làm nguồn hình cho **TikTok LIVE Studio** hoặc **OBS**. Có hai giao diện:

- 🛕 **Chùa** – chánh điện, Phật tử áo lam ngồi bồ đoàn, bát hương, hòm công đức.
- ⛪ **Nhà thờ** – thánh đường, người đi lễ ngồi băng ghế, giá nến, hòm dâng cúng.

Người xem trên TikTok **bình luận** → vào chỗ ngồi và thắp hương / thắp nến; **tặng quà** → bỏ vào hòm, xướng tên và hiện lên bảng vinh danh. Tất cả hiển thị trực tiếp trên sóng.

---

## Mục lục

1. [Tính năng](#tính-năng)
2. [Cài đặt](#cài-đặt)
3. [Chạy ứng dụng](#chạy-ứng-dụng)
4. [Đưa lên TikTok LIVE Studio / OBS](#đưa-lên-tiktok-live-studio--obs)
5. [Kết nối phòng live TikTok](#kết-nối-phòng-live-tiktok)
6. [Sử dụng bảng điều khiển](#sử-dụng-bảng-điều-khiển)
7. [Nhạc nền](#nhạc-nền)
8. [Ảnh nền riêng](#ảnh-nền-riêng)
9. [Cấu hình (.env)](#cấu-hình-env)
10. [Xử lý sự cố](#xử-lý-sự-cố)
11. [Cấu trúc mã nguồn](#cấu-trúc-mã-nguồn)
12. [Lưu ý](#lưu-ý)

---

## Tính năng

| Nhóm | Chi tiết |
|---|---|
| Kết nối TikTok LIVE thật | Nhận bình luận, quà (tính đúng combo), người vào phòng, theo dõi, chia sẻ. |
| Overlay 9:16 | Trang `?view=overlay` tự co giãn vừa mọi khung (540×960, 1080×1920…), đồng bộ tức thì với bảng điều khiển. |
| Hai giao diện | Chùa / Nhà thờ, đổi bằng một nút, overlay đổi theo ngay. |
| Chỗ ngồi | Người xem ngồi theo hàng có phối cảnh xa gần; lời cầu hiện thành bong bóng trong 30 giây. |
| Hiệu ứng | Bát hương / giá nến tăng theo lượt thắp, người đi lên thảm đỏ, xu rơi vào hòm, thông báo. |
| Âm thanh | Chuông, mõ, giọng đọc xướng tên khi có quà, nhạc nền mp3 (có thanh tua) hoặc âm thiền 432/528Hz. |
| Ảnh nền | 5 mẫu chùa có sẵn hoặc ảnh riêng của bạn (được lưu lại, không mất khi tải lại trang). |
| Giả lập | Chế độ Auto tạo tương tác mẫu để thử trước khi live. |

---

## Cài đặt

**Yêu cầu:** [Node.js](https://nodejs.org) **20.19 trở lên** (khuyên dùng bản LTS mới nhất) và Git.

```bash
git clone https://github.com/MinhManTeach/livetiktok.git
cd livetiktok
git checkout feat/tiktok-live-connect
npm install
```

> Chỉ cần chạy `npm install` một lần (hoặc khi chuyển sang máy khác / xoá thư mục `node_modules`).

---

## Chạy ứng dụng

```bash
npm run dev
```

Khi thấy dòng `Thiền Đường Tịnh Tâm đang chạy tại http://localhost:3000` là xong. **Giữ cửa sổ này mở suốt buổi live** (đóng là app tắt; tắt bằng `Ctrl + C`).

| Địa chỉ | Dùng để |
|---|---|
| http://localhost:3000 | **Bảng điều khiển** – mở trong Chrome/Edge/Brave và giữ tab này mở khi live (phát âm thanh và gửi dữ liệu sang overlay). |
| http://localhost:3000/?view=overlay | **Overlay 9:16** – nguồn hình cho TikTok LIVE Studio / OBS. |

Chạy bản production (nhanh hơn, không tự cập nhật khi sửa code):

```bash
npm run build
npm run start
```

---

## Đưa lên TikTok LIVE Studio / OBS

### Cách 1 – Nguồn Liên kết (Link / Browser Source)

1. TikTok LIVE Studio → bố cục **màn hình dọc** → **Add source** → **Liên kết (Link)**.
2. Dán: `http://localhost:3000/?view=overlay`
3. **Custom resolution**: bật, đặt **1080 × 1920**.
4. **Turn on sound**: **tắt** (âm thanh đã phát từ bảng điều khiển qua Âm thanh máy tính, bật thêm sẽ bị lặp tiếng).
5. **Add source**, rồi chuột phải → **Vừa màn hình**.

> Nếu LIVE Studio báo *"Enter correct URL"*, thử `http://127.0.0.1:3000/?view=overlay` hoặc dùng Cách 2.

### Cách 2 – Chụp cửa sổ (Window capture) – chắc chắn chạy

1. Mở overlay thành **cửa sổ Chrome gọn, không thanh tab/địa chỉ**:

   ```bat
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000/?view=overlay --window-size=562,1000
   ```

   (Có thể lưu dòng trên vào một file `.bat` để nhấp đúp mỗi lần live.)
2. LIVE Studio → **Add source** → **Window capture** → chọn cửa sổ **"Overlay Chanh Dien 9x16"**.
   Không chọn cửa sổ *"… – Google Chrome"* (sẽ dính thanh tab).
3. Chuột phải nguồn → **Vừa màn hình**; dùng **Crop** nếu còn dư mép.
4. Không thu nhỏ cửa sổ overlay xuống taskbar (có thể bị chụp ra màn hình đen).

### Âm thanh

- Trong LIVE Studio bật **Âm thanh máy tính (Desktop Audio)**.
- Bấm 🔔 **Thỉnh Chuông** trên bảng điều khiển để kiểm tra: cột âm lượng máy tính nhảy là khán giả đã nghe được.
- Overlay mặc định **tắt tiếng**. Muốn overlay tự phát tiếng (khi không dùng Desktop Audio), thêm `&sound=1` vào link.

---

## Kết nối phòng live TikTok

1. Bấm **Phát LIVE** trên TikTok LIVE Studio **trước**.
2. Trên bảng điều khiển, nhập `@ID` kênh của bạn → **Kết Nối**.
3. Nút chuyển **xanh "Ngắt"** và nhật ký báo *"✅ Đã kết nối kênh…"* là đang nhận dữ liệu thật.

| Sự kiện trên TikTok | Trên phòng live |
|---|---|
| Bình luận | Người xem vào chỗ ngồi, thắp 1 nén hương / 1 ngọn nến, lời bình luận thành lời cầu. |
| Tặng quà | Đi lên thảm đỏ, xu rơi vào hòm, cộng điểm, xướng tên (nếu bật giọng đọc). Combo quà chỉ tính 1 lần khi kết thúc. |
| Vào phòng | Ngồi vào chỗ. |
| Theo dõi / Chia sẻ | Ghi vào nhật ký. |

Ngắt kết nối: bấm **Ngắt**.

---

## Sử dụng bảng điều khiển

- **Giao diện phòng live** – chọn 🛕 **Chùa** hoặc ⛪ **Nhà thờ** (được nhớ cho lần sau). Câu chữ, nhân vật, ảnh nền, lời xướng đều đổi theo.
- **Mẫu không gian chùa** – 5 mẫu có sẵn hoặc ảnh riêng (chỉ áp dụng cho giao diện Chùa).
- **Số chỗ ngồi** – 24 / 36 / 64 / 100.
- **Thao tác tay** – thêm người, thắp hương, tặng quà thử, lấp đầy nhanh 15 / 33 / 64 người, làm trống.
- **Auto** – giả lập tương tác mỗi ~5 giây để thử hiệu ứng (tắt khi live thật nếu không muốn khán giả thấy tương tác giả).
- **Âm thanh** – chọn giọng đọc, độ trầm/tốc độ, thỉnh chuông, gõ mõ, nhịp mõ tự động, bật/tắt giọng đọc xướng tên khi có quà.
- **Nhật ký** – mọi bình luận, quà, kết nối đều được ghi lại.

> ⚠️ Danh sách người ngồi và điểm công đức nằm trong **tab bảng điều khiển**. Tải lại (F5) tab này sẽ đưa về dữ liệu mẫu – tránh làm khi đang live. Tải lại **cửa sổ overlay** thì không sao.

---

## Nhạc nền

1. Chép file nhạc (`.mp3`, `.m4a`, `.aac`, `.ogg`, `.wav`) vào thư mục **`public/music/`**.
   Tên file = tên bài hiện trong danh sách (ví dụ `Nam Mo A Di Da Phat.mp3`).
2. Trên bảng điều khiển, mục 🎵 **Nhạc nền**, bấm **↻** để tải lại danh sách → chọn bài → **Bật Nhạc**.
3. Tuỳ chọn:
   - **Âm lượng mp3**, **Lặp 1 bài** / **Phát lần lượt**.
   - **Thanh tua**: kéo để tua, nút **⏪ 1p / 1p ⏩**, hiện thời gian đã phát / tổng thời lượng.
   - Tắt rồi Bật lại cùng bài → **phát tiếp từ chỗ dừng**.

> File nhạc **không** được đưa lên GitHub (đã có trong `.gitignore`). Hãy dùng nhạc bạn có quyền sử dụng; nhạc có bản quyền có thể khiến phòng live bị tắt tiếng hoặc cảnh báo.

---

## Ảnh nền riêng

- **Chùa**: bấm **📂 Chọn File Ảnh** (hoặc **Tải ảnh** trên overlay) để dùng ảnh chánh điện của bạn. Ảnh được lưu ở `.data/` trên máy chạy server nên **không mất** khi tải lại trang hay khởi động lại server.
- **Nhà thờ**: dùng ảnh `public/backgrounds/nha-tho.png`.
- Ảnh nên là **khổ dọc 9:16** (ví dụ 1080×1920). Vị trí bát hương, chủ lễ và hàng ghế được canh theo ảnh mặc định; đổi sang ảnh có bố cục khác có thể cần canh lại trong mã nguồn (`ChurchSeating.tsx`, `SeatingWing.tsx`, `TempleOverlay916.tsx`).

---

## Cấu hình (.env)

Tạo file `.env` từ `.env.example` (không bắt buộc):

| Biến | Ý nghĩa |
|---|---|
| `EULER_API_KEY` | Key của Euler Stream (dịch vụ ký kết nối mà thư viện TikTok dùng). Không có key vẫn chạy được bằng gói miễn phí nhưng bị giới hạn số lần kết nối. |
| `PORT` | Cổng server, mặc định `3000`. |

---

## Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Kết nối báo *"Kênh … hiện không live hoặc sai ID"* | Kiểm tra `@ID`, bấm Phát LIVE trước rồi đợi vài giây mới Kết Nối. |
| Overlay không cập nhật | Bảng điều khiển phải đang mở; kiểm tra cửa sổ `npm run dev` còn chạy. |
| LIVE Studio không thấy cửa sổ overlay trong Window capture | Chọn cửa sổ tên **"Overlay Chanh Dien 9x16"**; đóng mở lại hộp chọn nguồn để làm mới danh sách. |
| Overlay có viền đen / bị lệch | Chuột phải nguồn → Vừa màn hình, dùng Crop để cắt mép. |
| Khán giả không nghe tiếng | Bật Desktop Audio trong LIVE Studio; bấm vào trang bảng điều khiển một lần (trình duyệt chỉ cho phát âm thanh sau khi có thao tác). |
| `npm install` lỗi `ENOTEMPTY` | Tắt server (`Ctrl + C`) rồi chạy lại `npm install`. |
| Báo không tìm thấy thư viện (ví dụ `lucide-react`) | Tắt server, chạy `npm install`, rồi `npm run dev` lại. |
| Cổng 3000 đang bị dùng | Tắt server cũ, hoặc chạy cổng khác: đặt `PORT=3001` trong `.env`. |

---

## Cấu trúc mã nguồn

```
server.ts                     Server Express: kết nối TikTok LIVE, đồng bộ overlay (SSE), ảnh nền, danh sách nhạc
src/
  App.tsx                     Chọn giữa bảng điều khiển và overlay (?view=overlay), co giãn overlay
  components/
    Dashboard.tsx             Bảng điều khiển
    LiveOverlay.tsx           Trang overlay cho OBS / LIVE Studio
    TempleOverlay916.tsx      Khung 9:16 (dùng chung cho Chùa và Nhà thờ)
    SeatingWing.tsx           Chỗ ngồi bồ đoàn (Chùa)
    ChurchSeating.tsx         Chỗ ngồi băng ghế (Nhà thờ)
    DevoteeFigure.tsx         Phật tử áo lam
    ChurchgoerFigure.tsx      Người đi lễ
    IncenseBurner.tsx         Bát hương
    VotiveCandles.tsx         Giá nến
    MusicSeekBar.tsx          Thanh tua nhạc
  data/
    modeTexts.ts              Câu chữ của từng giao diện
    templeThemes.ts           Mẫu chùa, quà, dữ liệu mẫu
  services/audioService.ts    Chuông, mõ, nhạc thiền, giọng đọc
public/
  music/                      Nhạc nền của bạn (không đưa lên Git)
  backgrounds/                Ảnh nền nhà thờ
```

Kiểm tra lỗi kiểu (TypeScript):

```bash
npm run lint
```

---

## Lưu ý

- Kết nối TikTok dùng thư viện **không chính thức** [`tiktok-live-connector`](https://github.com/zerodytrash/TikTok-Live-Connector). TikTok thay đổi hệ thống thì kết nối có thể tạm hỏng cho tới khi thư viện cập nhật.
- Chỉ dùng **ảnh và nhạc bạn có quyền sử dụng** khi phát live.
- Chế độ Auto tạo tên và quà giả – nên tắt khi live thật để không gây hiểu lầm cho người xem.
