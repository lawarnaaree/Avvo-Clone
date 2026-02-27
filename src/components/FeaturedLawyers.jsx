import React, { useRef, useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import './FeaturedLawyers.css';

const lawyers = [
    {
        name: 'Lawarna Aree',
        specialty: 'Family Law Attorney',
        location: 'Kathmandu, Bagmati',
        rating: 10,
        reviews: 127,
        experience: '15 years',
        verified: true,
        initials: 'LA',
        color: '#e91e63',
    },
    {
        name: 'Lawarna Aree',
        specialty: 'Criminal Defense Lawyer',
        location: 'Pokhara, Gandaki',
        rating: 9.8,
        reviews: 94,
        experience: '20 years',
        verified: true,
        initials: 'LA',
        color: '#9c27b0',
    },
    {
        name: 'Lawarna Aree',
        specialty: 'Personal Injury Attorney',
        location: 'Lalitpur, Bagmati',
        rating: 9.5,
        reviews: 203,
        experience: '12 years',
        verified: true,
        initials: 'LA',
        color: '#2196f3',
    },
    {
        name: 'Lawarna Aree',
        specialty: 'Immigration Lawyer',
        location: 'Bharatpur, Chitwan',
        rating: 9.7,
        reviews: 156,
        experience: '18 years',
        verified: true,
        initials: 'LA',
        color: '#ff9800',
    },
    {
        name: 'Lawarna Aree',
        specialty: 'Bankruptcy Attorney',
        location: 'Biratnagar, Koshi',
        rating: 9.3,
        reviews: 88,
        experience: '10 years',
        verified: true,
        initials: 'LA',
        color: '#4caf50',
    },
    {
        name: 'Lawarna Aree',
        specialty: 'Business Law Attorney',
        location: 'Butwal, Lumbini',
        rating: 9.9,
        reviews: 171,
        experience: '22 years',
        verified: true,
        initials: 'LA',
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
    const trackRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Drag-to-scroll state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);

    const updateScrollButtons = () => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons, { passive: true });
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, []);

    const scrollBy = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('.lawyer-card')?.offsetWidth || 350;
        const gap = 24;
        el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
    };

    // Drag-to-scroll handlers
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX;
        scrollLeftStart.current = trackRef.current.scrollLeft;
        trackRef.current.style.cursor = 'grabbing';
        trackRef.current.style.scrollSnapType = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const dx = e.pageX - startX.current;
        trackRef.current.scrollLeft = scrollLeftStart.current - dx;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (trackRef.current) {
            trackRef.current.style.cursor = 'grab';
            trackRef.current.style.scrollSnapType = 'x mandatory';
        }
    };

    return (
        <section className="featured-lawyers section" id="lawyers">
            <div className="container">
                <div className="featured-lawyers__header">
                    <div>
                        <h2 className="section-title">Featured Attorneys</h2>
                        <p className="section-subtitle">
                            Top-rated lawyers ready to help with your legal needs. Scroll to explore →
                        </p>
                    </div>
                    <div className="featured-lawyers__nav">
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={() => scrollBy(-1)}
                            disabled={!canScrollLeft}
                            aria-label="Previous"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={() => scrollBy(1)}
                            disabled={!canScrollRight}
                            aria-label="Next"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <div
                    className="featured-lawyers__track"
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
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

                {/* Scroll indicator dots */}
                <div className="featured-lawyers__dots">
                    {lawyers.map((_, i) => (
                        <span key={i} className="featured-lawyers__dot"></span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedLawyers;
