import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout, isLawyer } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Failed to log out', err);
        }
    };

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
                <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
                    <span className="navbar__logo-text">Find Lawyer Nepal</span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="navbar__links">
                    <li className="navbar__link-item">
                        <Link to="/search" className="navbar__link">
                            Find a Lawyer
                            <FiChevronDown className="navbar__link-icon" />
                        </Link>
                    </li>
                    <li className="navbar__link-item">
                        <Link to="/ask" className="navbar__link">
                            Ask a Lawyer
                        </Link>
                    </li>
                    <li className="navbar__link-item">
                        <Link to="/documents" className="navbar__link">
                            Legal Documents
                        </Link>
                    </li>
                    <li className="navbar__link-item">
                        <Link to="/search?type=browse" className="navbar__link">
                            Browse Lawyers
                            <FiChevronDown className="navbar__link-icon" />
                        </Link>
                    </li>
                    {isLawyer && (
                        <li className="navbar__link-item">
                            <Link to="/dashboard/lawyer" className="navbar__link" style={{ color: 'var(--color-primary)', fontWeight: '800' }}>
                                Dashboard
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Right Side */}
                <div className="navbar__actions">
                    <button className="navbar__search-btn" aria-label="Search">
                        <FiSearch />
                    </button>
                    {user ? (
                        <div className="navbar__user">
                            <span className="navbar__user-name"><FiUser /> {user.displayName || 'User'}</span>
                            <button onClick={handleLogout} className="navbar__logout-btn" title="Logout">
                                <FiLogOut />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__signin">Sign In</Link>
                            <Link to="/register" className="btn btn-primary navbar__register-btn">Register</Link>
                        </>
                    )}
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
                    <li><Link to="/search" onClick={() => setMobileOpen(false)}>Find a Lawyer</Link></li>
                    <li><Link to="/ask" onClick={() => setMobileOpen(false)}>Ask a Lawyer</Link></li>
                    <li><Link to="/documents" onClick={() => setMobileOpen(false)}>Legal Documents</Link></li>
                    <li><Link to="/search?type=browse" onClick={() => setMobileOpen(false)}>Browse Lawyers</Link></li>
                    {isLawyer && <li><Link to="/dashboard/lawyer" style={{ color: 'var(--color-primary)', fontWeight: '800' }} onClick={() => setMobileOpen(false)}>Dashboard</Link></li>}
                </ul>
                <div className="navbar__mobile-actions">
                    {user ? (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="navbar__mobile-user">
                                <FiUser /> {user.displayName || user.email}
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
