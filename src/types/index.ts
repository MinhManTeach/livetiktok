// Interface style: Buddhist temple or Catholic church
export type TempleMode = 'chua' | 'nhatho';

export type SkinType = 'su_thay' | 'su_co' | 'phattu_ao_lam' | 'co_phuc';

export interface Devotee {
  id: string;
  nickname: string;
  avatar?: string;
  skin: SkinType;
  prayer: string;
  incenseLit: boolean;
  merit: number;
  timestamp: number;
}

export interface MeritRecord {
  id: string;
  nickname: string;
  giftName: string;
  coins: number;
  prayer: string;
  timestamp: number;
}

export interface TempleTheme {
  id: number;
  name: string;
  title: string;
  description: string;
  bgUrl: string;
  haloColor: string;
}

export interface AudioSettings {
  pitch: number;
  speed: number;
  reverb: number;
  bpm: number;
  bgMusicEnabled: boolean;
  bgMusicFreq: number;
  woodenFishEnabled: boolean;
  autoChantEnabled: boolean;
  directAudioEnabled: boolean;
  chantText: string;
}

export interface GiftOption {
  id: string;
  name: string;
  coins: number;
  icon: string;
}

export interface ActionEffect {
  type: 'INCENSE' | 'MERIT_BOX' | 'BELL' | 'MO';
  nickname?: string;
  giftName?: string;
  coins?: number;
  message?: string;
  ttsText?: string;
  timestamp: number;
}

export interface TestStepResult {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  durationMs?: number;
  details?: string;
}

export type TikTokLiveEvent =
  | {
      type: 'status';
      state: 'connecting' | 'connected' | 'disconnected';
      uniqueId?: string;
      message?: string;
      timestamp: number;
    }
  | {
      type: 'chat' | 'gift' | 'like' | 'member' | 'follow' | 'share';
      uniqueId: string;
      nickname: string;
      avatar?: string;
      comment?: string;
      giftName?: string;
      repeatCount?: number;
      coins?: number;
      likeCount?: number;
      timestamp: number;
    };

// Snapshot of the Dashboard's temple state, mirrored to the OBS overlay (?view=overlay)
export interface OverlayState {
  devotees: Devotee[];
  maxSlots: number;
  incenseCount: number;
  meritTotal: number;
  meritList: MeritRecord[];
  currentTheme: TempleTheme;
  customBgUrl?: string;
  lastAction: ActionEffect | null;
  mode?: TempleMode;
}

// An audio file in public/music, listed by GET /api/music
export interface MusicTrack {
  name: string;
  url: string;
}
