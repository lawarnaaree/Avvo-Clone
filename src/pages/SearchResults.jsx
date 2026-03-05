import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { lawyerService } from '../services/lawyerService';
import Skeleton from '../components/Skeleton';
import { FiMapPin, FiStar, FiFilter, FiCheckCircle, FiSearch } from 'react-icons/fi';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('rating');

    const issueQuery = searchParams.get('issue') || '';
    const locationQuery = searchParams.get('location') || '';
    const topicQuery = searchParams.get('topic') || '';

    useEffect(() => {
        const fetchLawyers = async () => {
            setLoading(true);
            const data = await lawyerService.getAllLawyers();
            setLawyers(data);
            setLoading(false);
        };
        fetchLawyers();
    }, []);

    // Advanced filtering and sorting logic
    const filteredLawyers = useMemo(() => {
        let results = lawyers.filter(lawyer => {
            const searchTerm = (issueQuery || topicQuery).toLowerCase();
            const matchesKeyword = !searchTerm ||
                lawyer.specialty.toLowerCase().includes(searchTerm) ||
                lawyer.detailedSpecialty.toLowerCase().includes(searchTerm) ||
                lawyer.name.toLowerCase().includes(searchTerm) ||
                lawyer.bio.toLowerCase().includes(searchTerm);

            const matchesLocation = !locationQuery ||
                lawyer.city.toLowerCase().includes(locationQuery.toLowerCase());

            return matchesKeyword && matchesLocation;
        });

        // Apply Sorting
        return [...results].sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
            if (sortBy === 'newest') return b.createdAt?.seconds - a.createdAt?.seconds;
            return 0;
        });
    }, [issueQuery, locationQuery, topicQuery, lawyers, sortBy]);

    const cities = useMemo(() => [...new Set(lawyers.map(l => l.city))], [lawyers]);
    const specialties = useMemo(() => [...new Set(lawyers.map(l => l.specialty))], [lawyers]);

    const toggleFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (newParams.get(key)?.toLowerCase() === value.toLowerCase()) {
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
                    <aside className="search-results__sidebar glass-card">
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
                        <div className="search-results__header glass-card" style={{ padding: 'var(--space-md)', borderRadius: 'var(--border-radius-lg)', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <h1 className="search-results__title">
                                    {issueQuery || topicQuery || 'All Lawyers'}
                                    {locationQuery ? ` in ${locationQuery}` : ' in Nepal'}
                                </h1>
                                <p className="search-results__count">
                                    {loading ? <Skeleton width="150px" /> : `Found ${filteredLawyers.length} top-rated attorneys`}
                                </p>
                            </div>

                            {!loading && (
                                <div className="search-results__sort">
                                    <label>Sort by:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="rating">Top Rated</option>
                                        <option value="reviews">Most Reviews</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="results-list">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="result-card glass-card">
                                        <Skeleton height="80px" width="80px" borderRadius="12px" />
                                        <div className="result-card__info" style={{ flex: 1 }}>
                                            <Skeleton height="24px" width="40%" className="mb-sm" />
                                            <Skeleton height="14px" width="20%" className="mb-sm" />
                                            <Skeleton height="14px" width="30%" className="mb-sm" />
                                            <Skeleton height="14px" width="90%" />
                                        </div>
                                        <div className="result-card__meta">
                                            <Skeleton height="40px" width="60px" borderRadius="8px" className="mb-sm" />
                                            <Skeleton height="40px" width="100%" borderRadius="8px" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredLawyers.length > 0 ? (
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
                                                <span className="result-card__rating-value">{lawyer.rating?.toFixed(1) || '0.0'}</span>
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
