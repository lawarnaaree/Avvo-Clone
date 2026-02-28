import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiBookOpen } from 'react-icons/fi';
import { guideService } from '../services/guideService';
import './LegalGuides.css';

const LegalGuides = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            try {
                const data = await guideService.getAllGuides();
                setGuides(data.slice(0, 6)); // Limit to 6 for the home page
            } catch (err) {
                console.error("Failed to fetch guides:", err);
            }
            setLoading(false);
        };
        fetchGuides();
    }, []);

    return (
        <section className="legal-guides section" id="research">
            <div className="container">
                <div className="legal-guides__header">
                    <div>
                        <h2 className="section-title">Nepal Legal Guides & Resources</h2>
                        <p className="section-subtitle">
                            Free legal guides written by Nepali attorneys to help you understand your rights under the local law.
                        </p>
                    </div>
                    <Link to="/search?type=guides" className="legal-guides__view-all">
                        View All Guides <FiArrowRight />
                    </Link>
                </div>

                <div className="legal-guides__grid">
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: 'var(--color-gray-500)' }}>
                            <h3>Loading legal guides...</h3>
                        </div>
                    ) : guides.length > 0 ? (
                        guides.map((guide, index) => (
                            <Link
                                to={`/guide/${guide.id}`}
                                key={guide.id || index}
                                className="guide-card"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="guide-card__category" style={{ color: guide.color }}>
                                    <FiBookOpen />
                                    {guide.category}
                                </div>
                                <h3 className="guide-card__title">{guide.title}</h3>
                                <p className="guide-card__excerpt">{guide.excerpt}</p>
                                <div className="guide-card__footer">
                                    <span className="guide-card__read-time">
                                        <FiClock /> {guide.readTime}
                                    </span>
                                    <span className="guide-card__read-more" style={{ color: guide.color }}>
                                        Read More <FiArrowRight />
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                            <p>No guides found. Try seeding the database!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LegalGuides;
