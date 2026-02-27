import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import './FeaturedLawyers.css';

const lawyers = [
    {
        name: 'Sarah J. Mitchell',
        specialty: 'Family Law Attorney',
        location: 'Kathmandu, Bagmati',
        rating: 10,
        reviews: 127,
        experience: '15 years',
        verified: true,
        initials: 'SM',
        color: '#e91e63',
    },
    {
        name: 'David R. Thompson',
        specialty: 'Criminal Defense Lawyer',
        location: 'Pokhara, Gandaki',
        rating: 9.8,
        reviews: 94,
        experience: '20 years',
        verified: true,
        initials: 'DT',
        color: '#9c27b0',
    },
    {
        name: 'Jennifer K. Lee',
        specialty: 'Personal Injury Attorney',
        location: 'Lalitpur, Bagmati',
        rating: 9.5,
        reviews: 203,
        experience: '12 years',
        verified: true,
        initials: 'JL',
        color: '#2196f3',
    },
    {
        name: 'Michael A. Rodriguez',
        specialty: 'Immigration Lawyer',
        location: 'Bharatpur, Chitwan',
        rating: 9.7,
        reviews: 156,
        experience: '18 years',
        verified: true,
        initials: 'MR',
        color: '#ff9800',
    },
    {
        name: 'Emily S. Watson',
        specialty: 'Bankruptcy Attorney',
        location: 'Biratnagar, Koshi',
        rating: 9.3,
        reviews: 88,
        experience: '10 years',
        verified: true,
        initials: 'EW',
        color: '#4caf50',
    },
    {
        name: 'Robert C. Davis',
        specialty: 'Business Law Attorney',
        location: 'Butwal, Lumbini',
        rating: 9.9,
        reviews: 171,
        experience: '22 years',
        verified: true,
        initials: 'RD',
        color: '#607d8b',
    },
];

const RatingBadge = ({ rating }) => {
    let label = 'Superb';
    let color = '#4caf50';
    if (rating >= 9) { label = 'Superb'; color = '#4caf50'; }
    else if (rating >= 7) { label = 'Excellent'; color = '#8bc34a'; }
    else if (rating >= 5) { label = 'Good'; color = '#ff9800'; }

    return (
        <div className="lawyer-card__rating-badge" style={{ background: color }}>
            <span className="lawyer-card__rating-number">{rating}</span>
            <span className="lawyer-card__rating-label">{label}</span>
        </div>
    );
};

const StarRating = ({ count = 5 }) => (
    <div className="stars">
        {[...Array(5)].map((_, i) => (
            <FaStar key={i} style={{ color: i < count ? '#ff9800' : '#e0e0e0' }} />
        ))}
    </div>
);

const FeaturedLawyers = () => {
    const [scrollIndex, setScrollIndex] = useState(0);
    const visibleCards = 3;
    const maxIndex = Math.max(0, lawyers.length - visibleCards);

    const handlePrev = () => setScrollIndex(Math.max(0, scrollIndex - 1));
    const handleNext = () => setScrollIndex(Math.min(maxIndex, scrollIndex + 1));

    return (
        <section className="featured-lawyers section" id="lawyers">
            <div className="container">
                <div className="featured-lawyers__header">
                    <div>
                        <h2 className="section-title">Featured Attorneys</h2>
                        <p className="section-subtitle">
                            Top-rated lawyers ready to help with your legal needs.
                        </p>
                    </div>
                    <div className="featured-lawyers__nav">
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={handlePrev}
                            disabled={scrollIndex === 0}
                            aria-label="Previous"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={handleNext}
                            disabled={scrollIndex >= maxIndex}
                            aria-label="Next"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <div className="featured-lawyers__track-wrapper">
                    <div
                        className="featured-lawyers__track"
                        style={{ transform: `translateX(-${scrollIndex * (100 / visibleCards)}%)` }}
                    >
                        {lawyers.map((lawyer, index) => (
                            <div key={index} className="lawyer-card">
                                <div className="lawyer-card__top">
                                    <div className="lawyer-card__avatar" style={{ background: `linear-gradient(135deg, ${lawyer.color}, ${lawyer.color}cc)` }}>
                                        {lawyer.initials}
                                    </div>
                                    <RatingBadge rating={lawyer.rating} />
                                </div>

                                <div className="lawyer-card__info">
                                    <h3 className="lawyer-card__name">
                                        {lawyer.name}
                                        {lawyer.verified && <FaCheckCircle className="lawyer-card__verified" />}
                                    </h3>
                                    <p className="lawyer-card__specialty">{lawyer.specialty}</p>
                                    <p className="lawyer-card__location">
                                        <FaMapMarkerAlt />
                                        {lawyer.location}
                                    </p>
                                </div>

                                <div className="lawyer-card__meta">
                                    <div className="lawyer-card__reviews">
                                        <StarRating />
                                        <span>{lawyer.reviews} reviews</span>
                                    </div>
                                    <span className="lawyer-card__experience">{lawyer.experience} exp.</span>
                                </div>

                                <div className="lawyer-card__actions">
                                    <button className="btn btn-primary" style={{ flex: 1 }}>View Profile</button>
                                    <button className="btn btn-secondary" style={{ flex: 1 }}>Contact</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedLawyers;
