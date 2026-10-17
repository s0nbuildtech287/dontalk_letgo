import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Footprints,
  Compass
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';

export function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, enterApp } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 250);
  };

  const handleGuestEnter = () => {
    setIsLoginModalOpen(false);
    enterApp(true); // enter as guest
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden select-none">
        {/* Top Header with Brand */}
        <div className="p-6 pb-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden drop-shadow-md shrink-0 border border-[#FF6B4A]/25">
              <img src="/logo.png" alt="LetGoo Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[var(--color-text-main)] flex items-center gap-1.5 leading-none">
                <span>Đăng nhập</span>
                <span className="text-[#FF6B4A]">LetGoo!</span>
              </h3>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                Đăng nhập để đồng bộ và lưu trữ lịch trình của bạn
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1.5">
              Tên tài khoản
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-10 pr-3.5 py-3 rounded-2xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-main)] block mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-xs pl-10 pr-10 py-3 rounded-2xl border border-[var(--color-border)] focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C69] hover:from-[#E85736] hover:to-[#FF6B4A] text-white font-black text-xs shadow-lg shadow-[#FF6B4A]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Footprints className="w-4 h-4 -rotate-12" />
              )}
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập vào LetGoo'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Guest button: Explore without login */}
            <button
              type="button"
              onClick={handleGuestEnter}
              className="w-full py-2.5 px-4 rounded-2xl bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tiếp tục với tư cách Khách xem thử</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
