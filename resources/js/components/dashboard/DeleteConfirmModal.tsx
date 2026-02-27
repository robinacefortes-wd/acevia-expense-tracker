import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({ isOpen, title, description, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm rounded-2xl p-6 card-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}
        >
          <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} />
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold theme-text mb-1">{title}</h3>
        <p className="text-sm theme-text-secondary mb-6">{description}</p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium theme-text-secondary cursor-pointer hover:opacity-80 transition-opacity"
            style={{ border: '1px solid rgba(128,128,128,0.2)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#ef4444' }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;