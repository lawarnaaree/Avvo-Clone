import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import ProfileEditor from './ProfileEditor';
import AnswerManager from './AnswerManager';
import BookingsManager from './BookingsManager';
import Messages from '../Messages';
import Skeleton from '../../components/Skeleton';
import { qaService } from '../../services/qaService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUser, FiMessageSquare, FiSettings } from 'react-icons/fi';
import './LawyerDashboard.css';

// Sub-components
const DashboardOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        views: 124,
        answers: 0,
        bookings: 0,
        rating: 4.8
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const [qData, aptData] = await Promise.all([
                    qaService.getQuestions(),
                    appointmentService.getLawyerAppointments(user.uid)
                ]);
                const answeredByMe = qData.filter(q => q.answeredBy === user?.uid || q.lawyerId === user?.uid);
                setStats(prev => ({
                    ...prev,
                    answers: answeredByMe.length,
                    bookings: aptData.length
                }));
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div className="dashboard-overview">
            <h2 className="dashboard-content__title">Dashboard Overview</h2>
            <div className="stats-grid">
                {loading ? (
                    <>
                        <div className="stat-card glass-card">
                            <Skeleton height="14px" width="60%" className="mb-sm" />
                            <Skeleton height="36px" width="40%" className="mb-sm" />
                            <Skeleton height="14px" width="80%" />
                        </div>
                        <div className="stat-card glass-card">
                            <Skeleton height="14px" width="60%" className="mb-sm" />
                            <Skeleton height="36px" width="40%" className="mb-sm" />
                            <Skeleton height="14px" width="80%" />
                        </div>
                        <div className="stat-card glass-card">
                            <Skeleton height="14px" width="60%" className="mb-sm" />
                            <Skeleton height="36px" width="40%" className="mb-sm" />
                            <Skeleton height="14px" width="80%" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="stat-card glass-card">
                            <span className="stat-label">Profile Views</span>
                            <span className="stat-value">{stats.views}</span>
                            <span className="stat-trend positive">+12% this week</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-label">Questions Answered</span>
                            <span className="stat-value">{stats.answers}</span>
                            <span className="stat-trend">Impact in community</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-label">Pending Bookings</span>
                            <span className="stat-value">{stats.bookings}</span>
                            <span className="stat-trend neutral">Manage in bookings tab</span>
                        </div>
                        <div className="stat-card glass-card">
                            <span className="stat-label">Average Rating</span>
                            <span className="stat-value">{stats.rating}</span>
                            <span className="stat-trend positive">From {stats.answers + 5} reviews</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SectionPlaceholder = ({ title }) => (
    <div className="section-placeholder">
        <h2 className="dashboard-content__title">{title}</h2>
        <div className="placeholder-content">
            <p>This section is currently under development.</p>
        </div>
    </div>
);

const LawyerDashboard = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <DashboardSidebar />
                <main className="dashboard-main">
                    <div className="dashboard-header">
                        <div className="breadcrumb">
                            <Link to="/">Home</Link> / <span>Lawyer Dashboard</span>
                        </div>
                    </div>

                    <div className="dashboard-content">
                        <Routes>
                            <Route path="/" element={<DashboardOverview />} />
                            <Route path="/profile" element={<ProfileEditor />} />
                            <Route path="/answers" element={<AnswerManager />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/bookings" element={<BookingsManager />} />
                            <Route path="/settings" element={<SectionPlaceholder title="Account Settings" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LawyerDashboard;
