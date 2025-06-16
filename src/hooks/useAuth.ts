'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TOKEN_KEY = 'tms_token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    setToken(storedToken);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`http://localhost:7265/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const { token, expiresAt } = await response.json();
      localStorage.setItem(TOKEN_KEY, token);
      setToken(token);
      router.push('/projects');
    } catch {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    router.push('/auth/login');
  };

  return { token, login, logout, isAuthenticated: !!token };
}
