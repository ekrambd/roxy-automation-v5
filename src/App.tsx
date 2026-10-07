import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { initPixelAndGtm, trackEvent } from './lib/pixelGtmService';
import { ErrorBoundary } from './components/ErrorBoundary';

const LoginPage = lazy(() => import('./components/LoginPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const loadBookLandingPage = () => import('./components/BookLandingPage');
const BookLandingPage = lazy(loadBookLandingPage);
const FantineStorePage = lazy(() => import('./components/FantineStorePage'));

// Fix: Only preload landing page chunk if visiting a known landing path
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  if (path.startsWith('/book') || path.startsWith('/landing') || path === '/boi' || path === '/smart-land-survey-book') {
    loadBookLandingPage();
  }
}


function GlobalBrandingFix() {
  useEffect(() => {
    let pending = false;
    const replaceFantine = () => {
      pending = false;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      const nodesToUpdate = [];
      while (node = walker.nextNode()) {
        if (node.nodeValue && (node.nodeValue.includes('FANTINE') || node.nodeValue.includes('Fantine'))) {
          nodesToUpdate.push(node);
        }
      }
      nodesToUpdate.forEach(n => {
        n.nodeValue = n.nodeValue.replace(/FANTINE/g, 'FAИTIИE').replace(/Fantine/g, 'FAИTIИE');
      });
    };
    
    replaceFantine();
    
    const observer = new MutationObserver((mutations) => {
      let shouldReplace = false;
      for (const m of mutations) {
        if (m.type === 'characterData' && m.target.nodeValue && (m.target.nodeValue.includes('FANTINE') || m.target.nodeValue.includes('Fantine'))) {
          shouldReplace = true; break;
        }
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          shouldReplace = true; break;
        }
      }
      if (shouldReplace && !pending) {
        pending = true;
        requestAnimationFrame(() => {
          observer.disconnect();
          replaceFantine();
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        });
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    
    return () => observer.disconnect();
  }, []);
  
  return null;
}

function AppRoutes() {
  const navigate = useNavigate();
  const { adminEmail, setAdminEmail, logoutAdmin, ecomSettings } = useAppStore();
  
  useEffect(() => {
    // Globally initialize the Meta Pixel as soon as settings load
    const pixelId = ecomSettings?.pixelId || import.meta.env.VITE_META_PIXEL_ID || '1111677938108529';
    if (pixelId) {
      initPixelAndGtm(pixelId);
      trackEvent('PageView');
    }
  }, [ecomSettings?.pixelId]);

  useEffect(() => {
    // Check initial cached admin session
    const storedEmail = localStorage.getItem('noor_admin_session_email');
    if (storedEmail && !adminEmail) {
      setAdminEmail(storedEmail);
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // Non-blocking background auth initialization
    const timer = setTimeout(() => {
      void Promise.all([
        import('firebase/auth'),
        import('./lib/firebase')
      ]).then(([{ onAuthStateChanged }, { auth, isFirebaseEnabled }]) => {
        if (cancelled) return;
        if (isFirebaseEnabled && auth) {
          unsubscribe = onAuthStateChanged(auth, (user) => {
            if (cancelled) return;
            if (user) {
              localStorage.setItem('noor_admin_session_email', user.email || '');
              setAdminEmail(user.email);
            } else {
              const email = localStorage.getItem('noor_admin_session_email');
              setAdminEmail(email || null);
            }
          });
        }
      }).catch((error) => {
        console.warn('Background admin auth check completed:', error);
      });
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, [adminEmail, setAdminEmail]);

  useEffect(() => {
    // Defer session visitor ping so initial paint & load finish first
    let sessionId = sessionStorage.getItem('noor_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('noor_session_id', sessionId);
    }
    
    let isPinging = false;
    const ping = async () => {
      if (isPinging) return;
      isPinging = true;
      try {
        const { dbService } = await import('./lib/dbService');
        await dbService.pingLiveVisitor(sessionId!, window.location.pathname);
      } catch (err) {
        // fail silently
      } finally {
        isPinging = false;
      }
    };

    // Initial ping after 3 seconds idle, then every 30s
    const initTimer = setTimeout(() => {
      void ping();
    }, 3000);
    const interval = setInterval(ping, 30000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('noor_admin_session_email', email);
    setAdminEmail(email);
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      const [{ signOut }, { auth, isFirebaseEnabled }] = await Promise.all([
        import('firebase/auth'),
        import('./lib/firebase')
      ]);
      if (isFirebaseEnabled && auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('noor_admin_session_email');
      logoutAdmin();
      navigate('/');
    }
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen text-slate-900">
      <Suspense fallback={
        <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={
              <FantineStorePage
                onGoToLogin={() => navigate('/login')}
                onGoToLanding={() => navigate('/book')}
              />
            } />
            
            {/* Proper SEO setup: Core app sections continue rendering the app */}
            <Route path="/shop" element={<FantineStorePage onGoToLogin={() => navigate('/login')} onGoToLanding={() => navigate('/book')} />} />
            <Route path="/contact" element={<FantineStorePage onGoToLogin={() => navigate('/login')} onGoToLanding={() => navigate('/book')} />} />
            <Route path="/about" element={<FantineStorePage onGoToLogin={() => navigate('/login')} onGoToLanding={() => navigate('/book')} />} />
            <Route path="/fantine" element={<FantineStorePage onGoToLogin={() => navigate('/login')} onGoToLanding={() => navigate('/book')} />} />
            <Route path="/product/:id" element={<FantineStorePage onGoToLogin={() => navigate('/login')} onGoToLanding={() => navigate('/book')} />} />
            
            {/* Fix Duplicate Content: Canonical Redirects for legacy .html routes */}
            <Route path="/store" element={<Navigate to="/shop" replace />} />
            <Route path="/news" element={<Navigate to="/" replace />} />
            <Route path="/shop.html" element={<Navigate to="/shop" replace />} />
            <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
            <Route path="/product_385231.html" element={<Navigate to="/" replace />} />
            <Route path="/product_*.html" element={<Navigate to="/" replace />} />
            
            <Route path="/book" element={
              <BookLandingPage 
                onNavigateHome={() => navigate('/')}
                onNavigateToLogin={() => navigate('/login')}
              />
            } />
            <Route path="/boi" element={<Navigate to="/book" replace />} />
            <Route path="/smart-land-survey-book" element={<Navigate to="/book" replace />} />
            
            <Route path="/login" element={
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => navigate('/')}
              />
            } />
            <Route path="/admin" element={
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => navigate('/')}
              />
            } />
            
            <Route path="/admin/dashboard" element={
              adminEmail ? (
                <AdminDashboard 
                  adminEmail={adminEmail}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            {/* Landing Page Routes */}
            <Route path="/landing/:slug" element={
              <BookLandingPage 
                onNavigateHome={() => navigate('/')}
                onNavigateToLogin={() => navigate('/login')}
              />
            } />

            {/* Direct Product Landing Route (Only catches 1-level deep unrecognized slugs) */}
            <Route path="/:slug" element={
              <BookLandingPage 
                onNavigateHome={() => navigate('/')}
                onNavigateToLogin={() => navigate('/login')}
              />
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GlobalBrandingFix />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
