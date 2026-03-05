import React, { useState, useEffect } from 'react';
import { qaService } from '../../services/qaService';
import { useAuth } from '../../context/AuthContext';
import { FiMessageSquare, FiSend, FiClock, FiCheckCircle, FiSearch } from 'react-icons/fi';
import './AnswerManager.css';

const AnswerManager = () => {
    const { user, userProfile } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [myAnswers, setMyAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'my-answers'
    const [respondingTo, setRespondingTo] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [userProfile]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch questions matching specialty or all if no specialty
            const qData = await qaService.getQuestions();
            // Filter: pending (no answer) and optionally by specialty
            const pending = qData.filter(q => !q.answer);
            const answeredByMe = qData.filter(q => q.answeredBy === user?.uid || q.lawyerId === user?.uid);

            setQuestions(pending);
            setMyAnswers(answeredByMe);
        } catch (error) {
            console.error("Error fetching Q&A data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = (question) => {
        setRespondingTo(question);
        setAnswerText('');
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!answerText.trim() || !respondingTo) return;

        setSubmitting(true);
        try {
            await qaService.submitAnswer(respondingTo.id, {
                answer: answerText,
                lawyerId: user.uid,
                lawyerName: userProfile?.displayName || user.displayName || 'Legal Professional',
                lawyerTitle: userProfile?.title || 'Advocate',
                answeredAt: new Date().toISOString()
            });

            // Refresh data
            fetchInitialData();
            setRespondingTo(null);
            setAnswerText('');
        } catch (error) {
            console.error("Error submitting answer:", error);
            alert("Failed to submit answer. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="answer-manager">
            <h2 className="dashboard-content__title">Question & Answer Management</h2>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Questions ({questions.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'my-answers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-answers')}
                >
                    My Answers ({myAnswers.length})
                </button>
            </div>

            <div className="tab-content">
                {loading ? (
                    <div className="loading-state">Loading questions...</div>
                ) : activeTab === 'pending' ? (
                    <div className="questions-list">
                        {questions.length === 0 ? (
                            <div className="empty-state">No pending questions in your area right now.</div>
                        ) : (
                            questions.map(q => (
                                <div key={q.id} className="question-card">
                                    <div className="question-card__header">
                                        <span className="category-badge">{q.category}</span>
                                        <span className="timestamp"><FiClock /> {new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="question-text">{q.question}</h4>
                                    <p className="question-details">{q.details}</p>

                                    {respondingTo?.id === q.id ? (
                                        <form className="response-form" onSubmit={handleSubmitAnswer}>
                                            <textarea
                                                placeholder="Write your professional advice here..."
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                                required
                                                rows="5"
                                            />
                                            <div className="form-actions">
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRespondingTo(null)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                                    <FiSend /> {submitting ? 'Submitting...' : 'Submit Answer'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button className="btn btn-primary btn-sm respond-btn" onClick={() => handleRespond(q)}>
                                            <FiMessageSquare /> Respond to Question
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="my-answers-list">
                        {myAnswers.length === 0 ? (
                            <div className="empty-state">You haven't answered any questions yet.</div>
                        ) : (
                            myAnswers.map(q => (
                                <div key={q.id} className="answered-card">
                                    <div className="answered-card__header">
                                        <span className="category-badge">{q.category}</span>
                                        <span className="status-badge success"><FiCheckCircle /> Answered</span>
                                    </div>
                                    <h4 className="question-text">{q.question}</h4>
                                    <div className="your-answer">
                                        <strong>Your Response:</strong>
                                        <p>{q.answer}</p>
                                    </div>
                                    <span className="timestamp">{new Date(q.answeredAt || q.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnswerManager;
