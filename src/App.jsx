import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import LawyerProfile from './pages/LawyerProfile';
import LegalGuide from './pages/LegalGuide';
import AskLawyer from './pages/AskLawyer';
import Documents from './pages/Documents';
import DocumentBuilder from './pages/DocumentBuilder';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Messages';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Lenis from 'lenis';

// Global Lenis instance so ScrollToTop can access it
let lenisInstance = null;

// Protected Route Component
const ProtectedRoute = ({ children, requireLawyer = false }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireLawyer && userProfile?.role !== 'lawyer') {
    return <Navigate to="/" />;
  }

  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use Lenis if available, otherwise fall back to native scroll
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <AuthProvider>
      <Router basename="/find-lawyer-nepal/">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />
          <Route path="/guide/:id" element={<LegalGuide />} />
          <Route path="/ask" element={<AskLawyer />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:templateId" element={<DocumentBuilder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />

          {/* Lawyer Dashboard Protected Routes */}
          <Route
            path="/dashboard/lawyer/*"
            element={
              <ProtectedRoute requireLawyer={true}>
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;