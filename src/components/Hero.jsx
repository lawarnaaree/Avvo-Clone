import React, { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { FaBalanceScale, FaGavel, FaCar, FaUserInjured, FaBriefcase, FaHome } from 'react-icons/fa';
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
                        Find the right lawyer for your situation. Compare attorneys, read reviews,
                        and get free legal advice from top-rated professionals.
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
                        <button className="hero__search-btn btn btn-primary btn-lg">
                            <FiSearch />
                            Find a Lawyer
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="hero__quick-links">
                        <span className="hero__quick-label">Popular:</span>
                        <div className="hero__chips">
                            {quickLinks.map((link, index) => (
                                <a
                                    href={`#${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    key={index}
                                    className="hero__chip"
                                >
                                    {link.icon}
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="hero__stats">
                    <div className="hero__stat">
                        <span className="hero__stat-number">10M+</span>
                        <span className="hero__stat-label">Legal Questions Answered</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number">200K+</span>
                        <span className="hero__stat-label">Verified Lawyers</span>
                    </div>
                    <div className="hero__stat-divider"></div>
                    <div className="hero__stat">
                        <span className="hero__stat-number">97%</span>
                        <span className="hero__stat-label">Client Satisfaction</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
