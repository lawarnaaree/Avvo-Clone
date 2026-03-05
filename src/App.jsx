import React, { useEffect } from 'react';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Lenis from 'lenis';

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
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
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