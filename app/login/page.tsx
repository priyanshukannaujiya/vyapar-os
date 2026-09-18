'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { translations, type Language } from '../../lib/translations';

type StoredUser = { merchantId: string; password: string; merchantName?: string };

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ merchantId: '', password: '' });
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('vyaparos_language') : null;
    return saved === 'hi' || saved === 'mr' ? saved : 'en';
  });
  const tr = (key: string) => translations[language][key as keyof typeof translations.en] || key;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.merchantId || !formData.password) {
      setError(tr('fillBoth'));
      return;
    }

    // Get existing users from mock DB
    const existingUsers = JSON.parse(localStorage.getItem('vyapar_users') || '[]');
    
    // Find matching user
    const user = (existingUsers as StoredUser[]).find((u) =>
      u.merchantId === formData.merchantId && u.password === formData.password
    );

    if (user) {
      // Log them in
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to dashboard
      router.push('/');
    } else {
      setError(tr('invalidCredentials'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Image src="/vyaparos-logo.png" alt="VyaparOS" width={180} height={50} priority />
        </div>
        
        <div className="auth-language"><label htmlFor="auth-language">{tr('translationLanguage')}</label><select id="auth-language" value={language} onChange={event => { const next = event.target.value as Language; setLanguage(next); localStorage.setItem('vyaparos_language', next); document.documentElement.lang = next; }}><option value="en">{tr('english')}</option><option value="hi">{tr('hindi')}</option><option value="mr">{tr('marathi')}</option></select></div>
        <h1 className="auth-title">{tr('welcomeBack')}</h1>
        <p className="auth-subtitle">{tr('loginSubtitle')}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          
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
              placeholder={tr('password')}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="auth-btn">{tr('loginSecurely')}</button>
        </form>
        
        <div className="auth-footer">
          {tr('noAccount')} <Link href="/signup">{tr('createOneHere')}</Link>
        </div>
      </div>
    </div>
  );
}
