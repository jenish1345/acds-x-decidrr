import React from 'react';
import { LogOut, ArrowRight } from 'lucide-react';
import type { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#E5322D] rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1f2937] tracking-tight">DECIDR</h1>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Organization Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              className="inline-flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f5f5f5] px-3.5 py-2 text-sm font-medium text-[#374151] hover:bg-[#efefef]"
            >
              Switch to Personal Mode
              <ArrowRight size={16} />
            </a>

            <button
              onClick={onLogout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
