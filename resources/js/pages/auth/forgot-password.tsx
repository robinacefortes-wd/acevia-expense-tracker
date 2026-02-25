import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

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
                                Forgot your password?
                            </h1>
                            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
                                No worries — enter your email and we'll send you a reset link.
                            </p>

                            {/* Status message */}
                            {status && (
                                <div
                                    className="mb-5 px-4 py-3 rounded-lg text-sm text-center font-medium"
                                    style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                                >
                                    {status}
                                </div>
                            )}

                            <Form {...email.form()} className="flex flex-col gap-4">
                                {({ processing, errors }) => (
                                    <>
                                        {/* Email */}
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium"
                                                style={{ color: '#d1d5db' }}
                                            >
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                                    style={{ color: '#6b7280' }}
                                                />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    autoComplete="off"
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

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity mt-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
                                                opacity: processing ? 0.7 : 1,
                                            }}
                                        >
                                            {processing && <Spinner />}
                                            Email password reset link
                                        </button>

                                        {/* Back to login */}
                                        <p className="text-center text-sm" style={{ color: '#6b7280' }}>
                                            Remember your password?{' '}
                                            <TextLink
                                                href={login()}
                                                className="font-medium"
                                                style={{ color: '#8151d9' }}
                                            >
                                                Log in
                                            </TextLink>
                                        </p>
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
                                {/* Lock icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>

                                <h2 className="text-white text-xl font-bold mb-3">Account Recovery</h2>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    We'll send a secure link to your email to reset your password.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 text-left">
                                    {[
                                        'Check your inbox',
                                        'Click the reset link',
                                        'Set a new password',
                                    ].map((item, i) => (
                                        <div key={item} className="flex items-center gap-2.5">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                            >
                                                {i + 1}
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