'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SimulationAssistant from '../components/SimulationAssistant';
import {
  AlertTriangle, ArrowUpRight, BarChart3, Bell, Bot, Check, ChevronRight,
  CircleDollarSign, ClipboardCheck, Clock3, Home as HomeIcon, IndianRupee, Layers3,
  Menu, MessageCircle, PackageSearch, Play, QrCode, RotateCcw, Send,
  Smartphone, Volume2, MessageSquareText,
  Settings, ShieldCheck, Sparkles, Target, TrendingDown, TrendingUp,
  CreditCard, Mic, Users, ScanLine,
  WalletCards, X, Zap, LogOut, HelpCircle,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dict: Record<string, any> = {
  en: {
    greeting: 'Good afternoon',
    subhead: 'Your shop generates the signals. VyaparOS turns them into decisions.',
    todayCheckIn: 'TODAY\'S STORE CHECK-IN',
    salesHealthy: 'Sales are healthy. Keep an eye on the afternoon lull and chocolate stock.',
    nextReview: 'Next review',
    actionsReady: 'actions ready',
    viewPlan: 'View today\'s plan',
    vyaparosAi: 'VYAPAROS AI',
    businessUnderstood: 'Your business, understood.',
    thingsAttention: 'things need your attention',
    nextBestAction: 'NEXT BEST ACTION',
    teaCombo: 'Tea + Chocolate Combo',
    reviewApprove: 'Review & approve',
    askDost: 'Ask VyaparDost',
    quickActions: 'QUICK ACTIONS',
    getThingsDone: 'Get things done',
    receivePayment: 'Receive payment',
    createQr: 'Create QR',
    scanShelf: 'Scan shelf',
    addKhata: 'Add khata',
    sendReminder: 'Send reminder',
    askAi: 'Ask AI',
    whatNeedsAttention: 'WHAT NEEDS ATTENTION',
    fiveThings: 'Five things need your attention',
    viewAllAlerts: 'View all alerts'
  },
  hi: {
    greeting: 'शुभ दोपहर',
    subhead: 'आपकी दुकान सिग्नल बनाती है। VyaparOS उन्हें फैसलों में बदलता है।',
    todayCheckIn: 'आज का स्टोर चेक-इन',
    salesHealthy: 'बिक्री अच्छी है। दोपहर की मंदी और चॉकलेट स्टॉक पर नज़र रखें।',
    nextReview: 'अगली समीक्षा',
    actionsReady: 'कार्रवाई तैयार',
    viewPlan: 'आज का प्लान देखें',
    vyaparosAi: 'व्यापार ओएस एआई',
    businessUnderstood: 'आपका व्यापार, समझा गया।',
    thingsAttention: 'चीज़ों पर ध्यान देने की ज़रूरत है',
    nextBestAction: 'अगली सबसे अच्छी कार्रवाई',
    teaCombo: 'चाय + चॉकलेट कॉम्बो',
    reviewApprove: 'समीक्षा करें और मंज़ूरी दें',
    askDost: 'VyaparDost से पूछें',
    quickActions: 'त्वरित कार्रवाई',
    getThingsDone: 'काम पूरा करें',
    receivePayment: 'भुगतान प्राप्त करें',
    createQr: 'क्यूआर बनाएं',
    scanShelf: 'शेल्फ स्कैन करें',
    addKhata: 'खाता जोड़ें',
    sendReminder: 'रिमाइंडर भेजें',
    askAi: 'AI से पूछें',
    whatNeedsAttention: 'किन चीज़ों पर ध्यान देने की ज़रूरत है',
    fiveThings: 'पांच चीज़ों पर ध्यान देने की ज़रूरत है',
    viewAllAlerts: 'सभी अलर्ट देखें'
  },
  mr: {
    greeting: 'शुभ दुपार',
    subhead: 'तुमचे दुकान सिग्नल तयार करते. VyaparOS त्याचे निर्णयात रूपांतर करते.',
    todayCheckIn: 'आजचे स्टोअर चेक-इन',
    salesHealthy: 'विक्री चांगली आहे. दुपारची मंदी आणि चॉकलेट स्टॉककडे लक्ष ठेवा.',
    nextReview: 'पुढील पुनरावलोकन',
    actionsReady: 'कृती तयार',
    viewPlan: 'आजचा प्लॅन पहा',
    vyaparosAi: 'व्यापार ओएस एआय',
    businessUnderstood: 'तुमचा व्यवसाय, समजून घेतला.',
    thingsAttention: 'गोष्टींवर लक्ष देण्याची आवश्यकता आहे',
    nextBestAction: 'पुढची सर्वोत्तम कृती',
    teaCombo: 'चहा + चॉकलेट कॉम्बो',
    reviewApprove: 'पुनरावलोकन करा आणि मंजूर करा',
    askDost: 'VyaparDost ला विचारा',
    quickActions: 'त्वरित कृती',
    getThingsDone: 'कामे पूर्ण करा',
    receivePayment: 'पेमेंट स्वीकारा',
    createQr: 'क्यूआर तयार करा',
    scanShelf: 'शेल्फ स्कॅन करा',
    addKhata: 'खाता जोडा',
    sendReminder: 'रिमाइंडर पाठवा',
    askAi: 'AI ला विचारा',
    whatNeedsAttention: 'कोणत्या गोष्टींवर लक्ष देण्याची आवश्यकता आहे',
    fiveThings: 'पाच गोष्टींवर लक्ष देण्याची आवश्यकता आहे',
    viewAllAlerts: 'सर्व अलर्ट पहा'
  }
};

type ScenarioStep = 'idle' | 'analyzing' | 'ready' | 'approved' | 'executed' | 'measured';

const simSteps = [
  { title: "1. Data Sources", desc: "Real-time data ingested from POS, QR, and Inventory." },
  { title: "2. Data Ingestion & Processing Layer", desc: "Data is cleaned and unified for the AI." },
  { title: "3. Firebase Data Layer", desc: "Securely storing and syncing the merchant context." },
  { title: "4. Merchant AI Brain (VyaparDost)", desc: "The core brain wakes up to analyze the new context." },
  { title: "5. Specialized AI Agents", desc: "ProfitPilot & ShelfSense identify low stock and margin drops." },
  { title: "6. UPI MDR Intelligence", desc: "VyaparPay Guard evaluates payment costs for recommendations." },
  { title: "7. Decision Engine", desc: "AI recommends a combo offer and checks Policy Engine." },
  { title: "8. Action Engine", desc: "Turning the decision into WhatsApp campaigns and Soundbox alerts." },
  { title: "9. Trusted Execution Ledger", desc: "The executed action is securely logged with a hash." },
  { title: "10. Feedback & Learning Loop", desc: "Monitoring outcomes to improve future recommendations." }
];
const navItems = [
  { label: 'Dashboard', icon: HomeIcon }, { label: 'VyaparDost', icon: Bot },
  { label: 'Growth', icon: TrendingUp }, { label: 'Inventory', icon: PackageSearch },
  { label: 'Finance', icon: WalletCards }, { label: 'Profit', icon: IndianRupee },
  { label: 'Risk', icon: ShieldCheck }, { label: 'Action Center', icon: Zap, badge: '3' },
  { label: 'Trusted Ledger', icon: ClipboardCheck },
];

const alerts = [
  { title: 'Afternoon footfall is down 41%', copy: 'Demand is softer than your usual baseline.', tone: 'coral', icon: TrendingDown, action: 'Recover sales' },
  { title: 'Chocolate is moving slowly', copy: '42 packs have had low movement for 18 days.', tone: 'amber', icon: PackageSearch, action: 'View ShelfSense' },
  { title: '₹13,500 cash gap projected', copy: 'Supplier obligations exceed available cash in 3 days.', tone: 'blue', icon: CircleDollarSign, action: 'View Cashflow' },
  { title: '11 UPI transactions qualify', copy: 'Estimated payment cost could affect your campaign margin.', tone: 'green', icon: IndianRupee, action: 'View payment impact' },
];

const recentPayments = [
  { customer: 'Rohan', amount: '₹3,200', method: 'UPI', time: '2:42 PM' },
  { customer: 'Amit', amount: '₹850', method: 'UPI', time: '2:36 PM' },
  { customer: 'Priya', amount: '₹4,100', method: 'QR', time: '2:31 PM' },
];

const aiActivity = [
  ['09:12', 'ShelfSense detected low milk stock'], ['11:40', 'ProfitPilot identified margin opportunity'],
  ['14:32', 'VyaparPulse detected afternoon sales drop'], ['14:35', 'VyaparDost generated recommendation'],
  ['14:36', 'Merchant approval requested'],
];

export default function Home() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [scenario, setScenario] = useState<ScenarioStep>('idle');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Namaste! I found 3 connected business issues. Let\'s turn them into your next best action.' }
  ]);
  const [simulationStep, setSimulationStep] = useState(0);
  const [language, setLanguage] = useState<'en'|'hi'|'mr'>('en');
  const [runTour, setRunTour] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const t = dict[language];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    if (!localStorage.getItem('vyaparos_tour_completed')) {
      setRunTour(true);
    }

    const user = localStorage.getItem('currentUser');
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));

    const savedState = localStorage.getItem('vyaparos_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.activeNav) setActiveNav(parsed.activeNav);
        if (parsed.scenario) setScenario(parsed.scenario);
        if (parsed.simulationStep !== undefined) setSimulationStep(parsed.simulationStep);
        if (parsed.chatHistory) setChatHistory(parsed.chatHistory);
        if (parsed.theme) {
          setTheme(parsed.theme);
          document.body.classList.toggle('dark', parsed.theme === 'dark');
        }
        if (parsed.language) setLanguage(parsed.language);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
  }, [router]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('vyaparos_state', JSON.stringify({ activeNav, scenario, simulationStep, chatHistory, theme, language }));
      document.body.classList.toggle('dark', theme === 'dark');
    }
  }, [activeNav, scenario, simulationStep, chatHistory, theme, language, isMounted]);

  const isRunning = scenario === 'analyzing';
  const hasRecommendation = simulationStep >= 7 || ['ready', 'approved', 'executed', 'measured'].includes(scenario);
  const isApproved = simulationStep >= 8 || ['approved', 'executed', 'measured'].includes(scenario);
  const isExecuted = simulationStep >= 8 || ['executed', 'measured'].includes(scenario);

  function runScenario() { setSimulationStep(1); }
  function approveAction() { setScenario('approved'); window.setTimeout(() => setScenario('executed'), 1200); window.setTimeout(() => setScenario('measured'), 2800); }
  function resetDemo() { 
    setScenario('idle'); setSimulationStep(0); setQuery(''); setAssistantOpen(false); setActiveModal(null); 
    localStorage.removeItem('vyaparos_state');
    setChatHistory([{ sender: 'bot', text: 'Namaste! I found 3 connected business issues. Let\'s turn them into your next best action.' }]);
  }
  function askVyaparDost() { setAssistantOpen(true); setQuery('Aaj kya karna chahiye?'); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAction(label: string, data?: any) {
    if (!label) return;
    if (['Prev', 'Next', 'Finish'].includes(label) || label.includes('Demo')) return;
    
    if (label.includes('details') || label === 'Payments' || label.includes('insights')) {
      setActiveModal('kpi');
      setModalData(label);
    } else if (label.includes('Alert') || label.includes('View') || label === 'Needs review') {
      setActiveModal('alert');
      setModalData(label);
    } else if (label.includes('payment details')) {
      setActiveModal('receipt');
      setModalData(data || label);
    } else if (label === 'Review & approve' || label === 'Action ready for review') {
      setActiveModal('approval');
    } else if (label === 'Receive payment') {
      setActiveModal('numpad');
    } else if (label === 'Create QR') {
      setActiveModal('qrcode');
    } else if (label === 'Scan shelf') {
      setActiveModal('camera');
    } else if (label === 'WhatsApp message' || label === 'Send reminder') {
      setActiveModal('whatsapp');
    } else if (label === 'Soundbox announcement') {
      setActiveModal('soundbox');
    } else if (label === 'Data sources') {
      setActiveModal('datasources');
    } else {
      setActiveModal('generic');
      setModalData(label);
    }
  }

  function openPayment(customer: string) {
    handleAction(`${customer} payment details`, customer);
  }

  function handleChatSubmit() {
    if (!query.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setQuery('');
    setAssistantOpen(true);
    // Simulate AI response
    window.setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'bot', text: 'Based on these signals, afternoon footfall is 41% below baseline, chocolate inventory has low movement, and a 15% discount would reduce contribution. I recommend a Tea + Chocolate combo.' }]);
      setScenario('ready'); 
      setActiveNav('Action Center');
    }, 1500);
  }

  if (!isMounted || !currentUser) return <div style={{ minHeight: '100vh', background: 'var(--bg)' }} />;

  return (
    <main className={`app-shell ${simulationStep > 0 ? 'sim-mode-active' : ''}`} onClick={event => { const button = (event.target as HTMLElement).closest('button'); if (button && !button.disabled && !button.classList.contains('close-btn') && !button.classList.contains('icon-button') && !button.closest('.modal-dialog') && !button.closest('.side-drawer') && !button.closest('.settings-panel') && !button.closest('.module-placeholder') && !button.closest('.sim-controller') && !button.closest('.tour-overlay-wrapper')) handleAction(button.textContent?.trim() || 'Action'); }}>
      <aside className={`sidebar ${showMobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup"><div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}><div style={{ position: 'relative', width: 145, height: 40, overflow: 'hidden', marginLeft: -4 }}><Image src="/vyaparos-logo.png" alt="VyaparOS" fill priority style={{ objectFit: 'cover', objectPosition: 'center' }} /></div><small style={{ fontSize: '9px', color: '#8b99a8', letterSpacing: '0.45px', marginTop: '-4px' }}>Merchant intelligence</small></div><button className="mobile-close" onClick={() => setShowMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="demo-pill"><span className="pulse-dot" /> DEMO MODE <span className="demo-sim">Simulation</span></div>
        <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">WORKSPACE</p>{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); setShowMobileNav(false); }}><Icon size={18} /><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</nav>
        <div className="sidebar-bottom"><div className={`sidebar-trust ${simulationStep === 3 ? 'sim-active' : ''}`}><ShieldCheck size={16} /><div><strong>Trusted execution</strong><span>{simulationStep === 3 ? 'Syncing to Firebase...' : 'Ledger synced just now'}</span></div><span className="online-dot" /></div><button className="nav-item" onClick={(e) => { e.stopPropagation(); setActiveNav('Settings'); setShowMobileNav(false); }}><Settings size={18} /><span>Settings</span></button><button className="nav-item" onClick={(e) => { e.stopPropagation(); localStorage.removeItem('currentUser'); router.push('/login'); }} style={{ color: 'var(--coral)' }}><LogOut size={18} /><span>Sign Out</span></button><div className="merchant-mini"><div className="avatar">{currentUser?.merchantName?.substring(0, 2).toUpperCase() || 'MR'}</div><div><strong>{currentUser?.merchantName || 'Merchant'}</strong><span>India</span></div><ChevronRight size={15} /></div></div>
      </aside>

      <section className="main-column">
        <header className="topbar"><button className="mobile-menu" onClick={() => setShowMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="crumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><select className="lang-select" value={language} onChange={e => setLanguage(e.target.value as 'en'|'hi'|'mr')}><option value="en">English</option><option value="hi">हिंदी</option><option value="mr">मराठी</option></select><div className="live-status"><span className="online-dot" /> All systems live</div><button className="icon-button" aria-label="Take a tour" onClick={() => setRunTour(true)}><HelpCircle size={19} /></button><button className="icon-button" aria-label="Notifications" onClick={() => handleAction('Notifications')}><Bell size={19} /><i>4</i></button><button className="top-avatar" aria-label="Open merchant profile" onClick={() => handleAction('Merchant profile')}>{currentUser?.merchantName?.substring(0, 2).toUpperCase() || 'MR'}</button></div></header>

        <div className="content">
          {activeNav === 'Dashboard' ? (
            <>
              <section className="welcome-row"><div><p className="eyebrow">THURSDAY, 17 SEPTEMBER 2026 <span className="location-tag">Mumbai</span></p><h1>{t.greeting}, {currentUser?.merchantName?.split(' ')[0] || 'Merchant'} <span className="wave">👋</span></h1><p className="subhead">{t.subhead}</p></div><div className="header-controls"><button className="outline-btn" onClick={resetDemo}><RotateCcw size={15} /> Reset demo</button><button className="primary-btn tour-step-run-scenario" onClick={runScenario} disabled={isRunning}><Play size={15} fill="currentColor" /> {isRunning ? 'Running scenario...' : 'Run full AI scenario'}</button></div></section>
          <section className="hero-strip"><div className="hero-icon"><BarChart3 size={21} /></div><div><p className="eyebrow">{t.todayCheckIn}</p><strong>{t.salesHealthy}</strong><p>{t.nextReview} <span>•</span> 3:00 PM <span>•</span> 2 {t.actionsReady}</p></div><button className="ghost-btn" onClick={askVyaparDost}>{t.viewPlan} <ArrowUpRight size={16} /></button></section>
          <section className="briefing-card tour-step-briefing-card"><div className="briefing-head"><div><p className="eyebrow">{t.vyaparosAi}</p><h2>{t.businessUnderstood}</h2></div><span className="ai-live"><span className="online-dot" /> READY</span></div><div className="briefing-content"><div><strong>3 {t.thingsAttention}</strong><div className="brief-list"><span className="red-dot" /> Afternoon sales ↓ 41%<span className="amber-dot" /> Chocolate inventory inactive<span className="orange-dot" /> ₹13,500 cash gap projected</div></div><div className="briefing-next"><p className="eyebrow">{t.nextBestAction}</p><h3>{t.teaCombo}</h3><p>8% discount <span>•</span> 3 PM – 6 PM</p><strong>Expected contribution: ₹1,130</strong><div><button className="primary-btn" onClick={() => { setScenario('ready'); handleAction('Action ready for review'); }}>{t.reviewApprove}</button><button className="link-btn" onClick={askVyaparDost}>{t.askDost}</button></div></div></div></section>
          <section className="quick-section tour-step-quick-actions"><div className="section-heading compact"><div><p className="eyebrow">{t.quickActions}</p><h2>{t.getThingsDone}</h2></div></div><div className="quick-row"><QuickAction icon={IndianRupee} label={t.receivePayment} onClick={() => handleAction('Receive payment')} /><QuickAction icon={QrCode} label={t.createQr} onClick={() => handleAction('Create QR')} /><QuickAction icon={ScanLine} label={t.scanShelf} onClick={() => handleAction('Scan shelf')} /><QuickAction icon={CreditCard} label={t.addKhata} onClick={() => handleAction('Add khata')} /><QuickAction icon={Send} label={t.sendReminder} onClick={() => handleAction('Send reminder')} /><QuickAction icon={Bot} label={t.askAi} onClick={askVyaparDost} featured /></div></section>
            <section className={`kpi-grid tour-step-kpis ${simulationStep === 10 ? 'sim-active' : ''}`}><KpiCard label="Today's sales" value={simulationStep === 10 ? '₹26,700' : '₹24,850'} change={simulationStep === 10 ? '+15.2%' : '+8.4%'} positive icon={BarChart3} onClick={() => handleAction('Sales details')} /><KpiCard label="Estimated contribution" value={simulationStep === 10 ? '₹7,274' : '₹6,144'} detail="After costs & discounts" icon={IndianRupee} onClick={() => handleAction('Contribution details')} /><KpiCard label="Customers" value={simulationStep === 10 ? '146' : '143'} detail="38 regulars active" icon={Target} onClick={() => handleAction('Customer details')} /><KpiCard label="UPI sales" value="₹82,450" detail="11 qualifying transactions" icon={QrCode} onClick={() => handleAction('UPI sales details')} /></section>
          {isRunning && <section className="analysis-bar"><div className="spinner" /><strong>VyaparDost is connecting the dots...</strong><span>Checking sales, inventory, profitability, cashflow and payment impact</span></section>}

          <div className="section-heading"><div><p className="eyebrow">{t.whatNeedsAttention}</p><h2>{t.fiveThings}</h2></div><button className="text-btn" onClick={() => handleAction('All alerts')}>{t.viewAllAlerts} <ArrowUpRight size={15} /></button></div>
          <section className={`alert-grid ${simulationStep === 5 ? 'sim-active' : ''}`}>{alerts.map(({ title, copy, tone, icon: Icon, action }) => <article className={`alert-card ${tone}`} key={title}><div className="alert-top"><div className="alert-icon"><Icon size={17} /></div><span className="alert-state">Needs review</span></div><h3>{title}</h3><p>{copy}</p><button className="card-link" onClick={tone === 'coral' ? askVyaparDost : () => handleAction(action)}>{action} <ChevronRight size={15} /></button></article>)}</section>

          <section className="payment-layout"><div className="panel payments-panel"><div className="panel-heading"><div><p className="eyebrow">RECENT PAYMENTS</p><h2>Money received today</h2></div><button className="text-btn" onClick={() => handleAction('Payments')}>View all <ArrowUpRight size={15} /></button></div><div className="payment-tabs"><button className="selected">Today</button><button onClick={() => handleAction('Yesterday payments')}>Yesterday</button><button onClick={() => handleAction('This week payments')}>This week</button></div>{recentPayments.map(payment => <button className="payment-row" key={payment.customer} onClick={() => openPayment(payment.customer)}><span className="payment-avatar">{payment.customer[0]}</span><span className="payment-customer"><strong>{payment.customer}</strong><small>{payment.method} <span>•</span> {payment.time}</small></span><strong className="payment-amount">{payment.amount}</strong><span className="payment-success"><Check size={12} /> Success</span></button>)}</div><div className={`panel guard-panel ${simulationStep === 6 ? 'sim-active' : ''}`}><div className="panel-heading"><div><p className="eyebrow">VYAPARPAY GUARD</p><h2>Payment-cost insight</h2></div><ShieldCheck size={19} className="muted-icon" /></div><p className="panel-copy">UPI Cost & Settlement Intelligence</p><div className="guard-main"><strong>₹82,450</strong><span>UPI sales</span></div><div className="guard-stats"><div><strong>11</strong><span>Qualifying transactions</span></div><div><strong>₹228</strong><span>Estimated payment cost</span></div><div><strong>₹82,222</strong><span>Estimated net settlement</span></div></div><p className="guard-note">Payment-cost impact is included in profitability analysis.</p><button className="secondary-btn" onClick={() => handleAction('Payment insights')}>View payment insights <ArrowUpRight size={14} /></button></div></section>

          <section className="work-grid"><div className={`panel assistant-panel tour-step-vyapardost ${simulationStep === 4 ? 'sim-active' : ''}`}><div className="panel-heading"><div><p className="eyebrow">VYAPARDOST</p><h2>Your merchant assistant</h2></div><span className="ai-live"><span className="online-dot" /> Ready</span></div><div className="chat-history">{chatHistory.map((msg, i) => <div key={i} className={`chat-bubble ${msg.sender}`}>{msg.sender === 'bot' && <strong><Sparkles size={11} style={{display:'inline', marginRight:4}}/> VyaparDost</strong>}<p style={{margin: msg.sender==='bot'?'4px 0 0':0}}>{msg.text}</p>{msg.sender === 'bot' && i === 0 && <button className="recommendation-link" onClick={() => handleAction('Review & approve')} style={{marginTop:8}}>Review recommended action <ArrowUpRight size={15} /></button>}</div>)}</div><div className="query-box"><MessageCircle size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ask about sales, stock or cash..." onFocus={() => setAssistantOpen(true)} onKeyDown={e => e.key === 'Enter' && handleChatSubmit()} /><button onClick={handleChatSubmit} aria-label="Send query"><Send size={16} /></button></div><div className="suggestion-row"><button onClick={() => setQuery('Aaj kya karna chahiye?')}>Aaj kya karna chahiye?</button><button onClick={() => setQuery('Kitna UPI cost hua?')}>Kitna UPI cost hua?</button><button onClick={() => setQuery('Kal kya stock karna hai?')}>Kal kya stock karna hai?</button></div></div>
            <div className={`panel profit-panel ${simulationStep === 5 ? 'sim-active' : ''}`}><div className="panel-heading"><div><p className="eyebrow">PROFITPILOT</p><h2>Contribution today</h2></div><button className="icon-button small" aria-label="Open profit details"><ArrowUpRight size={16} /></button></div><div className="profit-number">₹6,144 <span>+12.8%</span></div><div className="mini-chart"><div className="chart-grid"><span /><span /><span /></div><svg viewBox="0 0 450 150" role="img" aria-label="Contribution trend"><path d="M0 122 C35 117, 42 86, 75 95 S110 113, 140 80 S175 93, 205 65 S245 78, 275 46 S305 80, 335 58 S375 70, 405 24 S435 42, 450 15" fill="none" stroke="#0aa87b" strokeWidth="4" strokeLinecap="round" /><path d="M0 122 C35 117, 42 86, 75 95 S110 113, 140 80 S175 93, 205 65 S245 78, 275 46 S305 80, 335 58 S375 70, 405 24 S435 42, 450 15 V150 H0Z" fill="url(#fill)" opacity=".14" /><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0aa87b" /><stop offset="1" stopColor="#fff" /></linearGradient></defs></svg></div><div className="chart-labels"><span>10 AM</span><span>12 PM</span><span>2 PM</span><span>4 PM</span><span>Now</span></div><div className="insight-line"><Sparkles size={15} /><span>Your highest-selling product is not your highest-margin product.</span></div></div></section>

          {hasRecommendation && <section className={`action-section tour-step-action-center ${simulationStep === 7 ? 'sim-active' : ''}`}><div className="section-heading"><div><p className="eyebrow">ACTION CENTER <span className="count-badge">1 ready</span></p><h2>Turn insight into action</h2></div><span className="simulation-label">DEMO SIMULATION</span></div><div className="action-card"><div className="action-copy"><div className="action-agent"><div className="agent-icon"><Target size={19} /></div><div><strong>VyaparPulse</strong><span>Sales & customer growth agent</span></div><span className="risk-low">Low risk</span></div><h3>Recover afternoon sales with a Tea + Chocolate Combo</h3><p>Target afternoon regulars between 3 PM and 6 PM. A focused bundle improves movement while protecting margin.</p><div className="action-metrics"><div><span>Discount</span><strong>8%</strong></div><div><span>Expected revenue</span><strong>₹1,850</strong></div><div><span>Contribution</span><strong>₹1,130</strong></div><div><span>Payment cost</span><strong>₹48 est.</strong></div></div></div><div className="policy-box"><div className="policy-title"><ShieldCheck size={17} /> Policy Engine <span>Passed</span></div><div className="policy-row"><Check size={14} /> Merchant permissions</div><div className="policy-row"><Check size={14} /> Discount limit &lt; 10%</div><div className="policy-row"><Check size={14} /> Campaign budget &lt; ₹500</div><div className="approval-note"><ClipboardCheck size={15} /><span>Merchant approval required before execution</span></div>{!isApproved ? <button className="approve-btn" onClick={approveAction}><Check size={16} /> Approve action</button> : <div className="approved-state"><Check size={17} /> {isExecuted ? 'Action executed successfully' : 'Approval received'}</div>}</div></div>{isExecuted && <div className="execution-timeline">{['Recommendation approved', 'QR coupon generated', 'WhatsApp campaign queued', 'Soundbox announcement simulated', 'Action logged'].map((item, index) => <div key={item} className="timeline-item"><span><Check size={13} /></span>{item}{index > 1 && <em>Demo simulation</em>}</div>)}</div>}</section>}

          <section className={`integrations-section ${simulationStep === 8 ? 'sim-active' : ''}`}><div className="section-heading"><div><p className="eyebrow">CONNECTED TOOLS</p><h2>Use the tools you already have</h2></div><span className="simulation-label">DEMO SIMULATION</span></div><div className="integration-grid"><IntegrationCard icon={Volume2} name="Paytm Soundbox" detail="Play store announcements" action="Play announcement" onClick={() => handleAction('Soundbox announcement')} tone="blue" /><IntegrationCard icon={MessageSquareText} name="WhatsApp" detail="Send a customer offer" action="Preview message" onClick={() => handleAction('WhatsApp message')} tone="green" /><IntegrationCard icon={Smartphone} name="Merchant app" detail="Open the mobile view" action="Open app view" onClick={() => handleAction('Merchant app')} tone="orange" /><IntegrationCard icon={Bot} name="VyaparDost" detail="Ask about your business" action="Ask a question" onClick={askVyaparDost} tone="purple" /></div></section>
          <section className="lower-grid"><div className={`panel ledger-panel tour-step-trusted-ledger ${simulationStep === 9 ? 'sim-active' : ''}`}><div className="panel-heading"><div><p className="eyebrow">TRUSTED EXECUTION LEDGER</p><h2>Every action, accountable</h2></div><button className="text-btn" onClick={() => handleAction('Trusted ledger')}>Open ledger <ArrowUpRight size={15} /></button></div><p className="panel-copy">Tamper-evident audit trail for AI actions, approvals and outcomes.</p>{(isExecuted ? ['Action Engine · QR generated', 'WhatsApp Simulation · Campaign queued', 'Merchant · Campaign approved'] : ['VyaparPulse · Campaign recommended', 'ProfitPilot · Margin checked', 'Policy Engine · Awaiting approval']).map((item, index) => <div className="ledger-row" key={item}><span className={`ledger-icon ${isExecuted || index === 2 ? 'success' : ''}`}>{isExecuted || index === 2 ? <Check size={14} /> : <Clock3 size={14} />}</span><div><strong>{item}</strong><span>{index === 0 ? 'Today, 16:44' : 'Today, 16:43'}</span></div><b>{isExecuted || index === 2 ? 'Success' : 'Pending'}</b></div>)}<div className="hash-row"><span>Current hash</span><strong>8a72c1...d90f</strong><ShieldCheck size={14} /></div></div><div className={`panel sources-panel ${simulationStep === 1 || simulationStep === 2 ? 'sim-active' : ''}`}><div className="panel-heading"><div><p className="eyebrow">MERCHANT CONTEXT</p><h2>Signals in one place</h2></div><Layers3 size={19} className="muted-icon" /></div><div className="source-list">{['UPI & QR events', 'POS sales', 'Inventory velocity', 'Customer activity', 'Khata & obligations', 'Voice & OCR'].map((source, index) => <div className="source-row" key={source}><span className={`source-symbol symbol-${index}`}><Check size={13} /></span>{source}<span className="source-status">{simulationStep === 2 ? 'Processing...' : 'Synced'}</span></div>)}</div><div className="source-footer"><span><ShieldCheck size={15} /> Data is simulated for this demo</span><button onClick={() => handleAction('Data sources')}>View data sources <ArrowUpRight size={14} /></button></div></div></section>
          </>
          ) : activeNav === 'Settings' ? (
            <div className="settings-panel" style={{ padding: 40, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)' }}>
              <h2 style={{ fontSize: 24, color: 'var(--navy)', margin: '0 0 24px' }}>Settings</h2>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Theme Preference</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    className={theme === 'light' ? 'primary-btn' : 'outline-btn'} 
                    onClick={() => setTheme('light')}
                  >
                    Light Mode
                  </button>
                  <button 
                    className={theme === 'dark' ? 'primary-btn' : 'outline-btn'} 
                    onClick={() => setTheme('dark')}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>
              <button className="outline-btn" onClick={() => setActiveNav('Dashboard')}>
                <HomeIcon size={16} /> Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="module-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)', padding: 40 }}>
              <div style={{ background: 'var(--surface-hover)', color: 'var(--blue)', width: 80, height: 80, borderRadius: 20, display: 'grid', placeItems: 'center', marginBottom: 24 }}>
                <Layers3 size={40} />
              </div>
              <h2 style={{ fontSize: 24, color: 'var(--navy)', margin: '0 0 12px' }}>{activeNav} Module</h2>
              <p style={{ color: 'var(--muted)', maxWidth: 400, lineHeight: 1.6, marginBottom: 24 }}>
                This is the dedicated workspace for <strong>{activeNav}</strong>. In the live production build, this module connects securely to your Paytm data streams to provide specialized insights and actions.
              </p>
              <button className="primary-btn" onClick={() => setActiveNav('Dashboard')}>
                <HomeIcon size={16} /> Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </section>
      <div className="mobile-bottom"><button className="active"><HomeIcon size={18} /><span>Home</span></button><button onClick={askVyaparDost}><Bot size={18} /><span>Ask AI</span></button><button onClick={() => setActiveNav('Action Center')}><Zap size={18} /><span>Actions</span></button><button onClick={() => setShowMobileNav(true)}><Menu size={18} /><span>More</span></button></div>
      {actionNotice && <div role="status" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 40, background: '#102a43', color: '#fff', padding: '11px 15px', borderRadius: 8, fontSize: 11, boxShadow: '0 8px 22px #102a4330' }}>{actionNotice}</div>}
      
      {simulationStep > 0 && (
        <div className="sim-controller">
          <button onClick={() => setSimulationStep(s => Math.max(0, s - 1))}><ChevronRight size={16} style={{transform: 'rotate(180deg)'}} /> Prev</button>
          <div className="sim-step-text">
            <strong>{simSteps[simulationStep - 1]?.title || ''}</strong>
            {simSteps[simulationStep - 1]?.desc || ''}
          </div>
          <button onClick={() => { if (simulationStep === 10) { setSimulationStep(0); setScenario('idle'); } else { setSimulationStep(s => s + 1); } }}>
            {simulationStep === 10 ? 'Finish' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      )}

      {activeModal && (
        <div className="overlay-backdrop" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          {activeModal === 'kpi' && (
            <div className="modal-dialog">
              <div className="modal-header"><h3>{modalData}</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="mini-chart" style={{height: 180, marginBottom: 20}}><div className="chart-grid"><span /><span /><span /><span /></div><svg viewBox="0 0 450 150" role="img" aria-label="Trend"><path d="M0 122 C35 117, 42 86, 75 95 S110 113, 140 80 S175 93, 205 65 S245 78, 275 46 S305 80, 335 58 S375 70, 405 24 S435 42, 450 15" fill="none" stroke="#0878d1" strokeWidth="4" strokeLinecap="round" /><path d="M0 122 C35 117, 42 86, 75 95 S110 113, 140 80 S175 93, 205 65 S245 78, 275 46 S305 80, 335 58 S375 70, 405 24 S435 42, 450 15 V150 H0Z" fill="url(#fill-blue)" opacity=".14" /><defs><linearGradient id="fill-blue" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0878d1" /><stop offset="1" stopColor="#fff" /></linearGradient></defs></svg></div>
                <div className="insight-line"><Sparkles size={15} /><span>Detailed analytics generated by Merchant Context Builder.</span></div>
              </div>
            </div>
          )}
          {activeModal === 'receipt' && (
            <div className="modal-dialog" style={{maxWidth: 340}}>
              <div className="modal-header"><h3>Payment Receipt</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body" style={{background: '#f4f6f8'}}>
                <div className="receipt-paper">
                  <h4>Rekha General Store</h4>
                  <div className="receipt-row"><span>Customer</span><strong>{modalData}</strong></div>
                  <div className="receipt-row"><span>Method</span><strong>UPI QR</strong></div>
                  <div className="receipt-row"><span>Time</span><strong>2:42 PM</strong></div>
                  <div className="receipt-row"><span>Status</span><strong style={{color: 'var(--green)'}}>Success</strong></div>
                  <div className="receipt-total"><span>Total Amount</span><span>₹3,200</span></div>
                </div>
              </div>
            </div>
          )}
          {activeModal === 'alert' && (
            <div className="side-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h3>Needs Review</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <article className="alert-card coral" style={{marginBottom: 20}}>
                  <div className="alert-top"><div className="alert-icon"><TrendingDown size={17} /></div></div>
                  <h3 style={{fontSize: 16}}>Afternoon footfall is down 41%</h3>
                  <p style={{fontSize: 13, marginTop: 8}}>Demand is softer than your usual baseline for Thursdays.</p>
                </article>
                <p style={{fontSize: 12, color: '#666', lineHeight: 1.6}}>VyaparPulse recommends launching a targeted campaign to regulars to recover this sales gap. ProfitPilot has verified that a combo offer will protect your margins better than a flat discount.</p>
              </div>
              <div className="modal-footer" style={{marginTop: 'auto'}}>
                <button className="outline-btn" onClick={() => setActiveModal(null)}>Dismiss</button>
                <button className="primary-btn" onClick={() => { setActiveModal('approval'); }}>Review Recommendation</button>
              </div>
            </div>
          )}
          {activeModal === 'approval' && (
            <div className="modal-dialog">
              <div className="modal-header"><h3>Approve AI Action</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="policy-box" style={{border: 0, padding: 0, background: 'transparent'}}>
                  <div className="policy-title"><ShieldCheck size={17} /> Policy Engine <span>Passed</span></div>
                  <div className="policy-row"><Check size={14} /> Merchant permissions</div>
                  <div className="policy-row"><Check size={14} /> Discount limit &lt; 10%</div>
                  <div className="policy-row"><Check size={14} /> Campaign budget &lt; ₹500</div>
                </div>
                <p style={{fontSize: 12, marginTop: 20, color: '#4a6375'}}>This will generate a QR coupon, queue a WhatsApp campaign to 38 regulars, and trigger a Soundbox announcement.</p>
              </div>
              <div className="modal-footer">
                <button className="outline-btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button className="primary-btn" onClick={() => { setActiveModal(null); approveAction(); }} style={{background: 'var(--green)', borderColor: 'var(--green)'}}><Check size={16} /> Execute Action</button>
              </div>
            </div>
          )}
          {activeModal === 'numpad' && (
            <div className="modal-dialog" style={{maxWidth: 360}}>
              <div className="modal-header"><h3>Receive Payment</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="amount-display">₹1,250</div>
                <div className="numpad-grid">
                  {[1,2,3,4,5,6,7,8,9,'C',0,'⌫'].map(k => <button key={k} className="numpad-btn">{k}</button>)}
                </div>
              </div>
              <div className="modal-footer"><button className="primary-btn" onClick={() => { setActiveModal('qrcode'); }} style={{width:'100%', justifyContent:'center'}}>Generate QR Link</button></div>
            </div>
          )}
          {activeModal === 'qrcode' && (
            <div className="modal-dialog" style={{maxWidth: 360, textAlign: 'center'}}>
              <div className="modal-header"><h3>Show this QR</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body" style={{background: '#f4f6f8'}}>
                <div className="qr-container">
                  <div className="qr-pulse"></div>
                  <div style={{width: 180, height: 180, background: '#111', margin: '0 auto', display:'grid', placeItems:'center', borderRadius: 8}}>
                    <QrCode color="#fff" size={80} />
                  </div>
                  <h4 style={{marginTop: 15, fontSize: 24, color: '#1a364d', margin: '15px 0 5px'}}>₹1,250</h4>
                  <p style={{fontSize: 11, color: '#8b9ca7', margin: 0}}>Awaiting customer payment...</p>
                </div>
              </div>
            </div>
          )}
          {activeModal === 'camera' && (
            <div className="modal-dialog" style={{maxWidth: 400}}>
              <div className="modal-header"><h3>ShelfSense Scanner</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="viewfinder-container">
                  <div className="viewfinder-brackets"><span></span></div>
                  <div className="scan-line"></div>
                </div>
                <p style={{textAlign: 'center', fontSize: 12, marginTop: 15, color: '#4a6375'}}><Sparkles size={14} style={{display:'inline', verticalAlign:'middle', marginRight:4}}/> Scanning inventory levels and identifying low stock...</p>
              </div>
            </div>
          )}
          {activeModal === 'whatsapp' && (
            <div className="modal-dialog" style={{maxWidth: 400}}>
              <div className="modal-header"><h3>WhatsApp Campaign</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="wa-preview">
                  <div className="wa-bubble">
                    <strong>Rekha General Store</strong>
                    Namaste! Special afternoon offer just for you: Get 10% off on all Chocolate & Tea combos today between 3 PM and 6 PM.
                    <br/><br/>
                    Scan our QR at the shop to claim!
                    <div className="wa-meta"><span>3:15 PM</span><span><Check size={12}/><Check size={12} style={{marginLeft:-8}}/></span></div>
                  </div>
                </div>
                <div style={{marginTop: 15, background: '#f4fbfd', padding: 12, borderRadius: 8, fontSize: 11, color: '#2e5972', display: 'flex', gap: 8, alignItems: 'center'}}>
                  <Target size={16} /> <span>Targeting <strong>38 regular customers</strong> based on afternoon purchase history.</span>
                </div>
              </div>
              <div className="modal-footer"><button className="outline-btn" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-btn" onClick={() => setActiveModal(null)}><Send size={14} /> Send Now</button></div>
            </div>
          )}
          {activeModal === 'soundbox' && (
            <div className="modal-dialog" style={{maxWidth: 360}}>
              <div className="modal-header"><h3>Soundbox Announcement</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <p style={{fontSize: 13, color: '#1a364d', margin: '0 0 10px', fontWeight: 600}}>Preview Announcement:</p>
                <div style={{background: '#f9fbfc', padding: 12, borderRadius: 8, border: '1px solid #e7edf2', fontSize: 12, color: '#4a6375'}}>
                  &quot;Special offer! Buy Tea and Chocolate combo and get 10 percent off. Valid till 6 PM.&quot;
                </div>
                <div className="soundbox-visualizer">
                  <div className="soundbar"></div><div className="soundbar"></div><div className="soundbar"></div><div className="soundbar"></div><div className="soundbar"></div>
                </div>
              </div>
              <div className="modal-footer"><button className="outline-btn" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-btn" onClick={() => setActiveModal(null)}><Volume2 size={14} /> Play on Soundbox</button></div>
            </div>
          )}
          {activeModal === 'datasources' && (
            <div className="modal-dialog">
              <div className="modal-header"><h3>Connected Data Sources</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body">
                <div className="ds-list">
                  <div className="ds-item"><div className="ds-item-info"><div className="ds-icon"><QrCode size={18}/></div><div><strong>Paytm UPI & QR</strong><span>Real-time payment events</span></div></div><div className="toggle-switch"></div></div>
                  <div className="ds-item"><div className="ds-item-info"><div className="ds-icon"><CreditCard size={18}/></div><div><strong>POS Billing System</strong><span>Invoice & sales data</span></div></div><div className="toggle-switch"></div></div>
                  <div className="ds-item"><div className="ds-item-info"><div className="ds-icon"><ScanLine size={18}/></div><div><strong>ShelfSense Camera</strong><span>Live inventory tracking</span></div></div><div className="toggle-switch"></div></div>
                  <div className="ds-item"><div className="ds-item-info"><div className="ds-icon"><Mic size={18}/></div><div><strong>Voice Input (Khata)</strong><span>Merchant verbal logs</span></div></div><div className="toggle-switch"></div></div>
                </div>
                <p style={{fontSize: 11, color: '#8b9ca7', textAlign: 'center', marginTop: 16}}><ShieldCheck size={12} style={{display:'inline', verticalAlign:'middle'}}/> All data is encrypted and synced in real-time.</p>
              </div>
            </div>
          )}
          {activeModal === 'generic' && (
            <div className="modal-dialog">
              <div className="modal-header"><h3>Operational Module</h3><button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button></div>
              <div className="modal-body" style={{textAlign: 'center', padding: '40px 20px'}}>
                <Zap size={32} color="var(--blue)" style={{margin: '0 auto 15px'}} />
                <h4 style={{margin: '0 0 10px', fontSize: 16, color: '#1a364d'}}>{modalData}</h4>
                <p style={{fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5}}>
                  This module represents the operational interface for the <strong>{modalData}</strong> action. In the final product, this would contain the specific forms, charts, or tools required.
                </p>
              </div>
              <div className="modal-footer">
                <button className="outline-btn" onClick={() => setActiveModal(null)}>Close</button>
                <button className="primary-btn" onClick={() => setActiveModal(null)}>Continue</button>
              </div>
            </div>
          )}
        </div>
      )}
      <SimulationAssistant run={runTour} onFinish={() => setRunTour(false)} />
    </main>
  );
}

function QuickAction({ icon: Icon, label, onClick, featured }: { icon: typeof IndianRupee; label: string; onClick: () => void; featured?: boolean }) {
  return <button className={`quick-action ${featured ? 'featured' : ''}`} onClick={onClick}><Icon size={19} /><span>{label}</span></button>;
}

function KpiCard({ label, value, change, detail, positive, icon: Icon, onClick }: { label: string; value: string; change?: string; detail?: string; positive?: boolean; icon: typeof BarChart3; onClick?: () => void }) {
  return <article className="kpi-card clickable-card" onClick={onClick} onKeyDown={event => event.key === 'Enter' && onClick?.()} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}><div className="kpi-icon"><Icon size={17} /></div><span className="kpi-label">{label}</span><strong className="kpi-value">{value}</strong>{change ? <span className={`kpi-change ${positive ? 'positive' : ''}`}><TrendingUp size={13} /> {change}</span> : <span className="kpi-detail">{detail}</span>}</article>;
}

function IntegrationCard({ icon: Icon, name, detail, action, onClick, tone }: { icon: typeof Volume2; name: string; detail: string; action: string; onClick: () => void; tone: string }) {
  return <article className="integration-card"><div className={`integration-icon ${tone}`}><Icon size={18} /></div><div className="integration-copy"><strong>{name}</strong><span>{detail}</span></div><span className="integration-status"><i /> Ready</span><button onClick={onClick}>{action}<ArrowUpRight size={13} /></button></article>;
}
