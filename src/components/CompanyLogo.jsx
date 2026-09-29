import React from 'react';
import { Sparkles } from 'lucide-react';

export default function CompanyLogo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 select-none">
      <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-amber-400 shadow-xl shadow-amber-200/50 transform hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-2 rounded-2xl border-2 border-yellow-100/50 flex items-center justify-center">
          <Sparkles className="w-14 h-14 text-white drop-shadow-md" />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-wider text-gray-900 uppercase">
          Brand Name
        </h1>
        <p className="text-sm font-medium text-amber-600 tracking-widest uppercase mt-1">
          Company Store
        </p>
      </div>
    </div>
  );
}
