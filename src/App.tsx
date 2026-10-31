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

  if (viewMode === 'overlay') {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-[540px] max-h-[960px] aspect-[9/16] relative">
          <LiveOverlay />
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              window.history.pushState({}, '', url.toString());
              setViewMode('dashboard');
            }}
            className="absolute top-2 left-2 z-50 bg-black/80 text-amber-300 border border-amber-500/50 text-[10px] px-2 py-1 rounded font-bold hover:bg-black"
          >
            ← Bảng Điều Khiển
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
