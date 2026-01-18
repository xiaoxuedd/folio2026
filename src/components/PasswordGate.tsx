import { useState } from 'react';
import { verifyPassword } from '../utils/auth';
import './PasswordGate.css';

interface PasswordGateProps {
  passwordHash: string;
  onSuccess: () => void;
  title?: string;
  message?: string;
}

export default function PasswordGate({
  passwordHash,
  onSuccess,
  title = "Protected Content",
  message = "This content is password protected. Please enter the password to continue."
}: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isValid = await verifyPassword(password, passwordHash);

      if (isValid) {
        // Store auth in session storage (will persist for the browser session)
        sessionStorage.setItem('auth_token', password);
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-gate">
      <div className="password-gate-content">
        <div className="password-gate-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoFocus
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn" disabled={isLoading || !password}>
            {isLoading ? 'Verifying...' : 'Unlock Content'}
          </button>
        </form>
      </div>
    </div>
  );
}
