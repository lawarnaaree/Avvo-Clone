import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './ReviewsSection.css';

const reviews = [
    {
        name: 'Amanda T.',
        location: 'Kathmandu, Bagmati',
        rating: 5,
        text: 'I was terrified about my custody case, but the attorney I found through Avvo was incredible. She guided me through every step and we got a great outcome. I can\'t recommend this platform enough!',
        type: 'Family Law',
        color: '#e91e63',
    },
    {
        name: 'Marcus J.',
        location: 'Bhaktapur, Bagmati',
        rating: 5,
        text: 'After being charged with a DUI, I didn\'t know where to turn. Avvo connected me with an amazing defense attorney who got my charges reduced. The rating system made it easy to choose.',
        type: 'DUI Defense',
        color: '#9c27b0',
    },
    {
        name: 'Rachel K.',
        location: 'Pokhara, Gandaki',
        rating: 5,
        text: 'The free Q&A section helped me understand my rights as a tenant before I even hired a lawyer. When I did need one, I found the perfect real estate attorney in minutes.',
        type: 'Real Estate',
        color: '#4caf50',
    },
    {
        name: 'David P.',
        location: 'Lalitpur, Bagmati',
        rating: 5,
        text: 'Starting my business was stressful enough without worrying about legal issues. My Avvo-recommended business attorney made the LLC formation process seamless and affordable.',
        type: 'Business Law',
        color: '#2196f3',
    },
];

const ReviewsSection = () => {
    return (
        <section className="reviews-section section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">What Our Users Say</h2>
                    <p className="section-subtitle mx-auto">
                        Join millions of people who have found the right lawyer through Avvo.
                    </p>
                </div>

                <div className="reviews-section__grid">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <FaQuoteLeft className="review-card__quote-icon" />
                            <div className="stars review-card__stars">
                                {[...Array(review.rating)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <p className="review-card__text">{review.text}</p>
                            <div className="review-card__author">
                                <div className="review-card__avatar" style={{ background: review.color }}>
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <span className="review-card__name">{review.name}</span>
                                    <span className="review-card__location">{review.location}</span>
                                </div>
                                <span className="review-card__type" style={{ background: `${review.color}15`, color: review.color }}>
                                    {review.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
