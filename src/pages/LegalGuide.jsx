import React from 'react';
import { useParams } from 'react-router-dom';

const LegalGuide = () => {
    const { id } = useParams();

    return (
        <div className="section container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <h1 className="section-title">Legal Guide</h1>
            <p className="section-subtitle">Read our comprehensive legal resources.</p>
            <div style={{ padding: '2rem', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <p>Full article for guide ID: {id} coming soon...</p>
            </div>
        </div>
    );
};

export default LegalGuide;
