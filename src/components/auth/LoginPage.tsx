'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import {
  ShieldCheck,
  User,
  KeyRound,
  LogIn,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, loginWithGoogle } = useFinance();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!usernameOrEmail.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = loginWithCredentials(usernameOrEmail, password);
      setIsSubmitting(false);
      if (result.success) {
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleQuickAdminLogin = () => {
    setUsernameOrEmail('admin');
    setPassword('123');
    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const result = loginWithCredentials('admin', '123');
      setIsSubmitting(false);
      if (result.success) {
        setSuccessMsg('Đã đăng nhập thành công với quyền Admin!');
      }
    }, 300);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white">
      {/* Integrated App Logo & Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-rose-500 flex items-center justify-center shadow-md mx-auto">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Đăng Nhập F&amp;W Manager
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Quản lý Tài chính &amp; Đám cưới QH &amp; YN
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="space-y-5">
        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              TÊN ĐĂNG NHẬP / EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Tên đăng nhập hoặc email..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              MẬT KHẨU
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#090d16] hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Tài Khoản'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            HOẶC PHƯƠNG THỨC KHÁC
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Alternative Auth Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={loginWithGoogle}
            type="button"
            className="flex items-center justify-center space-x-2 py-3 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Google OAuth</span>
          </button>

          <button
            onClick={handleQuickAdminLogin}
            type="button"
            className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-slate-100 hover:bg-slate-200 border border-transparent rounded-2xl text-xs font-bold text-slate-700 transition-all active:scale-95"
          >
            <span>Dùng thử Demo (Admin)</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
