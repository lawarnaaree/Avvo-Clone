import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCommentDots, FaGavel, FaThumbsUp } from 'react-icons/fa';
import { FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import './QASection.css';

const questions = [
    {
        category: 'Family Law',
        question: 'Can I modify a child custody agreement after it has been finalized?',
        asker: 'Lawarna Aree',
        time: '2 hours ago',
        answers: 3,
        likes: 12,
        topAnswer: 'Yes, custody agreements can be modified if there has been a significant change in circumstances...',
        lawyer: 'Lawarna Aree, Esq.',
        lawyerColor: '#e91e63',
    },
    {
        category: 'Criminal Defense',
        question: 'What happens if I refuse a breathalyzer test during a DUI stop?',
        asker: 'Lawarna Aree',
        time: '5 hours ago',
        answers: 5,
        likes: 24,
        topAnswer: 'Refusing a breathalyzer can result in automatic license suspension under implied consent laws...',
        lawyer: 'Lawarna Aree, Esq.',
        lawyerColor: '#9c27b0',
    },
    {
        category: 'Employment',
        question: 'Is my employer required to pay overtime if I work more than 40 hours a week?',
        asker: 'Lawarna Aree',
        time: '1 day ago',
        answers: 4,
        likes: 31,
        topAnswer: 'Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive 1.5x their regular rate...',
        lawyer: 'Lawarna Aree, Esq.',
        lawyerColor: '#2196f3',
    },
];

const QASection = () => {
    const navigate = useNavigate();
    return (
        <section className="qa-section section" id="ask">
            <div className="container">
                <div className="qa-section__layout">
                    <div className="qa-section__left">
                        <h2 className="section-title">Ask a Lawyer — For Free</h2>
                        <p className="section-subtitle">
                            Get free legal advice from verified attorneys. Ask any question and receive answers within hours.
                        </p>
                        <div className="qa-section__ask-box">
                            <FiMessageCircle className="qa-section__ask-icon" />
                            <input
                                type="text"
                                placeholder="Type your legal question here..."
                                className="qa-section__ask-input"
                            />
                            <button className="btn btn-primary" onClick={() => navigate('/ask')}>Ask Now</button>
                        </div>
                        <div className="qa-section__ask-stats">
                            <span><strong>10M+</strong> questions answered</span>
                            <span><strong>97%</strong> answered within 24hrs</span>
                        </div>
                    </div>

                    <div className="qa-section__right">
                        {questions.map((q, index) => (
                            <div key={index} className="qa-card">
                                <div className="qa-card__header">
                                    <span className="qa-card__category" style={{ background: `${q.lawyerColor}15`, color: q.lawyerColor }}>
                                        {q.category}
                                    </span>
                                    <span className="qa-card__time">{q.time}</span>
                                </div>
                                <h4 className="qa-card__question">{q.question}</h4>
                                <div className="qa-card__answer">
                                    <div className="qa-card__answer-avatar" style={{ background: q.lawyerColor }}>
                                        {q.lawyer.charAt(0)}
                                    </div>
                                    <div className="qa-card__answer-content">
                                        <span className="qa-card__lawyer">{q.lawyer}</span>
                                        <p className="qa-card__answer-text">{q.topAnswer}</p>
                                    </div>
                                </div>
                                <div className="qa-card__footer">
                                    <span className="qa-card__stat"><FaCommentDots /> {q.answers} answers</span>
                                    <span className="qa-card__stat"><FaThumbsUp /> {q.likes} helpful</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QASection;
