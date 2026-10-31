/**
 * Audio synthesis service using Web Audio API and Web Speech API
 * No external MP3 files required! Runs 100% in browser and dev server.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private woodenFishInterval: number | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private reverbSend: AudioNode | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Thỉnh Chuông Chùa Đồng (Buddhist Bronze Bell synthesis with 5 rich overtones)
   */
  public playTempleBell(volume = 0.45): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // Frequencies for authentic bronze bell harmonics: fundamental + sub-harmonic + hum + tierce + quint + nominal
      const partials = [
        { f: 261.63, g: 0.45, decay: 5.2 }, // Middle C fundamental
        { f: 523.25, g: 0.35, decay: 4.8 }, // Octave
        { f: 659.25, g: 0.22, decay: 4.0 }, // Major third
        { f: 784.88, g: 0.25, decay: 3.5 }, // Fifth
        { f: 1046.5, g: 0.15, decay: 2.8 }, // High octave
        { f: 1567.98, g: 0.08, decay: 1.8 }, // Shimmer
      ];

      partials.forEach(({ f, g, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        // Slight frequency detuning for rich metallic vibration
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

        gain.gain.setValueAtTime(g * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Short white noise for the stick-on-wood knock
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      this.noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noiseBuffer;
  }

  // Temple hall echo: convolver with a generated ~1.6s decaying-noise impulse response
  private getReverbSend(ctx: AudioContext): AudioNode {
    if (!this.reverbSend) {
      const len = Math.floor(ctx.sampleRate * 1.6);
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
      const conv = ctx.createConvolver();
      conv.buffer = ir;
      const wet = ctx.createGain();
      wet.gain.value = 0.22;
      conv.connect(wet);
      wet.connect(ctx.destination);
      this.reverbSend = conv;
    }
    return this.reverbSend;
  }

  /**
   * Tiếng Gõ Mõ Gỗ (Wooden Fish) - mõ lớn chánh điện: trầm, ấm, có tiếng vang
   * Knock (band-passed noise) + hollow body thump + 3 decaying wood resonances.
   */
  public playWoodenFish(volume = 0.6): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const v = volume * (0.92 + Math.random() * 0.16); // human variation between strikes

      const out = ctx.createGain();
      out.connect(ctx.destination);
      out.connect(this.getReverbSend(ctx));

      // 1. Knock: very short band-passed noise burst
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = 1400;
      band.Q.value = 1.2;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(v * 0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
      noise.connect(band);
      band.connect(noiseGain);
      noiseGain.connect(out);
      noise.start(now);
      noise.stop(now + 0.03);

      // 2. Hollow body thump
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(190 * 1.15, now);
      body.frequency.exponentialRampToValueAtTime(190, now + 0.03);
      bodyGain.gain.setValueAtTime(v * 0.5, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      body.connect(bodyGain);
      bodyGain.connect(out);
      body.start(now);
      body.stop(now + 0.08);

      // 3. Wood resonances [Hz, gain, decay s] with a tiny pitch drop
      const detune = 1 + (Math.random() - 0.5) * 0.01;
      const modes: [number, number, number][] = [
        [390, 1.0, 0.24],
        [905, 0.45, 0.13],
        [1630, 0.18, 0.07],
      ];
      modes.forEach(([f, g, decay]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f * detune * 1.03, now);
        osc.frequency.exponentialRampToValueAtTime(f * detune, now + 0.02);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(v * g * 0.55, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + decay + 0.02);
      });
    } catch {
      // Audio policy
    }
  }

  /**
   * Tiếng Xu Vàng Rơi Vào Thùng Công Đức (Gold Coins Clinking)
   */
  public playCoinSound(volume = 0.5): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [1975.53, 2637.02, 3135.96]; // B6, E7, G7 metallic sparkles

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(volume * 0.4, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {
      // Audio policy
    }
  }

  /**
   * Bật/Tắt Nhạc Thiền Tần Số Tĩnh Tâm 432Hz / 528Hz
   */
  public toggleAmbientDrone(freq = 432, onStateChange?: (playing: boolean) => void): boolean {
    const ctx = this.getAudioContext();
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch {
        // Ignored
      }
      this.droneOsc = null;
      this.droneGain = null;
      if (onStateChange) onStateChange(false);
      return false;
    }

    try {
      const now = ctx.currentTime;
      this.droneOsc = ctx.createOscillator();
      this.droneGain = ctx.createGain();

      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(freq / 2, now); // Sub-octave for soothing depth

      // Gentle filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.08, now + 1.5);

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc.start();
      if (onStateChange) onStateChange(true);
      return true;
    } catch {
      if (onStateChange) onStateChange(false);
      return false;
    }
  }

  public isAmbientPlaying(): boolean {
    return this.droneOsc !== null;
  }

  /**
   * Đặt vòng lặp Tiếng Mõ Tự Động theo BPM
   */
  public setWoodenFishLoop(enabled: boolean, bpm = 46): void {
    if (this.woodenFishInterval) {
      clearInterval(this.woodenFishInterval);
      this.woodenFishInterval = null;
    }
    if (enabled && bpm > 0) {
      const ms = Math.max(250, (60 / bpm) * 1000);
      this.woodenFishInterval = window.setInterval(() => {
        this.playWoodenFish(0.5);
      }, ms);
    }
  }

  /**
   * Giọng Đọc Sớ Cầu An & Hồi Hướng Công Đức (Web Speech API)
   */
  public speakChant(text: string, pitchVal = -18, speedVal = -20): void {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'vi-VN';

      // Map pitch (-30 to +20) to Web Speech API pitch (0.4 to 1.6)
      const mappedPitch = Math.max(0.4, Math.min(1.5, 1 + pitchVal / 38));
      // Map speed (-50 to +50) to Web Speech API rate (0.6 to 1.4)
      const mappedRate = Math.max(0.65, Math.min(1.35, 1 + speedVal / 95));

      utter.pitch = mappedPitch;
      utter.rate = mappedRate;

      // Prefer Vietnamese voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('an'));
      if (viVoice) {
        utter.voice = viVoice;
      }

      this.playTempleBell(0.35);
      window.speechSynthesis.speak(utter);
    } catch {
      // Speech synthesis error
    }
  }

  public stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Stop every loop and sound this instance owns
  public dispose(): void {
    this.setWoodenFishLoop(false);
    this.stopSpeech();
    this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.droneOsc = null;
    this.droneGain = null;
    this.noiseBuffer = null;
    this.reverbSend = null;
  }
}

export const audioService = new AudioService();

// When this file is hot-updated (e.g. tweaking sounds during a live), the old instance is replaced;
// stop its loops so they don't keep playing on stream with no way to turn them off.
import.meta.hot?.dispose(() => audioService.dispose());
