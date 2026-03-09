import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { documentService } from '../services/documentService';
import { FiCalendar, FiClock, FiMessageSquare, FiUser, FiFileText, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const [aptData, docData] = await Promise.all([
                    appointmentService.getUserAppointments(user.uid),
                    documentService.getUserDocuments(user.uid)
                ]);
                setAppointments(aptData);
                setDocuments(docData);
                setLoading(false);
            };
            fetchData();
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
                        <h2><FiFileText /> My Documents</h2>
                        <Link to="/documents" className="view-all">Browse Library</Link>
                    </div>
                    <div className="documents-list">
                        {documents.length > 0 ? (
                            documents.map(doc => (
                                <div key={doc.id} className="user-doc-item">
                                    <div className="user-doc-info">
                                        <FiFileText className="user-doc-icon" />
                                        <div>
                                            <strong>{doc.templateName}</strong>
                                            <span className="user-doc-date">Saved {doc.createdAt?.seconds ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-icon"
                                        onClick={() => navigate(`/documents/${doc.id}/edit`)}
                                        title="View/Edit"
                                    >
                                        <FiArrowRight />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No saved documents.</p>
                                <Link to="/documents" className="btn btn-secondary btn-sm mt-md" style={{ display: 'inline-block' }}>Create a Document</Link>
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
