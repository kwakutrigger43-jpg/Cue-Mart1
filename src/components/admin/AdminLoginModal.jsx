import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';

export const AdminLoginModal = () => {
  const { showAdminLogin, setShowAdminLogin, adminLogin, settings } = useStore();

  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (showAdminLogin) {
      setPin(['', '', '', '']);
      setError('');
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [showAdminLogin]);

  // Countdown timer for lockout
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  if (!showAdminLogin) return null;

  const handlePinChange = (index, value) => {
    // Only allow digits
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3) {
      const fullPin = [...newPin].join('');
      if (fullPin.length === 4) {
        setTimeout(() => submitPin(fullPin), 100);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') {
      const fullPin = pin.join('');
      if (fullPin.length === 4) submitPin(fullPin);
    }
  };

  const submitPin = (fullPin) => {
    if (isLocked) return;
    const success = adminLogin(fullPin);
    if (!success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30); // 30-second lockout
        setError('Too many failed attempts. Locked for 30 seconds.');
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining.`);
      }
    }
    // On success, the modal closes automatically via adminLogin → setShowAdminLogin(false)
  };

  const handleClose = () => {
    setShowAdminLogin(false);
    setPin(['', '', '', '']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-8 text-center">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo + Shield Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/assets/logo.png" alt="CueMart" className="h-10 w-auto object-contain" />
          </div>

          <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-orange-400" />
          </div>

          <h2 className="text-white font-extrabold text-xl">Admin Access</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Enter your 4-digit Admin PIN to continue
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">

          {/* PIN Input dots */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-4">
              {pin.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={inputRefs[index]}
                    type={showPin ? 'text' : 'password'}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLocked}
                    className={`w-14 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 outline-none transition-all
                      ${error
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : digit
                        ? 'border-orange-500 bg-orange-50 text-slate-900'
                        : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-orange-400 focus:bg-white'
                      }
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {/* Dot indicator below when hidden */}
                  {!showPin && digit && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-slate-900" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show/Hide PIN toggle */}
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="flex items-center gap-1.5 mx-auto text-[11px] text-slate-400 hover:text-slate-600 font-semibold transition-colors"
            >
              {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPin ? 'Hide PIN' : 'Show PIN'}</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Lockout Timer */}
          {isLocked && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Retry in {lockTimer}s</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => {
              const fullPin = pin.join('');
              if (fullPin.length === 4) submitPin(fullPin);
            }}
            disabled={pin.join('').length < 4 || isLocked}
            className={`w-full py-3.5 rounded-2xl text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
              pin.join('').length === 4 && !isLocked
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30 hover:scale-[1.01]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>

          {/* Hint for default PIN */}
          <p className="text-center text-[10px] text-slate-400 font-medium">
            Default PIN is <span className="font-bold text-slate-600">1234</span>. Change it in Admin → Settings.
          </p>

        </div>
      </div>
    </div>
  );
};
