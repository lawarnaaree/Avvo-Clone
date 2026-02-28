import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lawyerService } from '../services/lawyerService';
import { FiMapPin, FiStar, FiCheckCircle, FiPhone, FiMail, FiGlobe, FiCalendar } from 'react-icons/fi';
import './LawyerProfile.css';

const LawyerProfile = () => {
    const { id } = useParams();
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLawyer = async () => {
            setLoading(true);
            const data = await lawyerService.getLawyerById(id);
            setLawyer(data);
            setLoading(false);
        };
        fetchLawyer();
    }, [id]);

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
                                <span className="profile-rating-value">{lawyer.rating}.0</span>
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

                        <section className="profile-section">
                            <h2 className="profile-section__title">Practice Areas</h2>
                            <ul className="profile-list">
                                <li>{lawyer.specialty}</li>
                                <li>Litigation & Dispute Resolution</li>
                                <li>Legal Consulting</li>
                            </ul>
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
                                    <FiMail /> contact@lawarna.law
                                </div>
                                <div className="contact-info__item">
                                    <FiGlobe /> www.lawarnalawoffice.com.np
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Message Lawyer
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default LawyerProfile;
