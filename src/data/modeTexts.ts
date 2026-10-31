import { TempleMode } from '../types';

export const CHURCH_BG_URL = '/backgrounds/nha-tho.png';

/**
 * Wording for each interface: Buddhist temple (chùa) or Catholic church (nhà thờ).
 * Used by the overlay and by the Dashboard (logs, prayers, gift announcements).
 */
export const MODE_TEXT = {
  chua: {
    label: '🛕 Chùa',
    title: '☸ THIỀN ĐƯỜNG TỊNH TÂM ☸',
    subtitle: 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật',
    attendIcon: '🧘',
    attending: 'đang thiền',
    lightUnit: 'nén tâm hương',
    guideChat: 'Chat bất kỳ vào bồ đoàn',
    guideLight: ['Gõ ', '"thắp hương"', ' dâng lễ'],
    guideGift: ['Tặng quà', ' vào Hòm'],
    boxTitle: '⛩️ HÒM CÔNG ĐỨC',
    boardTitle: '✦ BẢNG CÔNG ĐỨC ✦',
    waiting: 'Đang chờ thí chủ...',
    ticker: '☸ Thành tâm kính lễ Đức Bổn Sư Thích Ca Mâu Ni Phật ☸',
    cards: [
      { icon: '🕯️', coin: '1 COIN', label: 'Dâng hương' },
      { icon: '🪷', coin: '5 COINS', label: 'Lễ Phật' },
      { icon: '💐', coin: '10+ COIN', label: 'Hoa sen' },
    ],
    lightToastTitle: '🕯️ THÀNH TÂM DÂNG HƯƠNG 🕯️',
    lightToast: (name: string) => `${name} vừa dâng nén tâm hương kính Phật!`,
    giftToastTitle: '✨ CÔNG ĐỨC VÔ LƯỢNG ✨',
    giftToast: (name: string, gift: string, coins: number) =>
      `Thí chủ ${name} vừa cúng dường ${gift} (+${coins} xu) vào Hòm Công Đức!`,
    walkerName: 'Phật Tử Thành Tâm',
    giverName: 'Thí Chủ Hảo Tâm',
    walkerGiftPrayer: (gift: string) => `Dâng ${gift} cúng dường Tam Bảo`,
    defaultPrayer: 'Nam Mô A Di Đà Phật 🙏',
    joinPrayer: 'Nam Mô A Di Đà Phật',
    giftPrayer: 'Cúng dường Tam Bảo, phước báu vô lượng',
    giftTts: (name: string, gift: string) =>
      `Nam Mô A Di Đà Phật. Thí chủ ${name} vừa cúng dường ${gift} vào Hòm Công Đức.`,
    joinLog: (name: string) => `🧘 ${name} vừa vào Chánh Điện.`,
    simPrayers: [
      'Con xin thắp nén tâm hương cầu bình an',
      'Nam Mô A Di Đà Phật 🙏',
      'Cầu gia đạo bình an, sức khỏe dồi dào',
      'Thành tâm lễ Phật, cầu thi cử đỗ đạt',
      'Cầu bình an may mắn vạn sự như ý',
    ],
  },
  nhatho: {
    label: '⛪ Nhà thờ',
    title: '✝ THÁNH ĐƯỜNG BÌNH AN ✝',
    subtitle: 'Bình an của Chúa ở cùng anh chị em',
    attendIcon: '🙏',
    attending: 'đang dự lễ',
    lightUnit: 'ngọn nến',
    guideChat: 'Chat bất kỳ để vào ghế',
    guideLight: ['Chat để ', 'thắp nến', ' cầu nguyện'],
    guideGift: ['Tặng quà', ' dâng cúng'],
    boxTitle: '⛪ HÒM DÂNG CÚNG',
    boardTitle: '✦ BẢNG TRI ÂN ✦',
    waiting: 'Đang chờ anh chị em...',
    ticker: '✝ Xin Chúa chúc lành cho mọi người ✝',
    cards: [
      { icon: '🕯️', coin: '1 COIN', label: 'Thắp nến' },
      { icon: '🌹', coin: '5 COINS', label: 'Dâng hoa' },
      { icon: '🙏', coin: '10+ COIN', label: 'Dâng lễ' },
    ],
    lightToastTitle: '🕯️ THẮP NẾN CẦU NGUYỆN 🕯️',
    lightToast: (name: string) => `${name} vừa thắp nến cầu nguyện!`,
    giftToastTitle: '✨ TẠ ƠN CHÚA ✨',
    giftToast: (name: string, gift: string, coins: number) =>
      `${name} vừa dâng ${gift} (+${coins} xu). Xin Chúa chúc lành!`,
    walkerName: 'Người Tín Hữu',
    giverName: 'Người Tín Hữu',
    walkerGiftPrayer: (gift: string) => `Dâng ${gift} lên Chúa`,
    defaultPrayer: 'Lạy Chúa, xin thương xót chúng con 🙏',
    joinPrayer: 'Lạy Chúa, xin ban bình an',
    giftPrayer: 'Dâng lên Chúa với lòng biết ơn',
    giftTts: (name: string, gift: string) => `Tạ ơn Chúa. Xin Chúa chúc lành cho ${name} đã dâng ${gift}.`,
    joinLog: (name: string) => `🙏 ${name} vừa vào nhà thờ.`,
    simPrayers: [
      'Lạy Chúa, xin ban bình an cho gia đình con',
      'Lạy Mẹ Maria, xin cầu cho chúng con 🙏',
      'Xin Chúa ban sức khỏe cho cha mẹ con',
      'Tạ ơn Chúa vì mọi ơn lành',
      'Xin Chúa soi sáng cho con thi cử đỗ đạt',
    ],
    chiefPrayer: 'Lạy Chúa, xin ban bình an cho chúng con',
  },
} satisfies Record<TempleMode, object>;
