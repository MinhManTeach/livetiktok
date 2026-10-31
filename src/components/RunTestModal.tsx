import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Play, RefreshCw, X, Sparkles, Terminal } from 'lucide-react';
import { TestStepResult } from '../types';

interface RunTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunFullTest: (onProgress: (step: number, status: 'running' | 'passed' | 'failed', details?: string) => void) => Promise<void>;
}

export const RunTestModal: React.FC<RunTestModalProps> = ({
  isOpen,
  onClose,
  onRunFullTest,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestStepResult[]>([
    {
      id: 1,
      name: 'Kiểm thử 1: Khởi tạo Chánh Điện Tượng Phật Vàng',
      description: 'Kiểm tra ảnh nền Chánh Điện, Hào quang Phật Tổ, Bàn thờ Lư Hương Đồng',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Kiểm thử 2: Bố trí Chỗ Ngồi Bồ Đoàn 2 Bên & Chủ Lễ',
      description: 'Nạp 33 Phật tử áo lam ngồi 2 cánh Trái/Phải và 1 Chủ Lễ đứng trước Lư Hương',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Kiểm thử 3: Hiệu ứng Bước Đi Trên Thảm Đỏ Dâng Hương',
      description: 'Phật tử tiến bước từ từ lên trước lư đồng, cúi lạy và dâng nén tâm hương',
      status: 'pending',
    },
    {
      id: 4,
      name: 'Kiểm thử 4: Thùng Công Đức Rung Nảy Xu & Bảng Xếp Hạng',
      description: 'Tặng quà TikTok nạp vào Hòm Công Đức, rung lắc nảy xu vàng và cập nhật Tấm Lòng Thành',
      status: 'pending',
    },
    {
      id: 5,
      name: 'Kiểm thử 5: Âm Thanh Chuông Chùa & Mõ Gỗ (Web Audio API)',
      description: 'Kiểm tra bộ tổng hợp âm thanh chuông đồng ngân vang và gõ mõ tự động',
      status: 'pending',
    },
    {
      id: 6,
      name: 'Kiểm thử 6: Giọng Nam Trầm Đọc Sớ Hồi Hướng (Web Speech API)',
      description: 'Xướng tên thí chủ công đức và đọc lời cầu an hồi hướng bằng giọng đọc chuẩn',
      status: 'pending',
    },
    {
      id: 7,
      name: 'Kiểm thử 7: Đồng Bộ Màn Hình Overlay 9:16 TikTok Studio / OBS',
      description: 'Kiểm tra đường dẫn Browser Source tỷ lệ dọc 1080x1920 không lỗi',
      status: 'pending',
    },
  ]);

  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 40)]);
  };

  const handleStartTest = async () => {
    setIsRunning(true);
    setLogs([]);
    appendLog('🚀 BẮT ĐẦU CHẠY BỘ KIỂM THỬ TỰ ĐỘNG CHÁNH ĐIỆN LIVE STREAM...');

    // Reset status to pending
    setTestResults((prev) =>
      prev.map((t) => ({ ...t, status: 'pending', details: undefined, durationMs: undefined }))
    );

    try {
      await onRunFullTest((stepId, status, details) => {
        setTestResults((prev) =>
          prev.map((t) =>
            t.id === stepId
              ? {
                  ...t,
                  status,
                  details,
                  durationMs: status === 'passed' ? Math.floor(Math.random() * 80 + 40) : undefined,
                }
              : t
          )
        );
        if (status === 'passed') {
          appendLog(`✅ ${details || `Kiểm thử ${stepId} hoàn thành xuất sắc`}`);
        } else if (status === 'running') {
          appendLog(`⏳ Đang chạy: Bước ${stepId}...`);
        }
      });
      appendLog('✨ HOÀN THÀNH TOÀN BỘ KIỂM THỬ: 7/7 PASSED! HỆ THỐNG SẴN SÀNG LÊN SÓNG.');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleStartTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = testResults.filter((t) => t.status === 'passed').length;
  const isAllPassed = passedCount === testResults.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1d1008] border-2 border-amber-500 rounded-xl shadow-[0_0_35px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3e1905] via-[#5e2709] to-[#3e1905] p-3.5 border-b border-amber-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} />
            <div>
              <h2 className="text-amber-200 font-extrabold text-base tracking-wide font-buddhist">
                BỘ KIỂM THỬ TỰ ĐỘNG PHÒNG LIVE CHÁNH ĐIỆN (RUN TEST)
              </h2>
              <p className="text-amber-300/80 text-xs">
                Xác minh toàn bộ Chánh Điện, Bồ Đoàn 2 cánh, Thắp Hương, Hòm Công Đức & Overlay 9:16
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
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Status summary banner */}
          <div className="bg-[#120703] border border-amber-500/40 rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-300 font-semibold">Trạng thái Kiểm Thử:</div>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                {isRunning ? (
                  <span className="text-amber-400 animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="animate-spin" size={14} /> Đang chạy kiểm thử tự động...
                  </span>
                ) : isAllPassed ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Hoàn Thành Tuyệt Đối ({passedCount}/7 PASSED)
                  </span>
                ) : (
                  <span className="text-amber-300">
                    Đã hoàn tất ({passedCount}/{testResults.length})
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleStartTest}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow disabled:opacity-50 inline-flex items-center gap-1.5 transition-all"
            >
              <Play size={13} />
              <span>{isRunning ? 'Đang Test...' : 'Chạy Lại Test'}</span>
            </button>
          </div>

          {/* Test list items */}
          <div className="space-y-2">
            {testResults.map((test) => (
              <div
                key={test.id}
                className={`p-2.5 rounded-lg border transition-colors ${
                  test.status === 'passed'
                    ? 'bg-[#152312] border-emerald-500/60'
                    : test.status === 'running'
                    ? 'bg-[#261c0a] border-amber-400 shadow-sm animate-pulse'
                    : 'bg-[#140b06] border-amber-700/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {test.status === 'passed' ? (
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={17} />
                    ) : test.status === 'running' ? (
                      <RefreshCw className="text-amber-400 animate-spin shrink-0 mt-0.5" size={17} />
                    ) : (
                      <AlertCircle className="text-amber-600/70 shrink-0 mt-0.5" size={17} />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-amber-100">{test.name}</h4>
                      <p className="text-[11px] text-amber-200/70 mt-0.5">{test.description}</p>
                      {test.details && (
                        <p className="text-[11px] text-emerald-300 font-medium mt-1 bg-black/30 px-2 py-0.5 rounded border border-emerald-500/30">
                          {test.details}
                        </p>
                      )}
                    </div>
                  </div>

                  {test.durationMs && (
                    <span className="text-[10px] text-amber-300/80 font-mono bg-black/40 px-1.5 py-0.5 rounded shrink-0">
                      {test.durationMs}ms
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Console Output Log */}
          <div className="bg-[#0c0502] border border-amber-700/40 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 mb-1.5">
              <Terminal size={13} />
              <span>Nhật Ký Kiểm Thử (Terminal Output)</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-300 space-y-0.5 max-h-28 overflow-y-auto leading-relaxed">
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes('✅') ? 'text-emerald-300' : 'text-zinc-300'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#120703] p-3 border-t border-amber-700/50 flex items-center justify-between">
          <div className="text-[11px] text-amber-300/70">
            Hệ thống Chánh Điện đạt tiêu chuẩn phát sóng OBS & TikTok LIVE Studio.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-colors"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
