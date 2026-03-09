import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiCheck, FiX, FiUser } from 'react-icons/fi';
import './BookingsManager.css';

const BookingsManager = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await appointmentService.getLawyerAppointments(user.uid);
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await appointmentService.updateStatus(id, status);
            fetchAppointments(); // Refresh
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    if (loading) return <div className="bookings-manager">Loading bookings...</div>;

    return (
        <div className="bookings-manager">
            <h2 className="dashboard-content__title">Consultation Bookings</h2>

            <div className="bookings-list">
                {appointments.length === 0 ? (
                    <div className="empty-state">No consultation requests found.</div>
                ) : (
                    appointments.map(apt => (
                        <div key={apt.id} className={`booking-card glass-card ${apt.status}`}>
                            <div className="booking-card__main">
                                <div className="user-info">
                                    <div className="user-icon"><FiUser /></div>
                                    <div>
                                        <strong>{apt.userName}</strong>
                                        <p>Client Request</p>
                                    </div>
                                </div>
                                <div className="datetime-info">
                                    <span><FiCalendar /> {apt.date}</span>
                                    <span><FiClock /> {apt.time}</span>
                                </div>
                                <div className={`status-badge ${apt.status}`}>
                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                </div>
                            </div>

                            {apt.status === 'pending' && (
                                <div className="booking-actions">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                    >
                                        <FiCheck /> Confirm
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                    >
                                        <FiX /> Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookingsManager;
