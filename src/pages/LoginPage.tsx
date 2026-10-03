import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Shield, User as UserIcon, Lock, Mail, ArrowRight, Printer, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(email, password);
    if (res.success) {
      addToast(res.message, 'success');
      if (res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' || from.startsWith('/admin') ? '/' : from);
      }
    } else {
      setErrorMessage(res.message);
      addToast(res.message, 'error');
    }
  };

  const handleFillDemo = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@banten.com');
      setPassword('admin123');
      const res = login('admin@banten.com', 'admin123');
      if (res.success) {
        addToast(res.message, 'success');
        navigate('/admin');
      }
    } else {
      setEmail('user@banten.com');
      setPassword('user123');
      const res = login('user@banten.com', 'user123');
      if (res.success) {
        addToast(res.message, 'success');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Printer className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs text-slate-500">
            Banten Digital Printing · Percetakan Online
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            Pilihan Akun Demo (1-Klik Masuk)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="py-2.5 px-3 bg-white hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <UserIcon className="w-4 h-4 text-orange-600" />
              <span>Login User</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Login Admin</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            User: user@banten.com (user123) · Admin: admin@banten.com (admin123)
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Email:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer link to register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Belum memiliki akun pelanggan?{' '}
          <Link to="/register" className="text-orange-600 hover:text-orange-700 font-bold underline">
            Daftar Gratis Disini
          </Link>
        </div>
      </div>
    </div>
  );
};
