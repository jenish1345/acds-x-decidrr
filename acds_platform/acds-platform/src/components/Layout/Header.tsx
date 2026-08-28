import React from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import type { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-corporate-navy rounded-sm flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">ACDS</h1>
                <p className="text-xs text-gray-500">Autonomous Company Diagnostic System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
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
