import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Camera, User, Mail, Phone, Trash2,
    Activity, Calendar, Flame, CheckCircle, AlertCircle, Lock, ArrowLeft
} from 'lucide-react';
import { useState, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar?: string;
    created_at: string;
}

interface Stats {
    totalTransactions: number;
    longestNoSpendStreak: number;
    memberSince: string;
}

const Profile = () => {
    const { user, stats } = usePage<{ user: UserData; stats: Stats }>().props;

    const stripPrefix = (phone: string) => {
        if (!phone) return '';
        return phone.replace(/^\+63\s?/, '').slice(0, 10);
    };

    const [profileForm, setProfileForm] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: stripPrefix(user.phone || ''),
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );
    const [avatarLoading, setAvatarLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setProfileForm({ ...profileForm, phone: val });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setAvatarLoading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        router.post('/profile/avatar', formData, {
            onSuccess: () => setAvatarPreview(objectUrl),
            onFinish: () => setAvatarLoading(false),
        });
    };

    const handleProfileSave = () => {
        setProfileLoading(true);
        setProfileSuccess('');
        setProfileError('');
        router.post('/profile/update', {
            ...profileForm,
            email: user.email,
            phone: `+63 ${profileForm.phone}`,
        }, {
            onSuccess: () => setProfileSuccess('Profile updated successfully!'),
            onError: () => setProfileError('Failed to update profile.'),
            onFinish: () => setProfileLoading(false),
        });
    };

    const handleDeleteAccount = () => {
        setDeleteError('');
        router.post('/profile/delete', { password: deletePassword }, {
            onError: () => setDeleteError('Incorrect password. Please try again.'),
        });
    };

    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

    return (
        <div className="flex min-h-screen theme-bg">
            <Sidebar />

            <main className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ marginLeft: '72px' }}>

                {/* Background orbs */}
                <div style={{
                    position: 'absolute', width: '420px', height: '420px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,81,217,0.25) 0%, transparent 70%)',
                    filter: 'blur(70px)', top: '5%', left: '-100px', pointerEvents: 'none', zIndex: 0,
                }} />
                <div style={{
                    position: 'absolute', width: '380px', height: '380px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,81,217,0.2) 0%, transparent 70%)',
                    filter: 'blur(70px)', bottom: '5%', right: '-80px', pointerEvents: 'none', zIndex: 0,
                }} />
                <div style={{
                    position: 'absolute', width: '320px', height: '320px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,235,215,0.18) 0%, transparent 70%)',
                    filter: 'blur(60px)', top: '50%', right: '12%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0,
                }} />

                <div className="w-full max-w-4xl px-8" style={{ position: 'relative', zIndex: 1 }}>

                    {/* Header */}
                    <button
                        onClick={() => router.visit('/dashboard')}
                        className="flex items-center gap-2 theme-text-secondary hover:theme-text mb-4 transition-colors cursor-pointer"
                        >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </button>

                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
                        <h1 className="flex items-center gap-2 text-3xl font-bold theme-text">Profile</h1>
                        <p className="flex items-center gap-2 theme-text-secondary text-sm mt-1">Manage your account information</p>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="card-glass rounded-2xl flex overflow-hidden"
                    >
                        {/* ── Left: Avatar + Form ── */}
                        <div className="flex-1 p-8 flex flex-col gap-6">

                            {/* Avatar row */}
                            <div className="flex items-center gap-5">
                                <div className="relative flex-shrink-0">
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
                                        style={{ backgroundColor: avatarPreview ? 'transparent' : '#8151d9' }}
                                    >
                                        {avatarPreview
                                            ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            : <span className="text-white font-bold text-3xl">{initials || 'A'}</span>
                                        }
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={avatarLoading}
                                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow cursor-pointer"
                                        style={{ background: 'linear-gradient(135deg, #8151d9, #a178e8)' }}
                                    >
                                        <Camera className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </div>
                                <div>
                                    <p className="font-bold theme-text text-lg">{user.first_name} {user.last_name}</p>
                                    <p className="theme-text-secondary text-sm">{user.email}</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs mt-1 font-medium hover:opacity-80 cursor-pointer"
                                        style={{ color: '#8151d9' }}
                                    >
                                        Change photo
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', backgroundColor: 'rgba(128,128,128,0.12)' }} />

                            {/* Personal Info heading */}
                            <h2 className="text-sm font-semibold theme-text flex items-center gap-2 -mb-3">
                                <User className="w-4 h-4" style={{ color: '#8151d9' }} />
                                Personal Information
                            </h2>

                            {/* First + Last */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium theme-text-secondary">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-text-secondary" style={{ opacity: 0.5 }} />
                                        <input
                                            type="text"
                                            value={profileForm.first_name}
                                            onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all theme-input theme-text cursor-text"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium theme-text-secondary">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-text-secondary" style={{ opacity: 0.5 }} />
                                        <input
                                            type="text"
                                            value={profileForm.last_name}
                                            onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all theme-input theme-text cursor-text"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium theme-text-secondary flex items-center gap-2">
                                    Email Address
                                    <span className="px-1.5 py-0.5 rounded text-xs theme-text-secondary" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>read-only</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-text-secondary" style={{ opacity: 0.4 }} />
                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none theme-text-secondary"
                                        style={{
                                            backgroundColor: 'rgba(128,128,128,0.06)',
                                            border: '1px solid rgba(128,128,128,0.12)',
                                            cursor: 'not-allowed',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium theme-text-secondary">Phone Number</label>
                                <div className="flex rounded-lg overflow-hidden transition-all" style={{ border: '1px solid rgba(128,128,128,0.2)' }}>
                                    <div className="flex items-center gap-1.5 px-3 flex-shrink-0 theme-text-secondary" style={{ backgroundColor: 'rgba(128,128,128,0.08)' }}>
                                        <Phone className="w-2.5 h-3.5" />
                                        <span className="text-sm font-medium">+63</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={handlePhoneChange}
                                        maxLength={10}
                                        placeholder="9XXXXXXXXX"
                                        className="flex-1 px-3 py-2.5 text-sm focus:outline-none theme-text theme-input cursor-text"
                                        onFocus={(e) => {
                                            e.currentTarget.parentElement!.style.borderColor = 'rgba(129,81,217,0.6)';
                                            e.currentTarget.parentElement!.style.boxShadow = '0 0 0 3px rgba(129,81,217,0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.parentElement!.style.borderColor = 'rgba(128,128,128,0.2)';
                                            e.currentTarget.parentElement!.style.boxShadow = 'none';
                                        }}
                                    />
                                    
                                </div>
                            </div>

                            {/* Save */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleProfileSave}
                                    disabled={profileLoading}
                                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                                    style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)', opacity: profileLoading ? 0.7 : 1 }}
                                >
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                {profileSuccess && (
                                    <span className="flex items-center gap-1 text-xs" style={{ color: '#10b981' }}>
                                        <CheckCircle className="w-3.5 h-3.5" /> {profileSuccess}
                                    </span>
                                )}
                                {profileError && (
                                    <span className="flex items-center gap-1 text-xs" style={{ color: '#ef4444' }}>
                                        <AlertCircle className="w-3.5 h-3.5" /> {profileError}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Vertical divider */}
                        <div style={{ width: '1px', backgroundColor: 'rgba(128,128,128,0.12)' }} />

                        {/* ── Right: Stats + Danger Zone ── */}
                        <div className="w-60 flex-shrink-0 flex flex-col p-8 gap-4">

                            <h2 className="text-xs font-semibold uppercase tracking-widest theme-text-secondary">Account Stats</h2>

                            {[
                                { icon: Calendar, label: 'Member Since', value: stats.memberSince, color: '#8151d9', bg: 'rgba(129,81,217,0.08)' },
                                { icon: Activity, label: 'Transactions', value: stats.totalTransactions.toString(), color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                                { icon: Flame,    label: 'Best Streak',  value: `${stats.longestNoSpendStreak} days`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: stat.bg }}>
                                    <stat.icon className="w-4 h-4 flex-shrink-0" style={{ color: stat.color }} />
                                    <div>
                                        <p className="text-xs theme-text-secondary">{stat.label}</p>
                                        <p className="text-sm font-bold theme-text">{stat.value}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex-1" />
                            <div style={{ height: '1px', backgroundColor: 'rgba(128,128,128,0.12)' }} />

                            {/* Danger Zone */}
                            <div>
                                <h2 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#ef4444' }}>
                                    <Trash2 className="w-4 h-4" />
                                    Danger Zone
                                </h2>
                                <p className="text-xs theme-text-secondary leading-relaxed mb-3">
                                    Permanently delete your account and all data. This cannot be undone.
                                </p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 cursor-pointer"
                                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    onClick={() => setShowDeleteModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm rounded-2xl p-6 card-glass"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
                            <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} />
                        </div>
                        <h3 className="text-lg font-bold theme-text mb-1">Delete Account</h3>
                        <p className="text-sm theme-text-secondary mb-5">
                            This will permanently delete your account and all data. Enter your password to confirm.
                        </p>
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="text-xs font-medium theme-text-secondary">Your Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-text-secondary" style={{ opacity: 0.5 }} />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all theme-input theme-text cursor-text"
                                />
                            </div>
                            {deleteError && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{deleteError}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium theme-text-secondary cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ border: '1px solid rgba(128,128,128,0.2)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#ef4444' }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile;