import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, X, XCircle } from 'lucide-react';
import { useToast } from '@/components/dashboard/ToastContext';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl pointer-events-auto"
                        style={{
                            background: 'rgba(20, 20, 20, 0.97)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            minWidth: '260px',
                            maxWidth: '360px',
                        }}
                    >
                        {toast.type === 'success'
                            ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                            : <XCircle    className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                        }
                        <p className="text-sm font-medium flex-1" style={{ color: '#f1f5f9' }}>
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;