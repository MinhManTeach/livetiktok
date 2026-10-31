import React, { useEffect, useState } from 'react';

interface MusicSeekBarProps {
  audio: HTMLAudioElement;
}

const fmt = (sec: number) => {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
};

/**
 * Seek bar for the background mp3: position slider, elapsed/total time, ±1 minute buttons.
 * Subscribes to the audio element itself so only this bar re-renders while music plays.
 */
export const MusicSeekBar: React.FC<MusicSeekBarProps> = ({ audio }) => {
  const [time, setTime] = useState(audio.currentTime);
  const [duration, setDuration] = useState(Number.isFinite(audio.duration) ? audio.duration : 0);

  useEffect(() => {
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('seeked', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('emptied', onMeta);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('seeked', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('emptied', onMeta);
    };
  }, [audio]);

  const seek = (t: number) => {
    if (!duration) return;
    audio.currentTime = Math.min(Math.max(0, t), duration - 0.5);
    setTime(audio.currentTime);
  };

  const ready = duration > 0;
  const btn =
    'px-1.5 py-0.5 rounded border border-amber-600/50 bg-[#2b160b] text-amber-200 text-[10.5px] font-bold hover:bg-[#3d1f0e] disabled:opacity-40';

  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-200/80">
      <button className={btn} disabled={!ready} onClick={() => seek(time - 60)} title="Lùi 1 phút">
        ⏪ 1p
      </button>
      <input
        type="range"
        min={0}
        max={ready ? Math.floor(duration) : 0}
        step={1}
        value={Math.floor(time)}
        disabled={!ready}
        onChange={(e) => seek(Number(e.target.value))}
        className="flex-1 min-w-0 accent-amber-500"
        title="Kéo để tua nhạc"
      />
      <button className={btn} disabled={!ready} onClick={() => seek(time + 60)} title="Tới 1 phút">
        1p ⏩
      </button>
      <span className="font-mono text-amber-300 whitespace-nowrap">
        {ready ? `${fmt(time)} / ${fmt(duration)}` : 'Chưa phát'}
      </span>
    </div>
  );
};
