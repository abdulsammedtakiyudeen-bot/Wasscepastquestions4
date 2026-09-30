import { BookOpen, ChartNoAxesCombined, ClipboardCheck, CloudOff, Download, FileText, GraduationCap, Home, Info, Library, Mail, Moon, PanelLeft, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect, useState, type ReactNode } from 'react';

const nav = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/resources', label: 'Resource library', icon: Library },
  { href: '/mocks', label: 'Mock exams', icon: ClipboardCheck },
  { href: '/super-mocks', label: 'Super mocks', icon: GraduationCap },
  { href: '/reports', label: 'Examiner reports', icon: FileText },
  { href: '/guides', label: 'Study guides', icon: BookOpen },
  { href: '/downloads', label: 'Downloads', icon: Download },
  { href: '/progress', label: 'My progress', icon: ChartNoAxesCombined },
];
const mobileNav = nav.slice(0, 5);

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('wassce-theme') === 'dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('wassce-theme', dark ? 'dark' : 'light'); }, [dark]);
  return [dark, setDark] as const;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [dark, setDark] = useTheme();
  const [online, setOnline] = useState(navigator.onLine);
  const [installReady, setInstallReady] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const on = () => setOnline(true); const off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    const prompt = (event: Event) => { event.preventDefault(); setInstallEvent(event as BeforeInstallPromptEvent); setInstallReady(true); };
    window.addEventListener('beforeinstallprompt', prompt);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); window.removeEventListener('beforeinstallprompt', prompt); };
  }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
    }
  }, []);
  const install = async () => { if (installEvent) { await installEvent.prompt(); setInstallReady(false); } };
  return <div className="app-layout">
    <aside className="sidebar">
      <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark">W</span><span><span className="brand-title">WASSCE Study</span><span className="brand-sub">Ghana · independent</span></span></Link>
      <div className="nav-label">Study desk</div>
      <nav className="nav-list" aria-label="Main navigation">{nav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span></Link>)}</nav>
      <div className="nav-label" style={{ marginTop: 27 }}>Information</div>
      <nav className="nav-list"><Link href="/exam-guides" className={`nav-link ${location === '/exam-guides' ? 'active' : ''}`} data-testid="link-nav-exam-guides"><Info size={17} /><span>Exam preparation</span></Link><Link href="/dos-donts" className={`nav-link ${location === '/dos-donts' ? 'active' : ''}`} data-testid="link-nav-dos"><PanelLeft size={17} /><span>Do's & don'ts</span></Link><Link href="/about" className={`nav-link ${location === '/about' ? 'active' : ''}`} data-testid="link-about"><Info size={17} /><span>About</span></Link><Link href="/contact" className={`nav-link ${location === '/contact' ? 'active' : ''}`} data-testid="link-contact"><Mail size={17} /><span>Contact</span></Link></nav>
      <div className="sidebar-foot"><p>Built for focused revision when data is scarce and time matters.</p><span className="legal-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></span></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><strong>{location === '/' ? 'Good morning' : (nav.find((item) => item.href === location)?.label || 'WASSCE Study')}</strong><span> / independent revision desk</span></div><div className="top-actions"><span className={`online-pill ${online ? '' : 'offline'}`} data-testid="status-connectivity"><span className="online-dot" />{online ? 'Online' : 'Offline mode'}</span><button className="icon-button" aria-label={dark ? 'Use light mode' : 'Use dark mode'} onClick={() => setDark(!dark)} data-testid="button-toggle-theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div></header>
      {!online && <div className="callout" style={{ margin: '16px clamp(17px, 4vw, 54px) 0' }} data-testid="status-offline"><CloudOff size={17} /><span>You are offline. Your saved resources and completed mocks are still available on this device.</span></div>}
      {children}
      {installReady && <div className="install-card" style={{ margin: '0 clamp(17px, 4vw, 54px) 20px' }}><span><strong>Keep WASSCE Study close.</strong><br />Install for quicker access and offline revision.</span><span style={{ display: 'flex', gap: 7 }}><button className="button button-primary" onClick={install} data-testid="button-install">Install</button><button className="icon-button" onClick={() => setInstallReady(false)} aria-label="Dismiss install prompt" data-testid="button-dismiss-install"><X size={15} /></button></span></div>}
    </main>
    <nav className="mobile-nav" aria-label="Mobile navigation">{mobileNav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`mobile-nav-link ${location === href ? 'active' : ''}`} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={19} /><span>{label === 'Resource library' ? 'Library' : label}</span></Link>)}</nav>
  </div>;
}

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };