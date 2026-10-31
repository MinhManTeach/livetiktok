import { TempleTheme, GiftOption, Devotee } from '../types';

export const TEMPLE_THEMES: TempleTheme[] = [
  {
    id: 1,
    name: 'Mẫu 1: Chánh Điện Cổ Tự Truyền Thống',
    title: 'Đại Hùng Bảo Điện Cổ Tự',
    description: 'Tượng Phật Vàng Uy Nghiêm, Lư Hương Đồng Đại Điện, Thảm Đỏ Lễ Phật & Bàn Thờ Sơn Son Thếp Vàng',
    // High-resolution authentic Buddhist temple grand altar with golden Buddha statue
    bgUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85',
    haloColor: 'rgba(255, 215, 80, 0.9)',
  },
  {
    id: 2,
    name: 'Mẫu 2: Liên Hoa Tiên Cảnh Đêm Trăng',
    title: 'Liên Hoa Cực Lạc Tịnh Thổ',
    description: 'Hồ Sen Ánh Trăng Tịnh Độ, Tượng Phật Tỏa Ánh Thanh Quang Lưu Ly',
    bgUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=85',
    haloColor: 'rgba(140, 210, 255, 0.9)',
  },
  {
    id: 3,
    name: 'Mẫu 3: Tây Phương Cực Lạc Hoàng Kim',
    title: 'Tây Phương Kim Sắc Bảo Điện',
    description: 'Ánh Kim Quang Chói Lọi, Chư Phật Chư Bồ Tát Hiện Thân',
    bgUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
    haloColor: 'rgba(255, 200, 60, 0.95)',
  },
  {
    id: 4,
    name: 'Mẫu 4: Thiền Viện Trúc Lâm Thanh Tịnh',
    title: 'Trúc Lâm Yên Tử Tịnh Viện',
    description: 'Gỗ Lim Trầm Ấm, Không Gian Thiền Mộc Mạc, Tiếng Chuông Gió Suối Reo',
    bgUrl: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=85',
    haloColor: 'rgba(240, 220, 160, 0.85)',
  },
  {
    id: 5,
    name: 'Mẫu 5: Phong Cách Hoàng Kim Trang Nghiêm',
    title: 'Chánh Điện Hoàng Kim Cực Lạc',
    description: 'Kiến Trúc Điêu Khắc Rồng Vàng Cổ Kính, Bàn Thờ Khói Hương Nghi Ngút',
    bgUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85',
    haloColor: 'rgba(255, 185, 45, 0.92)',
  },
];

export const TIKTOK_GIFTS: GiftOption[] = [
  { id: 'rose', name: 'Hoa Hồng (Rose)', coins: 1, icon: '🌹' },
  { id: 'incense', name: 'Nén Tâm Hương', coins: 5, icon: '🕯️' },
  { id: 'lotus', name: 'Hoa Sen Vàng', coins: 10, icon: '🪷' },
  { id: 'mala', name: 'Tràng Hạt Bồ Đề', coins: 30, icon: '📿' },
  { id: 'bell', name: 'Chuông Đồng Chánh Điện', coins: 99, icon: '🔔' },
  { id: 'daisen', name: 'Đài Sen Lưu Ly', coins: 299, icon: '✨' },
  { id: 'buddha_gold', name: 'Tượng Phật Hoàng Kim', coins: 1000, icon: '👑' },
];

export const INITIAL_DEVOTEES: Devotee[] = [
  { id: '1', nickname: 'Mih Tuu (Chủ Lễ)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MihTuu', skin: 'phattu_ao_lam', prayer: 'nam mô a Di Đà Phật 🙏', incenseLit: true, merit: 199, timestamp: Date.now() - 120000 },
  { id: '2', nickname: 'Đế Chinvn', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DeChinvn', skin: 'su_thay', prayer: 'Cầu gia đình bình an, tai qua nạn khỏi', incenseLit: true, merit: 19, timestamp: Date.now() - 95000 },
  { id: '3', nickname: 'HungDat', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HungDat', skin: 'phattu_ao_lam', prayer: 'Nam Mô Quán Thế Âm Bồ Tát', incenseLit: true, merit: 9, timestamp: Date.now() - 80000 },
  { id: '4', nickname: 'Tôi nghèo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ToiNgheo', skin: 'su_co', prayer: 'Cầu cho cha mẹ mạnh khỏe bình an', incenseLit: true, merit: 7, timestamp: Date.now() - 70000 },
  { id: '5', nickname: 'Thiện Nhân', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThienNhan', skin: 'phattu_ao_lam', prayer: 'Nam Mô A Di Đà Phật', incenseLit: true, merit: 15, timestamp: Date.now() - 65000 },
  { id: '6', nickname: 'Minh Đạo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MinhDao', skin: 'su_thay', prayer: 'Nguyện đem công đức hồi hướng chúng sinh', incenseLit: true, merit: 25, timestamp: Date.now() - 60000 },
  { id: '7', nickname: 'Tâm Từ', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TamTu', skin: 'su_co', prayer: 'Cầu tài lộc vạn sự hanh thông', incenseLit: false, merit: 0, timestamp: Date.now() - 55000 },
  { id: '8', nickname: 'Thanh Hương', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ThanhHuong', skin: 'co_phuc', prayer: 'Sám hối nghiệp chướng thân tâm an lạc', incenseLit: true, merit: 5, timestamp: Date.now() - 50000 },
  { id: '9', nickname: 'Hoài Nam', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HoaiNam', skin: 'phattu_ao_lam', prayer: 'Nam Mô A Di Đà Phật', incenseLit: false, merit: 0, timestamp: Date.now() - 45000 },
  { id: '10', nickname: 'An Nhiên', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnNhien', skin: 'co_phuc', prayer: 'Cầu cho con thi đỗ bình an', incenseLit: true, merit: 10, timestamp: Date.now() - 40000 },
  { id: '11', nickname: 'Quang Huy', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuangHuy', skin: 'phattu_ao_lam', prayer: 'Nguyện gia đạo hòa thuận', incenseLit: false, merit: 0, timestamp: Date.now() - 35000 },
  { id: '12', nickname: 'Diệu Linh', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DieuLinh', skin: 'su_co', prayer: 'Thành tâm kính lễ Đức Phật Từ Bi', incenseLit: true, merit: 30, timestamp: Date.now() - 30000 },
  { id: '13', nickname: 'Ngọc Lan', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NgocLan', skin: 'phattu_ao_lam', prayer: 'Nam Mô A Di Đà Phật 🙏', incenseLit: true, merit: 5, timestamp: Date.now() - 25000 },
  { id: '14', nickname: 'Đức Anh', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DucAnh', skin: 'phattu_ao_lam', prayer: 'Cầu công việc thuận buồm xuôi gió', incenseLit: false, merit: 0, timestamp: Date.now() - 20000 },
  { id: '15', nickname: 'Phương Thảo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PhuongThao', skin: 'co_phuc', prayer: 'Tâm an vạn sự an', incenseLit: true, merit: 8, timestamp: Date.now() - 15000 },
  { id: '16', nickname: 'Tuấn Kiệt', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TuanKiet', skin: 'su_thay', prayer: 'Phật quang phổ chiếu', incenseLit: true, merit: 50, timestamp: Date.now() - 10000 },
];
