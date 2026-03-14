import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { reviewService } from '../services/reviewService';
import './ReviewsSection.css';

const ReviewsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const data = await reviewService.getAllReviews();
            setReviews(data);
            setLoading(false);
        };
        fetchReviews();
    }, []);

    return (
        <section className="reviews-section section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">What Our Users Say</h2>
                    <p className="section-subtitle mx-auto">
                        Join millions of people who have found the right lawyer through Find Lawyer Nepal.
                    </p>
                </div>

                <div className="reviews-section__grid">
                    {loading ? (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <h3>Loading reviews...</h3>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={review.id || index} className="review-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <FaQuoteLeft className="review-card__quote-icon" />
                                <div className="stars review-card__stars">
                                    {[...Array(review.rating || 5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <p className="review-card__text">{review.text}</p>
                                <div className="review-card__author">
                                    <div className="review-card__avatar" style={{ background: review.color || '#4f46e5' }}>
                                        {(review.userName || review.name || 'A').charAt(0)}
                                    </div>
                                    <div>
                                        <span className="review-card__name">{review.userName || review.name || 'Anonymous'}</span>
                                        <span className="review-card__location">{review.location || 'Nepal'}</span>
                                    </div>
                                    {(review.type || review.specialty) && (
                                        <span className="review-card__type" style={{ background: `${review.color || '#4f46e5'}15`, color: review.color || '#4f46e5' }}>
                                            {review.type || review.specialty}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p>No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
