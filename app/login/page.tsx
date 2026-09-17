'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ merchantId: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.merchantId || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }

    // Get existing users from mock DB
    const existingUsers = JSON.parse(localStorage.getItem('vyapar_users') || '[]');
    
    // Find matching user
    const user = existingUsers.find((u: any) => 
      u.merchantId === formData.merchantId && u.password === formData.password
    );

    if (user) {
      // Log them in
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to dashboard
      router.push('/');
    } else {
      setError('Invalid Merchant ID or Password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Image src="/vyaparos-logo.png" alt="VyaparOS" width={180} height={50} priority />
        </div>
        
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your merchant intelligence dashboard</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
          <div className="auth-field">
            <label htmlFor="merchantId">Merchant ID (or Mobile Number)</label>
            <input 
              id="merchantId"
              type="text" 
              className="auth-input" 
              placeholder="Enter your registered ID"
              value={formData.merchantId}
              onChange={e => setFormData({...formData, merchantId: e.target.value})}
            />
          </div>
          
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="auth-input" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="auth-btn">Log In securely</button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link href="/signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
