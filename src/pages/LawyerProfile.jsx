import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lawyerService } from '../services/lawyerService';
import { reviewService } from '../services/reviewService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiStar, FiCheckCircle, FiPhone, FiMail, FiGlobe, FiCalendar, FiMessageSquare, FiUser, FiX } from 'react-icons/fi';
import './LawyerProfile.css';

const LawyerProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lawyer, setLawyer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({ date: '', time: '' });

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lawyerData, reviewData] = await Promise.all([
                lawyerService.getLawyerById(id),
                reviewService.getLawyerReviews(id)
            ]);
            setLawyer(lawyerData);
            setReviews(reviewData);
        } catch (err) {
            console.error("Error fetching lawyer profile data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user || !comment.trim()) return;

        setSubmitting(true);
        try {
            await reviewService.addReview({
                lawyerId: id,
                userId: user.uid,
                userName: user.displayName || 'Anonymous Client',
                rating: rating,
                text: comment,
                verified: true
            });

            setComment('');
            setRating(5);
            setShowReviewForm(false);

            // Re-fetch to show new review and updated rating
            await fetchData();
            alert("Review posted successfully! Thank you for your feedback.");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review. Please try again.");
        }
        setSubmitting(false);
    };

    const handleMessageLawyer = () => {
        if (!user) {
            navigate('/login', { state: { from: `/lawyer/${id}` } });
            return;
        }
        navigate(`/messages?lawyerId=${id}`);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: `/lawyer/${id}` } });
            return;
        }
        setSubmitting(true);
        try {
            await appointmentService.bookAppointment({
                lawyerId: id,
                userId: user.uid,
                userName: user.displayName || 'Client',
                lawyerName: lawyer.name,
                date: bookingData.date,
                time: bookingData.time
            });
            alert("Consultation request sent successfully!");
            setShowBookingModal(false);
        } catch (error) {
            alert("Error booking appointment. Please try again.");
        }
        setSubmitting(false);
    };

    if (loading) {
        return <div className="profile-page" style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Loading profile...</h2></div>;
    }

    if (!lawyer) {
        return <div className="profile-page" style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Lawyer not found.</h2><Link to="/search">Back to Search</Link></div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="container">
                    <div className="profile-header__content">
                        <div
                            className="profile-header__avatar"
                            style={{ background: `linear-gradient(135deg, ${lawyer.color}, ${lawyer.color}cc)` }}
                        >
                            {lawyer.initials}
                        </div>
                        <div className="profile-header__info">
                            <h1 className="profile-header__name">
                                {lawyer.name}
                                {lawyer.verified && <FiCheckCircle className="profile-header__verified" title="Verified Attorney" />}
                            </h1>
                            <p className="profile-header__specialty">{lawyer.detailedSpecialty}</p>
                            <div className="profile-header__meta">
                                <span className="profile-header__location"><FiMapPin /> {lawyer.city}, Nepal</span>
                                <span className="profile-header__exp"><FiCalendar /> {lawyer.experience} experience</span>
                            </div>
                        </div>
                        <div className="profile-header__rating">
                            <div className="profile-rating-box">
                                <span className="profile-rating-value">{lawyer.rating?.toFixed(1) || '0.0'}</span>
                                <span className="profile-rating-label">Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="profile-layout">
                    <div className="profile-main">
                        <section className="profile-section">
                            <h2 className="profile-section__title">About {lawyer.name}</h2>
                            <p className="profile-section__text">{lawyer.bio}</p>
                            <div className="profile-tags">
                                {lawyer.languages?.map(lang => (
                                    <span key={lang} className="profile-tag">{lang}</span>
                                ))}
                            </div>
                        </section>

                        <section className="profile-section reviews-section">
                            <div className="reviews-header">
                                <h2 className="profile-section__title">Client Reviews ({reviews.length})</h2>
                                {!showReviewForm && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => user ? setShowReviewForm(true) : navigate('/login')}
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>

                            {showReviewForm && (
                                <form className="review-form" onSubmit={handleReviewSubmit}>
                                    <div className="form-group">
                                        <label>Your Rating</label>
                                        <div className="rating-input">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <FiStar
                                                    key={star}
                                                    className={`star-icon ${rating >= star ? 'star-icon--active' : ''}`}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Your Experience</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tell us about your case and the lawyer's services..."
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="review-form__actions">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => setShowReviewForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'Post Review'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="reviews-list">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <div className="review-card__header">
                                                <div className="review-card__user">
                                                    <div className="user-avatar"><FiUser /></div>
                                                    <div>
                                                        <span className="user-name">{review.userName}</span>
                                                        <span className="review-date">
                                                            {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="review-card__rating">
                                                    <FiStar className="star-icon star-icon--active" />
                                                    <span>{review.rating}.0</span>
                                                </div>
                                            </div>
                                            <p className="review-card__text">{review.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-reviews">
                                        <FiMessageSquare />
                                        <p>No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="profile-sidebar">
                        <div className="contact-card">
                            <h3 className="contact-card__title">Contact Information</h3>
                            <div className="contact-info">
                                <div className="contact-info__item">
                                    <FiPhone /> {lawyer.phone}
                                </div>
                                <div className="contact-info__item">
                                    <FiMail /> {lawyer.email || 'Not available'}
                                </div>
                                <div className="contact-info__item">
                                    <FiGlobe /> {lawyer.website || 'Not available'}
                                </div>
                            </div>
                            <div className="contact-actions">
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '0.8rem' }}
                                    onClick={handleMessageLawyer}
                                >
                                    Message Lawyer
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    style={{ width: '100%' }}
                                    onClick={() => setShowBookingModal(true)}
                                >
                                    Book Consultation
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card p-lg">
                        <button className="modal-close" onClick={() => setShowBookingModal(false)}><FiX /></button>
                        <h2 className="modal-title">Book a Consultation</h2>
                        <p className="modal-subtitle">Request a session with {lawyer.name}</p>

                        <form onSubmit={handleBookingSubmit} className="booking-form mt-md">
                            <div className="form-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Preferred Time</label>
                                <input
                                    type="time"
                                    required
                                    value={bookingData.time}
                                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions mt-lg">
                                <button type="button" className="btn" onClick={() => setShowBookingModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Requesting...' : 'Request Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyerProfile;
