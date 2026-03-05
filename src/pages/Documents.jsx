import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiHome, FiHeart, FiArrowRight, FiFileText } from 'react-icons/fi';
import { documentService } from '../services/documentService';
import Skeleton from '../components/Skeleton';
import './Documents.css';

const categoryMeta = {
    business: { icon: <FiBriefcase />, iconClass: 'document-card__icon--business', label: 'Business & Contracts' },
    property: { icon: <FiHome />, iconClass: 'document-card__icon--property', label: 'Property & Real Estate' },
    family: { icon: <FiHeart />, iconClass: 'document-card__icon--family', label: 'Family & Personal' },
};

const Documents = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const fetchTemplates = async () => {
        setLoading(true);
        const data = await documentService.getDocumentTemplates();
        setTemplates(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSeed = async () => {
        setSeeding(true);
        await seedDocumentTemplates();
        await fetchTemplates();
        setSeeding(false);
    };

    useEffect(() => {
        let result = templates;

        if (activeCategory !== 'all') {
            result = result.filter(t => t.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q)
            );
        }

        setFilteredTemplates(result);
    }, [templates, activeCategory, searchQuery]);

    return (
        <div className="documents-page">
            <div className="container">
                <div className="documents-page__header">
                    <span className="documents-page__badge">Legal Documents</span>
                    <h1 className="documents-page__title">
                        Personalize documents for your situation
                    </h1>
                    <p className="documents-page__subtitle">
                        Browse our library of legal documents designed for Nepal's legal framework.
                    </p>
                </div>

                {/* Search */}
                <div className="documents-search glass-card">
                    <FiSearch className="documents-search__icon" />
                    <input
                        type="text"
                        className="documents-search__input"
                        placeholder="Search documents and topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Chips */}
                <div className="documents-filters">
                    <button
                        className={`documents-filter-chip ${activeCategory === 'all' ? 'documents-filter-chip--active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        All Documents
                    </button>
                    {Object.entries(categoryMeta).map(([key, meta]) => (
                        <button
                            key={key}
                            className={`documents-filter-chip ${activeCategory === key ? 'documents-filter-chip--active' : ''}`}
                            onClick={() => setActiveCategory(key)}
                        >
                            {meta.label}
                        </button>
                    ))}
                </div>

                {/* Document Cards */}
                {loading ? (
                    <div className="documents-cards">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="document-card glass-card">
                                <Skeleton height="48px" width="48px" borderRadius="12px" className="mb-md" />
                                <Skeleton height="14px" width="30%" className="mb-sm" />
                                <Skeleton height="24px" width="80%" className="mb-sm" />
                                <Skeleton height="14px" width="100%" className="mb-sm" />
                                <Skeleton height="14px" width="60%" className="mb-lg" />
                                <Skeleton height="16px" width="40%" />
                            </div>
                        ))}
                    </div>
                ) : filteredTemplates.length > 0 ? (
                    <div className="documents-cards">
                        {filteredTemplates.map(template => {
                            const meta = categoryMeta[template.category] || categoryMeta.business;
                            return (
                                <Link
                                    key={template.id}
                                    to={`/documents/${template.slug}`}
                                    className="document-card glass-card"
                                >
                                    <div className={`document-card__icon ${meta.iconClass}`}>
                                        {meta.icon}
                                    </div>
                                    <span className="document-card__category">{meta.label}</span>
                                    <h3 className="document-card__name">{template.name}</h3>
                                    <p className="document-card__description">{template.description}</p>
                                    <span className="document-card__cta">
                                        Create Document <FiArrowRight />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="documents-empty">
                        <FiFileText />
                        <p>No documents found. Try a different search or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documents;
