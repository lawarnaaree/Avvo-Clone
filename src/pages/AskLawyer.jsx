import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { qaService } from '../services/qaService';
import { FiAlertCircle, FiCheckCircle, FiShield, FiZap, FiHelpCircle } from 'react-icons/fi';
import './AskLawyer.css';

const AskLawyer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please sign in to ask a question.');
            return;
        }
        if (question.trim().length < 20) {
            setError('Please provide more details (at least 20 characters).');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await qaService.postQuestion({
                question,
                category,
                asker: user.displayName || user.email.split('@')[0],
                userId: user.uid
            });
            setSubmitted(true);
            setTimeout(() => navigate('/'), 3500);
        } catch (err) {
            setError('Failed to post question. Please try again.');
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="ask-lawyer-page">
                <div className="container success-page">
                    <div className="success-icon-wrapper">
                        <FiCheckCircle />
                    </div>
                    <h1 className="section-title">Question Received!</h1>
                    <p className="section-subtitle">
                        Your question has been sent to our network of attorneys in Nepal.
                        You'll receive an email notification when someone answers.
                    </p>
                    <div className="animate-fade-in" style={{ marginTop: '2rem', color: 'var(--color-gray-500)' }}>
                        <p>Redirecting you back to home...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ask-lawyer-page">
            <div className="container animate-fade-in-up">
                <div className="ask-lawyer-container">
                    {/* Left Side: Info & Benefits */}
                    <div className="ask-lawyer__info">
                        <span className="ask-lawyer__badge">Legal Advice</span>
                        <h1 className="ask-lawyer__title">Ask a Lawyer — For Free</h1>
                        <p className="ask-lawyer__description">
                            Get clear, actionable answers from qualified attorneys in Nepal.
                            Our network covers everything from family disputes to business law.
                        </p>

                        <div className="ask-lawyer__benefits">
                            <div className="benefit-item">
                                <div className="benefit-item__icon">
                                    <FiZap />
                                </div>
                                <div className="benefit-item__text">
                                    Faster answers than searching alone
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-item__icon">
                                    <FiShield />
                                </div>
                                <div className="benefit-item__text">
                                    100% Private and Anonymous
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-item__icon">
                                    <FiHelpCircle />
                                </div>
                                <div className="benefit-item__text">
                                    Reviewed by local Nepali experts
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Card */}
                    <div className="ask-lawyer__card">
                        {!user && (
                            <div className="auth-warning">
                                <FiAlertCircle style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <strong>Authentication Required</strong><br />
                                    Please <Link to="/login" style={{ textDecoration: 'underline' }}>Sign In</Link> or create an account to post your question.
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Legal Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-select"
                                    disabled={!user}
                                >
                                    <option value="General">General Legal</option>
                                    <option value="Family Law">Family Law</option>
                                    <option value="Criminal Defense">Criminal Defense</option>
                                    <option value="Property Law">Property Law</option>
                                    <option value="Business Law">Business Law</option>
                                    <option value="Employment">Employment Law</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Describe Your Situation</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="form-textarea"
                                    placeholder="Example: How do I register a new business in Kathmandu? What are the required documents?"
                                    rows="8"
                                    disabled={!user}
                                ></textarea>
                                {error && (
                                    <div className="error-message">
                                        <FiAlertCircle />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !user}
                                className="btn btn-primary btn-submit"
                            >
                                {loading ? 'Sending Question...' : 'Submit Question'}
                            </button>

                            <p className="form-tip">
                                attorneys typically respond within 24-48 hours.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskLawyer;
