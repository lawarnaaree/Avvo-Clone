import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { FaBalanceScale, FaGavel, FaCar, FaUserInjured, FaBriefcase, FaHome } from 'react-icons/fa';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../backend/firebase';
import './Hero.css';

const quickLinks = [
    { icon: <FaBalanceScale />, label: 'Family Law' },
    { icon: <FaGavel />, label: 'Criminal Defense' },
    { icon: <FaCar />, label: 'DUI/DWI' },
    { icon: <FaUserInjured />, label: 'Personal Injury' },
    { icon: <FaBriefcase />, label: 'Business Law' },
    { icon: <FaHome />, label: 'Real Estate' },
];

const Hero = () => {
    const [issue, setIssue] = useState('');
    const [location, setLocation] = useState('');
    const [stats, setStats] = useState({ questions: 0, lawyers: 0, satisfaction: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [qSnap, lSnap, rSnap] = await Promise.all([
                    getCountFromServer(collection(db, 'questions')),
                    getCountFromServer(collection(db, 'lawyers')),
                    getCountFromServer(collection(db, 'reviews'))
                ]);
                const questionCount = qSnap.data().count;
                const lawyerCount = lSnap.data().count;
                const reviewCount = rSnap.data().count;
                setStats({
                    questions: questionCount,
                    lawyers: lawyerCount,
                    satisfaction: reviewCount > 0 ? 98 : 0
                });
            } catch (err) {
                console.error('Error fetching hero stats:', err);
            }
        };
        fetchStats();
    }, []);

    const handleSearch = () => {
        navigate(`/search?issue=${encodeURIComponent(issue)}&location=${encodeURIComponent(location)}`);
    };

    return (
        <section className="hero">
            {/* Background decoration */}
            <div className="hero__bg-decoration">
                <div className="hero__bg-circle hero__bg-circle--1"></div>
                <div className="hero__bg-circle hero__bg-circle--2"></div>
                <div className="hero__bg-circle hero__bg-circle--3"></div>
            </div>

            <div className="hero__container container">
                <div className="hero__content">
                    <h1 className="hero__title">
                        Need Legal Help?
                        <span className="hero__title-accent"> We've Got You Covered</span>
                    </h1>
                    <p className="hero__subtitle">
                        Find the right lawyer for your situation through Find Lawyer Nepal. Compare top-rated attorneys, read verified reviews,
                        and get free legal advice from professionals.
                    </p>

                    {/* Search Box */}
                    <div className="hero__search-box">
                        <div className="hero__search-field">
                            <FiSearch className="hero__search-icon" />
                            <input
                                type="text"
                                placeholder="What legal issue do you need help with?"
                                value={issue}
                                onChange={(e) => setIssue(e.target.value)}
                                className="hero__search-input"
                            />
                        </div>
                        <div className="hero__search-divider"></div>
                        <div className="hero__search-field">
                            <FiMapPin className="hero__search-icon" />
                            <input
                                type="text"
                                placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="hero__search-input"
                            />
                        </div>
                        <button
                            className="hero__search-btn btn btn-primary btn-lg"
                            onClick={handleSearch}
                        >
                            <FiSearch />
                            Find a Lawyer
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="hero__quick-links">
                        <span className="hero__quick-label">Popular:</span>
                        <div className="hero__chips">
                            {quickLinks.map((link, index) => (
                                <Link
                                    to={`/search?topic=${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    key={index}
                                    className="hero__chip"
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="hero__stats">
                    <div className="hero__stat">
                        <span className="hero__stat-number">{stats.questions}</span>
                        <span className="hero__stat-label">Legal Questions Answered</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number">{stats.lawyers}</span>
                        <span className="hero__stat-label">Verified Lawyers</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number">{stats.satisfaction > 0 ? `${stats.satisfaction}%` : '—'}</span>
                        <span className="hero__stat-label">Client Satisfaction</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

