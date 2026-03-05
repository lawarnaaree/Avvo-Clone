import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { lawyerService } from '../services/lawyerService';
import './FeaturedLawyers.css';

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
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const trackRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLawyers = async () => {
            setLoading(true);
            try {
                const data = await lawyerService.getAllLawyers();
                setLawyers(data.slice(0, 10));
            } catch (err) {
                console.error("Failed to fetch featured lawyers:", err);
            }
            setLoading(false);
        };
        fetchLawyers();
    }, []);

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
    }, [lawyers]); // Re-run when lawyers load to check scroll width

    const scrollBy = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('.lawyer-card')?.offsetWidth || 350;
        const gap = 24;
        el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
    };

    // Drag-to-scroll handlers
    const handleMouseDown = (e) => {
        if (loading) return;
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
                            Top-rated lawyers ready to help with your legal needs. Scroll to explore Find Lawyer Nepal attorneys →
                        </p>
                    </div>
                    <div className="featured-lawyers__nav">
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={() => scrollBy(-1)}
                            disabled={!canScrollLeft || loading}
                            aria-label="Previous"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            className="featured-lawyers__nav-btn"
                            onClick={() => scrollBy(1)}
                            disabled={!canScrollRight || loading}
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
                    style={{ cursor: loading ? 'default' : 'grab' }}
                >
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-gray-400)' }}>
                            <h3>Loading attorneys...</h3>
                        </div>
                    ) : lawyers.length > 0 ? (
                        lawyers.map((lawyer) => (
                            <div key={lawyer.id} className="lawyer-card glass-card">
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
                                        {lawyer.city || lawyer.location}
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
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                                    >
                                        View Profile
                                    </button>
                                    <button className="btn btn-secondary" style={{ flex: 1 }}>Contact</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
                            <p>No featured lawyers found.</p>
                        </div>
                    )}
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
