import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, Delete } from 'lucide-react';

const MiniCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (!expression) return;
    try {
      const [left, operator] = expression.trim().split(' ');
      const leftNum = parseFloat(left);
      const rightNum = parseFloat(display);
      let result = 0;
      if (operator === '+') result = leftNum + rightNum;
      else if (operator === '-') result = leftNum - rightNum;
      else if (operator === '×') result = leftNum * rightNum;
      else if (operator === '÷') result = rightNum !== 0 ? leftNum / rightNum : 0;
      const formatted = parseFloat(result.toFixed(10)).toString();
      setDisplay(formatted);
      setExpression('');
      setWaitingForOperand(true);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handlePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const buttons = [
    { label: 'AC', action: handleClear, style: 'function' },
    { label: '+/-', action: handleToggleSign, style: 'function' },
    { label: '%', action: handlePercent, style: 'function' },
    { label: '÷', action: () => handleOperator('÷'), style: 'operator' },
    { label: '7', action: () => handleNumber('7'), style: 'number' },
    { label: '8', action: () => handleNumber('8'), style: 'number' },
    { label: '9', action: () => handleNumber('9'), style: 'number' },
    { label: '×', action: () => handleOperator('×'), style: 'operator' },
    { label: '4', action: () => handleNumber('4'), style: 'number' },
    { label: '5', action: () => handleNumber('5'), style: 'number' },
    { label: '6', action: () => handleNumber('6'), style: 'number' },
    { label: '-', action: () => handleOperator('-'), style: 'operator' },
    { label: '1', action: () => handleNumber('1'), style: 'number' },
    { label: '2', action: () => handleNumber('2'), style: 'number' },
    { label: '3', action: () => handleNumber('3'), style: 'number' },
    { label: '+', action: () => handleOperator('+'), style: 'operator' },
    { label: '0', action: () => handleNumber('0'), style: 'number wide' },
    { label: '.', action: handleDecimal, style: 'number' },
    { label: '=', action: handleEquals, style: 'operator' },
  ];

  const getButtonStyle = (style: string) => {
    const base = 'flex items-center justify-center rounded-xl font-semibold text-sm transition-all active:scale-95 cursor-pointer select-none';
    if (style.includes('wide')) return `${base} col-span-2`;
    return base;
  };

  const getButtonColors = (style: string) => {
    if (style.includes('operator')) {
      return {
        background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
        color: '#ffffff',
      };
    }
    if (style === 'function') {
      return {
        backgroundColor: 'rgba(129, 81, 217, 0.15)',
        color: '#a178e8',
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: '#e2e8f0',
    };
  };

  return (
    <>
      {/* Calculator Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-48 right-8 z-50 w-72 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 15, 20, 0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(129, 81, 217, 0.25)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'rgba(129, 81, 217, 0.15)' }}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" style={{ color: '#8151d9' }} />
                <span className="text-sm font-semibold" style={{ color: '#a178e8' }}>
                  Calculator
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Display */}
            <div className="px-4 pt-4 pb-2">
              {/* Expression */}
              <div className="text-right text-xs mb-1 h-4" style={{ color: 'rgba(161, 120, 232, 0.6)' }}>
                {expression}
              </div>
              {/* Main display */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackspace}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <Delete className="w-4 h-4 text-gray-500" />
                </button>
                <div
                  className="text-right font-bold tracking-tight flex-1 ml-2 overflow-hidden"
                  style={{
                    color: '#f1f5f9',
                    fontSize: display.length > 10 ? '1.25rem' : display.length > 7 ? '1.5rem' : '2rem',
                    lineHeight: 1.1,
                  }}
                >
                  {display}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2 p-4">
              {buttons.map((btn, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.92 }}
                  onClick={btn.action}
                  className={getButtonStyle(btn.style)}
                  style={{
                    ...getButtonColors(btn.style),
                    height: '52px',
                  }}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calculator Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #a178e8 0%, #8151d9 100%)'
            : 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
        }}
      >
        <Calculator className="w-7 h-7 text-white" />
      </motion.button>
    </>
  );
};

export default MiniCalculator;