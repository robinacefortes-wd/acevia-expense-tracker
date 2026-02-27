import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Head title="Reset password" />

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
                                Set a new password
                            </h1>
                            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
                                Your new password must be different from your previous one.
                            </p>

                            <Form
                                {...update.form()}
                                transform={(data) => ({ ...data, token, email })}
                                resetOnSuccess={['password', 'password_confirmation']}
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Email (readonly) */}
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium"
                                                style={{ color: '#d1d5db' }}
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                defaultValue={email}
                                                readOnly
                                                className="w-full px-4 py-2.5 rounded-lg text-sm"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    color: '#6b7280',
                                                    cursor: 'not-allowed',
                                                }}
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* New Password */}
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="password"
                                                className="text-sm font-medium"
                                                style={{ color: '#d1d5db' }}
                                            >
                                                New password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    autoComplete="new-password"
                                                    autoFocus
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none pr-10"
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

                                        {/* Confirm Password */}
                                        <div className="flex flex-col gap-1.5">
                                            <label
                                                htmlFor="password_confirmation"
                                                className="text-sm font-medium"
                                                style={{ color: '#d1d5db' }}
                                            >
                                                Confirm new password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    placeholder="Confirm new password"
                                                    className="w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none pr-10"
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
                                                    onClick={() => setShowConfirm(p => !p)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    style={{ color: '#6b7280' }}
                                                >
                                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-test="reset-password-button"
                                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 transition-opacity mt-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
                                                opacity: processing ? 0.7 : 1,
                                            }}
                                        >
                                            {processing && <Spinner />}
                                            Reset password
                                        </button>
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
                                    <Lock className="w-7 h-7 text-white" />
                                </div>

                                <h2 className="text-white text-xl font-bold mb-3">Create New Password</h2>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Choose a strong password to keep your account secure.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 text-left">
                                    {[
                                        'At least 8 characters',
                                        'Mix of letters & numbers',
                                        'Keep it memorable',
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