import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiBookOpen } from 'react-icons/fi';
import './LegalGuides.css';

const guides = [
    {
        category: 'Family Law',
        title: 'Complete Guide to Divorce in Nepal: Laws, Process, and Costs',
        excerpt: 'A comprehensive overview of the divorce process in Nepal, including filing requirements under the Muluki Civil Code, property division, and child custody.',
        readTime: '12 min read',
        color: '#e91e63',
    },
    {
        category: 'Criminal Law',
        title: 'Understanding Your Rights if You\'re Arrested: A Step-by-Step Guide',
        excerpt: 'Know your constitutional rights during an arrest, from Miranda warnings to the right to an attorney, and how to protect yourself.',
        readTime: '8 min read',
        color: '#9c27b0',
    },
    {
        category: 'Personal Injury',
        title: 'What to Do After a Car Accident: A Legal Checklist',
        excerpt: 'Essential steps to take immediately after a car accident to protect your health, your rights, and your potential insurance claim.',
        readTime: '6 min read',
        color: '#ff9800',
    },
    {
        category: 'Property Law',
        title: 'Buying Land in Nepal: Legal Procedures and Requirements',
        excerpt: 'A detailed walkthrough of the land purchase process in Nepal, including title verification, registration at the Malpot Office, and tax implications.',
        readTime: '15 min read',
        color: '#2196f3',
    },
    {
        category: 'Estate Planning',
        title: 'Wills vs. Trusts: Which Is Right for You?',
        excerpt: 'Compare the advantages and disadvantages of wills and trusts to determine the best estate planning strategy for your situation.',
        readTime: '10 min read',
        color: '#795548',
    },
    {
        category: 'Business',
        title: 'LLC vs. Corporation: Choosing the Right Business Structure',
        excerpt: 'Understand the key differences between LLCs and corporations, including liability protection, taxes, and management flexibility.',
        readTime: '9 min read',
        color: '#607d8b',
    },
];

const LegalGuides = () => {
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
                    {guides.map((guide, index) => (
                        <Link to={`/guide/${index + 1}`} key={index} className="guide-card" style={{ animationDelay: `${index * 0.08}s` }}>
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LegalGuides;
