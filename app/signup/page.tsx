'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ merchantName: '', merchantId: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.merchantName || !formData.merchantId || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // Get existing users from mock DB
    const existingUsers = JSON.parse(localStorage.getItem('vyapar_users') || '[]');
    
    // Check if ID already exists
    if (existingUsers.some((u: any) => u.merchantId === formData.merchantId)) {
      setError('Merchant ID already exists. Please log in.');
      return;
    }

    // Create new user
    const newUser = {
      merchantName: formData.merchantName,
      merchantId: formData.merchantId,
      password: formData.password, // In a real app, never store passwords in plain text!
    };

    // Save to mock DB
    localStorage.setItem('vyapar_users', JSON.stringify([...existingUsers, newUser]));
    
    // Log them in immediately
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Redirect to dashboard
    router.push('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Image src="/vyaparos-logo.png" alt="VyaparOS" width={180} height={50} priority />
        </div>
        
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join VyaparOS for advanced merchant intelligence</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="merchantName">Business / Merchant Name</label>
            <input 
              id="merchantName"
              type="text" 
              className="auth-input" 
              placeholder="e.g. Rahul Electronics"
              value={formData.merchantName}
              onChange={e => setFormData({...formData, merchantName: e.target.value})}
            />
          </div>
          
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
              placeholder="Create a strong password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="auth-btn">Create Account</button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link href="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
