'use client';

import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { WeddingBetrothalGift } from '@/lib/weddingTypes';
import { Plus, CheckSquare, Square, Trash2 } from 'lucide-react';

interface WeddingGiftsTabProps {
  onOpenGiftModal: (giftToEdit?: WeddingBetrothalGift) => void;
}

export const WeddingGiftsTab: React.FC<WeddingGiftsTabProps> = ({ onOpenGiftModal }) => {
  const { gifts, updateGift, deleteGift } = useWedding();

  const preparedCount = gifts.filter((g) => g.is_prepared).length;

  const togglePrepared = (gift: WeddingBetrothalGift) => {
    updateGift(gift.id, { is_prepared: !gift.is_prepared });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>6 Mâm Quả Lễ Vật</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200 shrink-0">
              {preparedCount}/{gifts.length} xong
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block">
            Checklist chuẩn bị mâm quả theo kế hoạch của bạn
          </p>
        </div>

        <button
          onClick={() => onOpenGiftModal()}
          className="flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Mâm Quả</span>
        </button>
      </div>

      {/* Gifts Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gifts.map((g, idx) => (
          <div
            key={g.id}
            className={`bg-white rounded-2xl p-4.5 border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
              g.is_prepared ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 font-black text-xs flex items-center justify-center shrink-0 border border-pink-200">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{g.gift_name}</h3>
                    <p className="text-xs text-slate-500">Chuẩn bị bởi: <strong className="text-slate-700">{g.prepared_by}</strong></p>
                  </div>
                </div>

                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {g.quantity} mâm
                </span>
              </div>

              {g.note && <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-3">{g.note}</p>}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => togglePrepared(g)}
                className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  g.is_prepared
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {g.is_prepared ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>{g.is_prepared ? 'Đã chuẩn bị' : 'Chưa xong'}</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onOpenGiftModal(g)}
                  className="text-xs text-slate-600 hover:text-pink-600 font-medium px-2 py-1.5 rounded hover:bg-slate-100"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteGift(g.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
