import React from 'react';
import { User, LogOut, Bell, ArrowRight } from 'lucide-react';
import type { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">DECIDR</h1>
                <p className="text-xs text-gray-500 font-medium">ORGANIZATION MODE</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="http://localhost:3000" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors flex items-center gap-2">
              Switch to Personal Mode <ArrowRight size={16} />
            </a>
            
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-status-critical rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role.toUpperCase()}</p>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-sm flex items-center justify-center">
                <User size={18} className="text-gray-600" />
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
