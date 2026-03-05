import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, className = '' }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
        borderRadius: borderRadius || 'var(--border-radius-sm)',
    };

    return (
        <div
            className={`skeleton-base ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
