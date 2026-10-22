import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { resetPassword } from '../../lib/supabaseAuth';
import { KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message || 'Unable to process password reset request.');
    }
  };

  const handleModalClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Reset Your Password" size="md">
      <div className="p-6">
        <div className="flex items-center gap-3 p-3 mb-5 bg-purple-50 text-purple-900 rounded-xl border border-purple-100">
          <KeyRound className="w-6 h-6 text-purple-600 shrink-0" />
          <p className="text-sm">
            Enter your registered email address and we'll send you instructions to recover or reset your account password.
          </p>
        </div>

        {successMessage ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Check Your Inbox</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">{successMessage}</p>
            <Button variant="primary" className="w-full mt-4" onClick={handleModalClose}>
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
