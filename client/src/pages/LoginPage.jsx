import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LockKeyhole, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const headline = useMemo(
    () => (mode === 'login' ? 'Sign in to your workspace' : 'Create your admin account'),
    [mode]
  );

  const submit = async (event) => {
    event.preventDefault();

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back');
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
        toast.success('Account created');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden px-4 py-6 md:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-slate-950 px-8 py-10 text-white shadow-soft">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-accent/30 to-transparent" />
          <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                Production-grade RBAC dashboard
              </div>
              <h1 className="mt-6 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                Manage teams, roles, and permissions with precision.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/75">
                A modern admin system where access is resolved dynamically by user, team, role, and permissions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Dynamic access', 'Resolve permissions per team membership'],
                ['Modern UI', 'Glass surfaces and smooth motion'],
                ['Scalable', 'Reusable architecture from top to bottom']
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-[13px] font-semibold text-white">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-white/70">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-xl p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Access control</div>
                <h2 className="text-xl font-semibold text-text-primary">{headline}</h2>
              </div>
            </div>

            <div className="mt-6 flex rounded-2xl border border-border bg-gray-50 p-1 dark:bg-white/5">
              {['login', 'register'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${mode === option ? 'bg-surface text-text-primary shadow-sm' : 'text-text-muted'}`}
                >
                  {option === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={submit}>
              {mode === 'register' ? (
                <Input
                  label="Full name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              ) : null}
              <Input
                label="Email"
                type="email"
                placeholder="admin@company.com"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
              <Button type="submit" className="mt-2 w-full" size="lg" disabled={loading}>
                <LockKeyhole className="h-4 w-4" />
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
