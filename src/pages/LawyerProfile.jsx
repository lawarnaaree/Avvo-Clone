import React from 'react';
import { useParams } from 'react-router-dom';

const LawyerProfile = () => {
    const { id } = useParams();

    return (
        <div className="section container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <h1 className="section-title">Lawyer Profile</h1>
            <p className="section-subtitle">Viewing profile for lawyer ID: {id}</p>
            <div style={{ padding: '2rem', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <p>Full profile details for Lawarna Aree coming soon...</p>
            </div>
        </div>
    );
};

export default LawyerProfile;
