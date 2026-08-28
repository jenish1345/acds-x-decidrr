import React, { useState } from 'react';
import { Building2, Mail, User, Lock, ArrowRight } from 'lucide-react';

interface SignupViewProps {
  onSignup: (data: SignupData) => void;
}

export interface SignupData {
  companyName: string;
  industry: string;
  companySize: string;
  name: string;
  email: string;
  password: string;
}

export const SignupView: React.FC<SignupViewProps> = ({ onSignup }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    companyName: '',
    industry: '',
    companySize: '',
    name: '',
    email: '',
    password: ''
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Manufacturing',
    'Retail & E-commerce',
    'Professional Services',
    'Education',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      onSignup(formData);
    }
  };

  const updateField = (field: keyof SignupData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corporate-navy via-corporate-darkblue to-corporate-slate flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-sm mb-4">
            <span className="text-2xl font-bold text-corporate-navy">AC</span>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Start Your Free Trial
          </h1>
          <p className="text-gray-300 text-sm">
            14 days free • No credit card required • Cancel anytime
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-white text-corporate-navy' : 'bg-gray-600 text-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm text-white">Company</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-600" />
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-white text-corporate-navy' : 'bg-gray-600 text-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm text-white">Account</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-sm shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Tell us about your company
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      className="input-enterprise pl-10"
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="input-enterprise"
                    required
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => updateField('companySize', e.target.value)}
                    className="input-enterprise"
                    required
                  >
                    <option value="">Select company size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Create your account
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="input-enterprise pl-10"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="input-enterprise pl-10"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="input-enterprise pl-10"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                  <p className="text-xs text-gray-700">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-corporate-navy hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-corporate-navy hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="btn-primary ml-auto flex items-center space-x-2"
              >
                <span>{step === 2 ? 'Start Free Trial' : 'Continue'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{' '}
            <a href="#" className="text-white hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
