import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

const inputBaseStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#ffffff',
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(129,81,217,0.6)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,81,217,0.1)';
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.boxShadow = 'none';
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [phone, setPhone] = useState('+63 ');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val.startsWith('+63 ')) {
            setPhone('+63 ');
            return;
        }
        setPhone(val);
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== null && input.selectionStart <= 4) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Head title="Register" />

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
                            minHeight: '600px',
                        }}
                    >
                        {/* LEFT — Form Side */}
                        <div
                            className="flex-1 p-10 flex flex-col justify-center"
                            style={{ backgroundColor: '#141414' }}
                        >
                            {/* Logo */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <img 
                                        src="/acevia logo.png" 
                                        alt="Acevia Logo" 
                                        className="w-60 h-auto object-contain" 
                                    />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                                Create your account
                            </h1>
                            <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
                                Start managing your finances today
                            </p>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* First Name + Last Name */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="first_name" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                    First name
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                    <input
                                                        id="first_name"
                                                        type="text"
                                                        name="first_name"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="given-name"
                                                        placeholder="Juan"
                                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                        style={inputBaseStyle}
                                                        onFocus={handleFocus}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                <InputError message={errors.first_name} />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="last_name" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                    Last name
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                    <input
                                                        id="last_name"
                                                        type="text"
                                                        name="last_name"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="family-name"
                                                        placeholder="Dela Cruz"
                                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                        style={inputBaseStyle}
                                                        onFocus={handleFocus}
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                <InputError message={errors.last_name} />
                                            </div>
                                        </div>

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
                                                    tabIndex={3}
                                                    autoComplete="email"
                                                    placeholder="email@example.com"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={inputBaseStyle}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Phone */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="phone" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                Phone number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    tabIndex={4}
                                                    maxLength={14}
                                                    autoComplete="tel"
                                                    value={phone}
                                                    onChange={handlePhoneChange}
                                                    onKeyDown={handlePhoneKeyDown}
                                                    onClick={(e) => {
                                                        if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionStart < 4) {
                                                            e.currentTarget.setSelectionRange(4, 4);
                                                        }
                                                    }}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={inputBaseStyle}
                                                    onFocus={(e) => {
                                                        handleFocus(e);
                                                        setTimeout(() => {
                                                            if (e.target.value === '+63 ') {
                                                                e.target.setSelectionRange(4, 4);
                                                            }
                                                        }, 0);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            <InputError message={errors.phone} />
                                        </div>

                                        {/* Password */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="password" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    tabIndex={5}
                                                    autoComplete="new-password"
                                                    placeholder="Password"
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={inputBaseStyle}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
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
                                            <label htmlFor="password_confirmation" className="text-sm font-medium" style={{ color: '#d1d5db' }}>
                                                Confirm password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    name="password_confirmation"
                                                    required
                                                    tabIndex={6}
                                                    autoComplete="new-password"
                                                    placeholder="Confirm password"
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-all focus:outline-none"
                                                    style={inputBaseStyle}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
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
                                            tabIndex={7}
                                            data-test="register-user-button"
                                            className="w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer text-white flex items-center justify-center gap-2 transition-opacity mt-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
                                                opacity: processing ? 0.7 : 1,
                                            }}
                                        >
                                            {processing && <Spinner />}
                                            Create account
                                        </button>

                                        {/* Login link */}
                                        <p className="text-center text-sm" style={{ color: '#6b7280' }}>
                                            Already have an account?{' '}
                                            <TextLink href={login()} tabIndex={8} className="font-medium" style={{ color: '#8151d9' }}>
                                                Log in
                                            </TextLink>
                                        </p>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* RIGHT — Purple Panel (w-72 same as Login) */}
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
                                    Join thousands managing their finances smarter.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 text-left">
                                    {['Free to use', 'Secure & private', 'Real-time tracking'].map((item) => (
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