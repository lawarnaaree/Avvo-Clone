import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCommentDots, FaGavel, FaThumbsUp } from 'react-icons/fa';
import { FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { qaService } from '../services/qaService';
import './QASection.css';

const QASection = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const data = await qaService.getQuestions();
            setQuestions(data);
            setLoading(false);
        };
        fetchQuestions();
    }, []);
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
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>Loading questions...</div>
                        ) : questions.length > 0 ? (
                            questions.map((q, index) => (
                                <div key={q.id || index} className="qa-card">
                                    <div className="qa-card__header">
                                        <span className="qa-card__category" style={{
                                            background: `${q.topAnswer?.lawyerColor || '#666'}15`,
                                            color: q.topAnswer?.lawyerColor || '#666'
                                        }}>
                                            {q.category}
                                        </span>
                                        <span className="qa-card__time">
                                            {q.time || 'Shared recently'}
                                        </span>
                                    </div>
                                    <h4 className="qa-card__question">{q.question}</h4>
                                    {q.topAnswer ? (
                                        <div className="qa-card__answer">
                                            <div className="qa-card__answer-avatar" style={{ background: q.topAnswer.lawyerColor }}>
                                                {q.topAnswer.lawyerName.charAt(0)}
                                            </div>
                                            <div className="qa-card__answer-content">
                                                <span className="qa-card__lawyer">{q.topAnswer.lawyerName}</span>
                                                <p className="qa-card__answer-text">{q.topAnswer.text}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="qa-card__no-answer">
                                            <p>Waiting for attorney answer...</p>
                                        </div>
                                    )}
                                    <div className="qa-card__footer">
                                        <span className="qa-card__stat"><FaCommentDots /> {q.answersCount || 0} answers</span>
                                        <span className="qa-card__stat"><FaThumbsUp /> {q.likes || 0} helpful</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>No questions yet. Be the first to ask!</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QASection;
