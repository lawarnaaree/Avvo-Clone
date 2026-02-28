import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { lawyers } from '../data/lawyers';
import { FiMapPin, FiStar, FiFilter, FiCheckCircle, FiSearch } from 'react-icons/fi';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const issueQuery = searchParams.get('issue') || '';
    const locationQuery = searchParams.get('location') || '';
    const topicQuery = searchParams.get('topic') || '';
    const typeQuery = searchParams.get('type') || '';

    // Advanced filtering logic
    const filteredLawyers = useMemo(() => {
        return lawyers.filter(lawyer => {
            const matchesIssue = !issueQuery ||
                lawyer.specialty.toLowerCase().includes(issueQuery.toLowerCase()) ||
                lawyer.detailedSpecialty.toLowerCase().includes(issueQuery.toLowerCase());

            const matchesLocation = !locationQuery ||
                lawyer.city.toLowerCase().includes(locationQuery.toLowerCase());

            const matchesTopic = !topicQuery ||
                lawyer.specialty.toLowerCase().replace(/\s+/g, '-').includes(topicQuery.toLowerCase());

            return matchesIssue && matchesLocation && matchesTopic;
        });
    }, [issueQuery, locationQuery, topicQuery]);

    // Grouping for sidebar filters
    const cities = [...new Set(lawyers.map(l => l.city))];
    const specialties = [...new Set(lawyers.map(l => l.specialty))];

    const toggleFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (newParams.get(key) === value) {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="search-results-page">
            <div className="container">
                <div className="search-results__layout">
                    {/* Sidebar Filters */}
                    <aside className="search-results__sidebar">
                        <div className="filter-group">
                            <span className="filter-group__title"><FiFilter /> Cities</span>
                            <ul className="filter-list">
                                {cities.map(city => (
                                    <li key={city} className="filter-item">
                                        <button
                                            className={`filter-link ${locationQuery.toLowerCase() === city.toLowerCase() ? 'filter-link--active' : ''}`}
                                            onClick={() => toggleFilter('location', city)}
                                        >
                                            {city}
                                            <span className="filter-count">
                                                ({lawyers.filter(l => l.city === city).length})
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-group">
                            <span className="filter-group__title"><FiSearch /> Practice Areas</span>
                            <ul className="filter-list">
                                {specialties.map(spec => (
                                    <li key={spec} className="filter-item">
                                        <button
                                            className={`filter-link ${issueQuery.toLowerCase() === spec.toLowerCase() ? 'filter-link--active' : ''}`}
                                            onClick={() => toggleFilter('issue', spec)}
                                        >
                                            {spec}
                                            <span className="filter-count">
                                                ({lawyers.filter(l => l.specialty === spec).length})
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Results Content */}
                    <main className="search-results__content">
                        <div className="search-results__header">
                            <h1 className="search-results__title">
                                {issueQuery || topicQuery || 'All Lawyers'}
                                {locationQuery ? ` in ${locationQuery}` : ' in Nepal'}
                            </h1>
                            <p className="search-results__count">
                                Found {filteredLawyers.length} top-rated attorneys
                            </p>
                        </div>

                        {filteredLawyers.length > 0 ? (
                            <div className="results-list">
                                {filteredLawyers.map(lawyer => (
                                    <div key={lawyer.id} className="result-card">
                                        <div
                                            className="result-card__avatar"
                                            style={{ background: `linear-gradient(135deg, ${lawyer.color}, ${lawyer.color}cc)` }}
                                        >
                                            {lawyer.initials}
                                        </div>

                                        <div className="result-card__info">
                                            <h3 className="result-card__title">
                                                {lawyer.name}
                                                {lawyer.verified && <FiCheckCircle className="result-card__verified" />}
                                            </h3>
                                            <p className="result-card__specialty">{lawyer.detailedSpecialty}</p>
                                            <div className="result-card__location">
                                                <FiMapPin /> {lawyer.city}, Nepal
                                            </div>
                                            <p className="result-card__bio">{lawyer.bio}</p>
                                        </div>

                                        <div className="result-card__meta">
                                            <div className="result-card__rating">
                                                <span className="result-card__rating-value">{lawyer.rating}.0</span>
                                                <span className="result-card__rating-label">Find Lawyer Nepal Rating</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                                <Link to={`/lawyer/${lawyer.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <h2 className="no-results__title">No lawyers found matching your criteria.</h2>
                                <p>Try adjusting your filters or searching in a different city.</p>
                                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSearchParams({})}>
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
