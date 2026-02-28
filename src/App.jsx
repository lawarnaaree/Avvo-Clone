import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import LawyerProfile from './pages/LawyerProfile';
import LegalGuide from './pages/LegalGuide';
import AskLawyer from './pages/AskLawyer';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import Lenis from 'lenis';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;