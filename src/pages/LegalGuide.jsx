import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guideService } from '../services/guideService';
import { FiClock, FiArrowLeft, FiShare2, FiBookmark } from 'react-icons/fi';
import './LegalGuide.css';

const LegalGuide = () => {
    const { id } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            try {
                const data = await guideService.getGuideById(id);
                setGuide(data);
            } catch (err) {
                console.error("Failed to fetch guide:", err);
            }
            setLoading(false);
        };
        fetchGuide();
    }, [id]);

    if (loading) {
        return (
            <div className="guide-page" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="container">
                    <h2>Loading article...</h2>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="guide-page" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
                <div className="container">
                    <h2>Article not found.</h2>
                    <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="guide-page">
            <div className="container">
                <Link to="/" className="guide-back-link"><FiArrowLeft /> Back to Home</Link>

                <header className="guide-header">
                    <div className="guide-category" style={{ color: guide.color }}>{guide.category}</div>
                    <h1 className="guide-title">{guide.title}</h1>
                    <div className="guide-meta">
                        <span className="guide-read-time"><FiClock /> {guide.readTime}</span>
                        <div className="guide-actions">
                            <button className="guide-action-btn"><FiShare2 /> Share</button>
                            <button className="guide-action-btn"><FiBookmark /> Save</button>
                        </div>
                    </div>
                </header>

                <div className="guide-content">
                    <p className="guide-intro">{guide.excerpt}</p>
                    <div className="guide-body">
                        <h3>Overview</h3>
                        <p>In Nepal, {guide.category.toLowerCase()} is governed by specific regulations that ensure fair treatment and protection of rights. Whether you are dealing with a personal matter or a business dispute, understanding these laws is crucial for achieving a favorable outcome.</p>

                        <h3>Key Provisions in Nepali Law</h3>
                        <p>The Muluki Civil Code (2074) and subsequent legal frameworks provide the foundation for {guide.category} in our jurisdiction. When exploring issues related to "{guide.title}", it is important to keep the following legal principles in mind:</p>
                        <ul>
                            <li><strong>Due Process</strong>: Every individual is entitled to a fair hearing and legal representation.</li>
                            <li><strong>Transparency</strong>: Legal transactions, especially in property and business, must be documented and registered with the appropriate authorities (e.g., Malpot Office for land).</li>
                            <li><strong>Equality</strong>: Laws are applied equally to all citizens regardless of status.</li>
                        </ul>

                        <p>For more specific details on the article content, we recommend consulting the official gazette or reaching out to a licensed Advocate of the Supreme Court of Nepal.</p>

                        <div className="guide-cta-box">
                            <h4>Need Professional Legal Guidance?</h4>
                            <p>Legal procedures in Nepal can be complex. Don't navigate them alone—connect with an expert attorney who specializes in {guide.category.toLowerCase()}.</p>
                            <Link to="/search" className="btn btn-primary">Find a Lawyer in Nepal</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalGuide;
