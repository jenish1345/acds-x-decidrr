import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-navy via-corporate-darkblue to-corporate-slate flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-sm mb-4">
            <span className="text-2xl font-bold text-corporate-navy">AC</span>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">ACDS</h1>
          <p className="text-gray-300 text-sm">Autonomous Company Diagnostic System</p>
        </div>

        <div className="bg-white rounded-sm shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Executive Access</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-enterprise pl-10"
                  placeholder="executive@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-enterprise pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Authorized personnel only. All access is monitored and logged.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2026 ACDS Enterprise Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
