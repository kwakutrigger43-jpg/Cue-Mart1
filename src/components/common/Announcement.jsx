import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const Announcement = () => {
  const { settings } = useStore();

  if (!settings?.announcement) return null;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-orange-950 to-slate-950 text-orange-200 text-xs py-2 px-4 text-center font-bold tracking-wider uppercase border-b border-orange-900/40 flex items-center justify-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse hidden sm:inline" />
      <span>{settings.announcement}</span>
      <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse hidden sm:inline" />
    </div>
  );
};
