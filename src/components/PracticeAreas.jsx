import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaBalanceScale, FaGavel, FaCar, FaUserInjured, FaBriefcase, FaHome,
    FaPassport, FaFileContract, FaMoneyBillWave, FaUserTie, FaLightbulb, FaCalculator
} from 'react-icons/fa';
import './PracticeAreas.css';

const areas = [
    { icon: <FaBalanceScale />, title: 'Family Law', desc: 'Divorce, custody, child support & adoption', color: '#e91e63' },
    { icon: <FaGavel />, title: 'Criminal Defense', desc: 'Felonies, misdemeanors & drug charges', color: '#9c27b0' },
    { icon: <FaCar />, title: 'DUI / DWI', desc: 'Drunk driving defense & license issues', color: '#f44336' },
    { icon: <FaUserInjured />, title: 'Personal Injury', desc: 'Car accidents, medical malpractice & slips', color: '#ff9800' },
    { icon: <FaMoneyBillWave />, title: 'Bankruptcy', desc: 'Chapter 7, Chapter 13 & debt relief', color: '#4caf50' },
    { icon: <FaPassport />, title: 'Immigration', desc: 'Visas, green cards & deportation defense', color: '#2196f3' },
    { icon: <FaFileContract />, title: 'Estate Planning', desc: 'Wills, trusts & probate matters', color: '#795548' },
    { icon: <FaBriefcase />, title: 'Business Law', desc: 'Contracts, LLCs & corporate disputes', color: '#607d8b' },
    { icon: <FaUserTie />, title: 'Employment Law', desc: 'Wrongful termination & discrimination', color: '#00bcd4' },
    { icon: <FaHome />, title: 'Real Estate', desc: 'Property disputes, closings & landlord issues', color: '#8bc34a' },
    { icon: <FaLightbulb />, title: 'Intellectual Property', desc: 'Patents, trademarks & copyrights', color: '#ff5722' },
    { icon: <FaCalculator />, title: 'Tax Law', desc: 'Tax disputes, audits & IRS issues', color: '#3f51b5' },
];

const PracticeAreas = () => {
    return (
        <section className="practice-areas section" id="find">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Browse by Practice Area</h2>
                    <p className="section-subtitle mx-auto">
                        Find experienced attorneys across 100+ legal specialties. Select your area of need to get started.
                    </p>
                </div>

                <div className="practice-areas__grid">
                    {areas.map((area, index) => (
                        <Link
                            to={`/search?topic=${area.title.toLowerCase().replace(/\s+/g, '-')}`}
                            key={index}
                            className="practice-areas__card"
                            style={{ '--card-accent': area.color, animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="practice-areas__icon" style={{ background: `${area.color}15`, color: area.color }}>
                                {area.icon}
                            </div>
                            <h3 className="practice-areas__title">{area.title}</h3>
                            <span className="practice-areas__arrow">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PracticeAreas;
