import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import ProfileEditor from './ProfileEditor';
import AnswerManager from './AnswerManager';
import BookingsManager from './BookingsManager';
import Messages from '../Messages';
import { qaService } from '../../services/qaService';
import { appointmentService } from '../../services/appointmentService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import {
    FiGrid, FiUser, FiMessageSquare, FiCalendar, FiSettings,
    FiExternalLink, FiArrowRight, FiStar, FiTrendingUp,
    FiUsers, FiCheckCircle, FiClock, FiHelpCircle
} from 'react-icons/fi';
import './LawyerDashboard.css';

/* ── Sidebar ── */
const DashboardSidebar = () => {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(' ')[0] || 'Counselor';

    return (
        <aside className="ld-sidebar">
            <div className="ld-sidebar__brand">
                <div className="ld-sidebar__avatar">
                    {firstName[0]}
                </div>
                <div className="ld-sidebar__brand-info">
                    <span className="ld-sidebar__brand-name">{user?.displayName || 'Lawyer'}</span>
                    <span className="ld-sidebar__brand-role">Attorney at Law</span>
                </div>
            </div>

            <nav className="ld-sidebar__nav">
                <span className="ld-sidebar__nav-label">Main</span>
                <NavLink to="/dashboard/lawyer" end className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiGrid /> <span>Overview</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/bookings" className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiCalendar /> <span>Bookings</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/messages" className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiMessageSquare /> <span>Messages</span>
                </NavLink>

                <span className="ld-sidebar__nav-label">Manage</span>
                <NavLink to="/dashboard/lawyer/answers" className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiHelpCircle /> <span>Q&A Answers</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/profile" className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiUser /> <span>Edit Profile</span>
                </NavLink>
                <NavLink to="/dashboard/lawyer/settings" className={({ isActive }) => `ld-sidebar__link ${isActive ? 'ld-sidebar__link--active' : ''}`}>
                    <FiSettings /> <span>Settings</span>
                </NavLink>
            </nav>

            <div className="ld-sidebar__footer">
                <Link to="/search" className="ld-sidebar__link ld-sidebar__link--secondary">
                    <FiExternalLink /> <span>Public Directory</span>
                </Link>
            </div>
        </aside>
    );
};

/* ── Overview ── */
const DashboardOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ answers: 0, bookings: 0, rating: 0, reviews: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const [qData, aptData, reviewData] = await Promise.all([
                    qaService.getQuestions(50),
                    appointmentService.getLawyerAppointments(user.uid),
                    reviewService.getLawyerReviews(user.uid)
                ]);
                const answeredByMe = qData.filter(q =>
                    q.answers?.some(a => a.lawyerId === user.uid) ||
                    q.answeredBy === user.uid || q.lawyerId === user.uid
                );
                const avgRating = reviewData.length > 0
                    ? reviewData.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewData.length
                    : 0;

                setStats({
                    answers: answeredByMe.length,
                    bookings: aptData.length,
                    rating: avgRating.toFixed(1),
                    reviews: reviewData.length
                });
                setRecentBookings(aptData.slice(0, 4));
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const firstName = user?.displayName?.split(' ')[0] || 'Counselor';

    if (loading) {
        return (
            <div className="ld-loading">
                <div className="ld-loading__spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="ld-overview">
            {/* Hero */}
            <div className="ld-hero">
                <div className="ld-hero__content">
                    <span className="ld-hero__wave">⚖️</span>
                    <div>
                        <h1 className="ld-hero__title">{getGreeting()}, {firstName}</h1>
                        <p className="ld-hero__sub">Here's an overview of your practice today.</p>
                    </div>
                </div>
                <div className="ld-hero__date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="ld-stats">
                <div className="ld-stat" onClick={() => navigate('/dashboard/lawyer/bookings')}>
                    <div className="ld-stat__icon ld-stat__icon--blue"><FiCalendar /></div>
                    <div className="ld-stat__info">
                        <span className="ld-stat__value">{stats.bookings}</span>
                        <span className="ld-stat__label">Bookings</span>
                    </div>
                    <FiArrowRight className="ld-stat__arrow" />
                </div>
                <div className="ld-stat" onClick={() => navigate('/dashboard/lawyer/answers')}>
                    <div className="ld-stat__icon ld-stat__icon--green"><FiCheckCircle /></div>
                    <div className="ld-stat__info">
                        <span className="ld-stat__value">{stats.answers}</span>
                        <span className="ld-stat__label">Answers Given</span>
                    </div>
                    <FiArrowRight className="ld-stat__arrow" />
                </div>
                <div className="ld-stat">
                    <div className="ld-stat__icon ld-stat__icon--amber"><FiStar /></div>
                    <div className="ld-stat__info">
                        <span className="ld-stat__value">{stats.rating}</span>
                        <span className="ld-stat__label">Avg. Rating</span>
                    </div>
                </div>
                <div className="ld-stat">
                    <div className="ld-stat__icon ld-stat__icon--purple"><FiUsers /></div>
                    <div className="ld-stat__info">
                        <span className="ld-stat__value">{stats.reviews}</span>
                        <span className="ld-stat__label">Client Reviews</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="ld-grid">
                {/* Recent Bookings Panel */}
                <section className="ld-panel ld-panel--bookings">
                    <div className="ld-panel__header">
                        <div className="ld-panel__title-group">
                            <div className="ld-panel__icon-wrap ld-panel__icon-wrap--blue"><FiCalendar /></div>
                            <h2 className="ld-panel__title">Upcoming Consultations</h2>
                        </div>
                        <span className="ld-panel__count">{recentBookings.length}</span>
                    </div>
                    <div className="ld-panel__body">
                        {recentBookings.length > 0 ? (
                            <div className="ld-booking-list">
                                {recentBookings.map(apt => (
                                    <div key={apt.id} className="ld-booking-item">
                                        <div className="ld-booking-item__left">
                                            <div className="ld-booking-item__avatar">
                                                {apt.userName?.[0] || 'C'}
                                            </div>
                                            <div className="ld-booking-item__details">
                                                <strong>{apt.userName || 'Client'}</strong>
                                                <div className="ld-booking-item__meta">
                                                    <span><FiCalendar /> {apt.date}</span>
                                                    <span><FiClock /> {apt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`ld-status ld-status--${apt.status}`}>{apt.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ld-empty">
                                <div className="ld-empty__illustration">📋</div>
                                <h3>No upcoming consultations</h3>
                                <p>When clients book appointments, they'll appear here.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions Panel */}
                <section className="ld-panel ld-panel--actions">
                    <div className="ld-panel__header">
                        <div className="ld-panel__title-group">
                            <div className="ld-panel__icon-wrap ld-panel__icon-wrap--green"><FiTrendingUp /></div>
                            <h2 className="ld-panel__title">Quick Actions</h2>
                        </div>
                    </div>
                    <div className="ld-panel__body">
                        <div className="ld-actions">
                            <div className="ld-action-card" onClick={() => navigate('/dashboard/lawyer/messages')}>
                                <div className="ld-action-card__icon">💬</div>
                                <strong>Messages</strong>
                                <p>Reply to client messages</p>
                            </div>
                            <div className="ld-action-card" onClick={() => navigate('/dashboard/lawyer/answers')}>
                                <div className="ld-action-card__icon">❓</div>
                                <strong>Answer Questions</strong>
                                <p>Help the community</p>
                            </div>
                            <div className="ld-action-card" onClick={() => navigate('/dashboard/lawyer/profile')}>
                                <div className="ld-action-card__icon">✏️</div>
                                <strong>Edit Profile</strong>
                                <p>Update your details</p>
                            </div>
                            <div className="ld-action-card" onClick={() => navigate('/search')}>
                                <div className="ld-action-card__icon">🔍</div>
                                <strong>View Directory</strong>
                                <p>See your public listing</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

/* ── Settings Placeholder ── */
const SettingsPlaceholder = () => (
    <div className="ld-placeholder">
        <div className="ld-placeholder__icon">⚙️</div>
        <h2>Account Settings</h2>
        <p>Settings and preferences coming soon.</p>
    </div>
);

/* ── Main Layout ── */
const LawyerDashboard = () => {
    return (
        <div className="ld-page">
            <div className="ld-layout">
                <DashboardSidebar />
                <main className="ld-main">
                    <Routes>
                        <Route path="/" element={<DashboardOverview />} />
                        <Route path="/profile" element={<ProfileEditor />} />
                        <Route path="/answers" element={<AnswerManager />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/bookings" element={<BookingsManager />} />
                        <Route path="/settings" element={<SettingsPlaceholder />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default LawyerDashboard;
