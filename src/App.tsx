/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LiveOverlay } from './components/LiveOverlay';

export default function App() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'overlay'>('dashboard');

  useEffect(() => {
    // Check if opened with ?view=overlay (for OBS / TikTok LIVE Studio Browser Source)
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'overlay' || window.location.pathname === '/overlay.html') {
      setViewMode('overlay');
    }
  }, []);

  // The overlay is designed at 540x960; scale it to fill whatever size the browser source is (e.g. 1080x1920)
  const [overlayScale, setOverlayScale] = useState(1);
  useEffect(() => {
    if (viewMode !== 'overlay') return;
    const fit = () => setOverlayScale(Math.min(window.innerWidth / 540, window.innerHeight / 960));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [viewMode]);

  if (viewMode === 'overlay') {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        <div
          className="relative shrink-0"
          style={{ width: 540, height: 960, transform: `scale(${overlayScale})`, transformOrigin: 'center' }}
        >
          <LiveOverlay />
          {/* Invisible on stream; appears on hover when the overlay is opened in a normal browser */}
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              window.history.pushState({}, '', url.toString());
              setViewMode('dashboard');
            }}
            className="absolute top-2 left-2 z-50 bg-black/80 text-amber-300 border border-amber-500/50 text-[10px] px-2 py-1 rounded font-bold hover:bg-black opacity-0 hover:opacity-100 transition-opacity"
          >
            ← Bảng Điều Khiển
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
