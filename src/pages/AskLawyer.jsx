import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { qaService } from '../services/qaService';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
        if (question.length < 20) {
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
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError('Failed to post question. Please try again.');
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="section container" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
                <FiCheckCircle style={{ fontSize: '4rem', color: 'var(--color-success)', marginBottom: '1rem' }} />
                <h1 className="section-title">Question Submitted!</h1>
                <p className="section-subtitle">Attorneys will be notified and you'll receive answers soon.</p>
                <p>Redirecting you to home page...</p>
            </div>
        );
    }

    return (
        <div className="section container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <h1 className="section-title">Ask a Lawyer — For Free</h1>
            <p className="section-subtitle">Get legal advice from qualified attorneys in Nepal.</p>

            <div style={{
                padding: '2.5rem',
                background: 'var(--color-white)',
                borderRadius: 'var(--border-radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '700px',
                margin: '0 auto',
                border: '1px solid var(--color-gray-100)'
            }}>
                {!user && (
                    <div style={{
                        padding: '1rem',
                        background: '#fff3cd',
                        color: '#856404',
                        borderRadius: 'var(--border-radius-md)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <FiAlertCircle />
                        <span>You must <Link to="/login" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Sign In</Link> to post a question.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: 'var(--border-radius-md)',
                                border: '1px solid var(--color-gray-300)',
                                background: 'var(--color-white)'
                            }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Your Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="form-control"
                            placeholder="Example: How do I register a new business in Kathmandu?"
                            rows="6"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid var(--color-gray-300)',
                                borderRadius: 'var(--border-radius-md)',
                                fontSize: '1rem'
                            }}
                        ></textarea>
                    </div>

                    {error && <p style={{ color: 'var(--color-error)', fontSize: '0.9rem', margin: '0' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !user}
                        className="btn btn-primary"
                        style={{ padding: '1rem', fontSize: '1.1rem' }}
                    >
                        {loading ? 'Submitting...' : 'Submit Question'}
                    </button>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', textAlign: 'center' }}>
                        Typical response time is 24 hours. Your question will be posted publicly.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AskLawyer;
