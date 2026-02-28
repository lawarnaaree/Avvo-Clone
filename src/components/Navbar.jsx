import React, { useState, useEffect } from 'react';
import { FiSearch, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [mobileOpen]);

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__container container">
                {/* Logo */}
                <a href="/" className="navbar__logo">
                    <span className="navbar__logo-text">Find Lawyer Nepal</span>
                </a>

                {/* Desktop Nav Links */}
                <ul className="navbar__links">
                    <li className="navbar__link-item">
                        <a href="#find" className="navbar__link">
                            Find a Lawyer
                            <FiChevronDown className="navbar__link-icon" />
                        </a>
                    </li>
                    <li className="navbar__link-item">
                        <a href="#ask" className="navbar__link">
                            Ask a Lawyer
                        </a>
                    </li>
                    <li className="navbar__link-item">
                        <a href="#research" className="navbar__link">
                            Research Legal Topics
                            <FiChevronDown className="navbar__link-icon" />
                        </a>
                    </li>
                    <li className="navbar__link-item">
                        <a href="#lawyers" className="navbar__link">
                            Browse Lawyers
                            <FiChevronDown className="navbar__link-icon" />
                        </a>
                    </li>
                </ul>

                {/* Right Side */}
                <div className="navbar__actions">
                    <button className="navbar__search-btn" aria-label="Search">
                        <FiSearch />
                    </button>
                    <a href="#signin" className="navbar__signin">Sign In</a>
                    <a href="#register" className="btn btn-primary navbar__register-btn">Register</a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar__mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <FiX /> : <FiMenu />}
                </button>

            </div>

            {/* Mobile Menu - Moved outside container for full-screen coverage */}
            <div className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}>
                <ul className="navbar__mobile-links">
                    <li><a href="#find" onClick={() => setMobileOpen(false)}>Find a Lawyer</a></li>
                    <li><a href="#ask" onClick={() => setMobileOpen(false)}>Ask a Lawyer</a></li>
                    <li><a href="#research" onClick={() => setMobileOpen(false)}>Research Legal Topics</a></li>
                    <li><a href="#lawyers" onClick={() => setMobileOpen(false)}>Browse Lawyers</a></li>
                </ul>
                <div className="navbar__mobile-actions">
                    <a href="#signin" className="btn btn-secondary" style={{ width: '100%' }}>Sign In</a>
                    <a href="#register" className="btn btn-primary" style={{ width: '100%' }}>Register</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
