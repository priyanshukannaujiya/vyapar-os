'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { translations, type Language } from '../../lib/translations';

type StoredUser = { merchantName: string; merchantId: string; password: string };

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ merchantName: '', merchantId: '', password: '' });
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  
  useEffect(() => {
    const saved = localStorage.getItem('vyaparos_language');
    if (saved === 'hi' || saved === 'mr') {
      setLanguage(saved);
    }
  }, []);

  const tr = (key: string) => translations[language][key as keyof typeof translations.en] || key;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.merchantName || !formData.merchantId || !formData.password) {
      setError(tr('fillAll'));
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantName: formData.merchantName,
          merchantId: formData.merchantId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // Log them in immediately locally for the UI state
      localStorage.setItem('currentUser', JSON.stringify(data.merchant));
      
      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      setError('An error occurred during signup');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Image src="/vyaparos-logo.png" alt="VyaparOS" width={180} height={50} priority />
        </div>
        
        <div className="auth-language"><label htmlFor="auth-language">{tr('translationLanguage')}</label><select id="auth-language" value={language} onChange={event => { const next = event.target.value as Language; setLanguage(next); localStorage.setItem('vyaparos_language', next); document.documentElement.lang = next; }}><option value="en">{tr('english')}</option><option value="hi">{tr('hindi')}</option><option value="mr">{tr('marathi')}</option></select></div>
        <h1 className="auth-title">{tr('createAccount')}</h1>
        <p className="auth-subtitle">{tr('signupSubtitle')}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="merchantName">{tr('businessName')}</label>
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
            <label htmlFor="merchantId">{tr('merchantId')}</label>
            <input 
              id="merchantId"
              type="text" 
              className="auth-input" 
              placeholder={tr('registeredId')}
              value={formData.merchantId}
              onChange={e => setFormData({...formData, merchantId: e.target.value})}
            />
          </div>
          
          <div className="auth-field">
            <label htmlFor="password">{tr('password')}</label>
            <input 
              id="password"
              type="password" 
              className="auth-input" 
              placeholder={tr('strongPassword')}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="auth-btn">{tr('createAccountButton')}</button>
        </form>
        
        <div className="auth-footer">
          {tr('alreadyAccount')} <Link href="/login">{tr('loginHere')}</Link>
        </div>
      </div>
    </div>
  );
}
