import React from 'react';

const AskLawyer = () => {
    return (
        <div className="section container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <h1 className="section-title">Ask a Lawyer — For Free</h1>
            <p className="section-subtitle">Get legal advice from qualified attorneys in Nepal.</p>
            <div style={{ padding: '2rem', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                    <textarea
                        className="qa-section__ask-input"
                        placeholder="What is your legal question?"
                        rows="5"
                        style={{ border: '2px solid var(--color-gray-200)', borderRadius: 'var(--border-radius-md)', padding: '1rem' }}
                    ></textarea>
                    <button type="button" className="btn btn-primary">Submit Question</button>
                </form>
            </div>
        </div>
    );
};

export default AskLawyer;
