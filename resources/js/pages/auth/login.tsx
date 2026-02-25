import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />

            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{ backgroundColor: '#0a0a0a' }}
            >
                {/* Background glow */}
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(129, 81, 217, 0.12) 0%, transparent 70%)',
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative w-full max-w-3xl"
                >
                    {/* Split Card */}
                    <div
                        className="rounded-2xl overflow-hidden flex"
                        style={{
                            border: '1px solid rgba(255,255,255,0.07)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                            minHeight: '520px',
                        }}
                    >
                        {/* LEFT — Form Side */}
                        <div
                            className="flex-1 p-10 flex flex-col justify-center"
                            style={{ backgroundColor: '#141414' }}
                        >
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <img 
                                        src="/acevia logo.png" 
                                        alt="Acevia Logo" 
                                        className="w-60 h-auto object-contain" 
                                    />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                                Welcome back
                            </h1>
                            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
                                Log in to your Acevia account
                            </p>

                            {/* Status */}
                            {status && (
                                <div
                                    className="mb-5 px-4 py-3 rounded-lg text-sm text-center font-medium"
                                    style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                                >
                                    {status}
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Email */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="email" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="email@example.com"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={{
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        color: '#ffffff',
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(129,81,217,0.6)';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,81,217,0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="password" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                    Password
                                                </label>
                                                {canResetPassword && (
                                                    <TextLink href={request()} tabIndex={5} className="text-xs" style={{ color: '#8151d9' }}>
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={{
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        color: '#ffffff',
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(129,81,217,0.6)';
                                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,81,217,0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(p => !p)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    style={{ color: '#6b7280' }}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember me */}
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                id="remember"
                                                name="remember"
                                                type="checkbox"
                                                tabIndex={3}
                                                className="w-4 h-4 rounded cursor-pointer"
                                                style={{ accentColor: '#8151d9' }}
                                            />
                                            <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: '#9ca3af' }}>
                                                Remember me
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity mt-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
                                                opacity: processing ? 0.7 : 1,
                                            }}
                                        >
                                            {processing && <Spinner />}
                                            Log in
                                        </button>

                                        {/* Register link */}
                                        {canRegister && (
                                            <p className="text-center text-sm" style={{ color: '#6b7280' }}>
                                                Don't have an account?{' '}
                                                <TextLink href={register()} tabIndex={5} className="font-medium" style={{ color: '#8151d9' }}>
                                                    Sign up
                                                </TextLink>
                                            </p>
                                        )}
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* RIGHT — Purple Panel */}
                        <div
                            className="w-72 flex-shrink-0 flex flex-col items-center justify-center p-10 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(160deg, #8151d9 0%, #6a3ec4 60%, #4f2d9e 100%)',
                            }}
                        >
                            {/* Decorative circles */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                            <div className="absolute top-1/3 right-6 w-24 h-24 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Your personal finance tracker. Smart, simple, and secure.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 text-left">
                                    {['Track expenses', 'Manage budgets', 'Monitor savings'].map((item) => (
                                        <div key={item} className="flex items-center gap-2.5">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                            >
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-5 text-center text-xs" style={{ color: '#4b5563' }}>
                        © {new Date().getFullYear()} Acevia Expense Tracker. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </>
    );
}