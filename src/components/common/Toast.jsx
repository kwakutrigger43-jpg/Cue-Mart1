import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-800">
      <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
      <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
    </div>
  );
};
