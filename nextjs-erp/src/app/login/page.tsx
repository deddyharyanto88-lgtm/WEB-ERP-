'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [entity, setEntity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'id'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await signIn({ entity, username, password });
    setIsLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-gutter overflow-hidden">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="fixed top-gutter right-gutter z-50 hidden md:block">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-success font-label-sm text-label-sm">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          All Systems Operational
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-fixed opacity-20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-secondary-fixed opacity-20 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-[440px] z-10">
        <div className="flex flex-col items-center mb-section-gap">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-primary tracking-tight leading-none">Mini-ERP Pro</h1>
              <span className="font-label-sm text-label-sm text-on-secondary-container tracking-widest uppercase opacity-70">Infrastructure & Operations</span>
            </div>
          </div>
        </div>

        <section className="bg-surface border border-border rounded-[24px] p-8 login-card">
          <div className="mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Please enter your credentials to manage your entity.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="entity">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                Select Entity
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white border border-border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none outline-none"
                  id="entity"
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                >
                  <option disabled value="">Select Company / PT</option>
                  <option value="pt1">PT. BuildConstruct Indonesia</option>
                  <option value="pt2">PT. Logistics Global Perkasa</option>
                  <option value="pt3">PT. Infrastructure Solutions</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="username">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Username or Email
              </label>
              <input
                className="w-full bg-white border border-border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                id="username"
                placeholder="name@company.com"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="password">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Password
                </label>
                <a className="font-label-sm text-label-sm text-primary hover:underline transition-all" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-white border border-border rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-3 flex items-center text-outline hover:text-on-surface-variant transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'login'}</span>
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <a className="text-primary font-semibold hover:underline" href="#">Contact System Admin</a>
            </p>
            <div className="h-px w-full bg-border" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                <span className="font-label-sm text-label-sm">Secured Login</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">cloud</span>
                <span className="font-label-sm text-label-sm">Cloud Infrastructure</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex justify-center items-center gap-4">
          <div className="flex p-1 bg-surface-container border border-border rounded-full">
            <button
              className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${lang === 'en' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface/50'}`}
              onClick={() => setLang('en')}
              type="button"
            >
              EN
            </button>
            <button
              className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${lang === 'id' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface/50'}`}
              onClick={() => setLang('id')}
              type="button"
            >
              ID
            </button>
          </div>
          <div className="w-1.5 h-1.5 bg-border rounded-full" />
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </main>

      <div className="fixed bottom-gutter left-gutter hidden md:block">
        <p className="font-label-sm text-label-sm text-outline select-none">© 2024 Mini-ERP Pro Systems v4.2.1</p>
      </div>
    </div>
  );
}
