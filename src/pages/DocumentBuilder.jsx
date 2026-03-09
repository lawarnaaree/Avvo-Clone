import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiDownload, FiFileText, FiEye } from 'react-icons/fi';
import { documentService } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import './DocumentBuilder.css';
import { jsPDF } from 'jspdf';

const DocumentBuilder = () => {
    const { templateId } = useParams();
    const { user } = useAuth();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            setLoading(true);
            const data = await documentService.getTemplateBySlug(templateId);
            setTemplate(data);
            setLoading(false);
        };
        fetchTemplate();
    }, [templateId]);

    if (loading) {
        return <div className="builder-page"><div className="builder-loading">Loading document...</div></div>;
    }

    if (!template) {
        return (
            <div className="builder-page">
                <div className="builder-loading">
                    Document template not found. <Link to="/documents">Browse all documents</Link>
                </div>
            </div>
        );
    }

    const fields = template.fields || [];
    const totalSteps = fields.length;
    const progress = totalSteps > 0 ? Math.round(((currentStep + (isComplete ? 1 : 0)) / totalSteps) * 100) : 0;

    const handleAnswer = (value) => {
        const field = fields[currentStep];
        setAnswers(prev => ({ ...prev, [field.key]: value }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleBack = () => {
        if (isComplete) {
            setIsComplete(false);
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderPreview = () => {
        let text = template.templateText || '';
        fields.forEach(field => {
            const value = answers[field.key];
            const placeholder = `{{${field.key}}}`;
            if (value) {
                text = text.replaceAll(placeholder, `<span class="builder-preview__filled">${value}</span>`);
            } else {
                text = text.replaceAll(placeholder, `<span class="builder-preview__placeholder">[${field.label}]</span>`);
            }
        });
        return text;
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        let text = template.templateText || '';

        // Process text for PDF (strip HTML tags first but keep structure)
        fields.forEach(field => {
            const value = answers[field.key] || `[${field.label}]`;
            text = text.replaceAll(`{{${field.key}}}`, value);
        });

        // Clean HTML tags and handle line breaks
        const cleanText = text
            .replace(/<\/h2>/g, '\n\n')
            .replace(/<\/p>/g, '\n\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]*>/g, '');

        const splitText = doc.splitTextToSize(cleanText, 180);
        doc.setFontSize(12);
        doc.text(splitText, 15, 20);
        doc.save(`${template.name.replace(/\s+/g, '_')}.pdf`);
    };

    const handleSave = async () => {
        if (!user) {
            alert("Please sign in to save your documents.");
            return;
        }

        setSaving(true);
        try {
            await documentService.saveUserDocument(user.uid, {
                templateId: template.id,
                templateName: template.name,
                answers: answers,
                status: 'draft'
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving document:", error);
            alert("Failed to save document. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = () => {
        let text = template.templateText || '';
        fields.forEach(field => {
            const value = answers[field.key] || `[${field.label}]`;
            text = text.replaceAll(`{{${field.key}}}`, value);
        });

        const cleanText = text.replace(/<[^>]*>/g, '');
        const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const currentField = fields[currentStep];

    return (
        <div className="builder-page">
            {/* Top Bar */}
            <div className="builder-topbar">
                <div className="container builder-topbar__content">
                    <div className="builder-topbar__left">
                        <Link to="/documents" className="builder-topbar__back">
                            <FiArrowLeft /> Back
                        </Link>
                        <span className="builder-topbar__title">{template.name}</span>
                    </div>
                    <div className="builder-topbar__right">
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                            PROGRESS {progress}%
                        </span>
                    </div>
                </div>
                <div className="builder-progress">
                    <div className="builder-progress__fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Main Layout */}
            <div className="builder-layout">
                {/* Left: Form */}
                <div className="builder-form">
                    {isComplete ? (
                        <div className="builder-complete">
                            <div className="builder-complete__icon"><FiCheck /></div>
                            <h2 className="builder-complete__title">Document Ready!</h2>
                            <p className="builder-complete__text">
                                Your {template.name} has been personalized. Review the preview and download when ready.
                            </p>
                            <div className="builder-complete__actions">
                                <button className="builder-btn builder-btn--secondary" onClick={handleBack}>
                                    <FiArrowLeft /> Edit Answers
                                </button>
                                <button className="builder-btn builder-btn--primary" onClick={handleSave} disabled={saving}>
                                    <FiCheck /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save to My Docs'}
                                </button>
                                <button className="builder-btn builder-btn--accent" onClick={handleExportPDF}>
                                    <FiDownload /> Export as PDF
                                </button>
                            </div>
                        </div>
                    ) : currentField ? (
                        <>
                            <span className="builder-form__step-label">
                                Step {currentStep + 1} of {totalSteps}
                            </span>
                            <h2 className="builder-form__question">{currentField.label}</h2>
                            {currentField.helpText && (
                                <p className="builder-form__help">{currentField.helpText}</p>
                            )}

                            {currentField.type === 'textarea' ? (
                                <textarea
                                    className="builder-form__input builder-form__input--textarea"
                                    placeholder={currentField.placeholder || ''}
                                    value={answers[currentField.key] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    rows={4}
                                />
                            ) : currentField.type === 'select' ? (
                                <select
                                    className="builder-form__input builder-form__input--select"
                                    value={answers[currentField.key] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {currentField.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : currentField.type === 'date' ? (
                                <input
                                    type="date"
                                    className="builder-form__input"
                                    value={answers[currentField.key] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                />
                            ) : (
                                <input
                                    type="text"
                                    className="builder-form__input"
                                    placeholder={currentField.placeholder || ''}
                                    value={answers[currentField.key] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    autoFocus
                                />
                            )}

                            <div className="builder-form__actions">
                                {currentStep > 0 && (
                                    <button className="builder-btn builder-btn--secondary" onClick={handleBack}>
                                        <FiArrowLeft /> Back
                                    </button>
                                )}
                                <button className="builder-btn builder-btn--primary" onClick={handleNext}>
                                    {currentStep < totalSteps - 1 ? (
                                        <>Next <FiArrowRight /></>
                                    ) : (
                                        <>Finish <FiCheck /></>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No questions found for this template.</p>
                    )}
                </div>

                {/* Right: Preview */}
                <div className="builder-preview">
                    <div className="builder-preview__label">
                        <FiEye /> Live Document Preview
                    </div>
                    <div
                        className="builder-preview__doc"
                        dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentBuilder;
