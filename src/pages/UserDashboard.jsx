import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { FiCalendar, FiClock, FiMessageSquare, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchAppointments = async () => {
                const data = await appointmentService.getUserAppointments(user.uid);
                setAppointments(data);
                setLoading(false);
            };
            fetchAppointments();
        }
    }, [user]);

    if (loading) return <div className="user-dashboard container"><h2>Loading your dashboard...</h2></div>;

    return (
        <div className="user-dashboard container">
            <header className="dashboard-header">
                <h1>Welcome, {user.displayName || 'User'}</h1>
                <p>Manage your legal consultations and messages</p>
            </header>

            <div className="dashboard-grid">
                <section className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2><FiCalendar /> Your Appointments</h2>
                    </div>
                    <div className="appointments-list">
                        {appointments.length > 0 ? (
                            appointments.map(apt => (
                                <div key={apt.id} className={`appointment-item ${apt.status}`}>
                                    <div className="apt-info">
                                        <strong>{apt.lawyerName}</strong>
                                        <div className="apt-meta">
                                            <span><FiCalendar /> {apt.date}</span>
                                            <span><FiClock /> {apt.time}</span>
                                        </div>
                                    </div>
                                    <div className={`status-tag ${apt.status}`}>{apt.status}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No appointments booked yet.</p>
                                <Link to="/search" className="btn btn-primary btn-sm mt-md" style={{ display: 'inline-block' }}>Find a Lawyer</Link>
                            </div>
                        )}
                    </div>
                </section>

                <section className="dashboard-section glass-card">
                    <div className="section-header">
                        <h2><FiMessageSquare /> Recent Messages</h2>
                        <Link to="/messages" className="view-all">View All</Link>
                    </div>
                    <div className="messages-preview">
                        <p>Access your real-time chats with lawyers to discuss your cases.</p>
                        <Link to="/messages" className="btn btn-secondary mt-lg" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Open Messages</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
