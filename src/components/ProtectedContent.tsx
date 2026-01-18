import { useState, useEffect } from 'react';
import { hashPassword } from '../utils/auth';
import PasswordGate from './PasswordGate';
import './ProtectedContent.css';

interface ProtectedContentProps {
  children: React.ReactNode;
  passwordHash: string;
  title?: string;
  message?: string;
}

export default function ProtectedContent({
  children,
  passwordHash,
  title,
  message
}: ProtectedContentProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated in this session
    const checkAuth = async () => {
      const storedPassword = sessionStorage.getItem('auth_token');
      if (storedPassword) {
        const storedHash = await hashPassword(storedPassword);
        if (storedHash === passwordHash) {
          setIsAuthenticated(true);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [passwordHash]);

  if (isChecking) {
    return (
      <div className="protected-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PasswordGate
        passwordHash={passwordHash}
        onSuccess={() => setIsAuthenticated(true)}
        title={title}
        message={message}
      />
    );
  }

  return <>{children}</>;
}
