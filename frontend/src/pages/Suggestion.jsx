import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/requestAPi';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { BsCalendarMonth, BsInfoCircle, BsGraphUpArrow, BsLightbulb } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';

export default function Suggestion() {
    const [insights, setInsights] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(true);
    const [loadingPrediction, setLoadingPrediction] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInsights = async () => {
                try {
                const res = await axios.get('http://localhost:3000/ai/insights', {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`
                    }
                });
                if (res.data.success) {
                    const data = res.data.insights;
                    const items = Array.isArray(data) ? data : (data ? [data] : []);
                    setInsights(items);
                    setError('');
                }
            } catch (err) {
                console.error(err);
                setError('Gagal memuat insights');
            } finally {
                setLoadingInsights(false);
            }
        };

        const fetchPrediction = async () => {
            try {
                const res = await axios.get('http://localhost:3000/ai/prediction', {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`
                    }
                });
                if (res.data.success) {
                    setPrediction(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingPrediction(false);
            }
        };

        fetchInsights();
        fetchPrediction();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <article className='p-4' style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className='mb-4'>
                <h2 className='m-0 fs-3 fw-bold' style={{ color: '#2c3e50' }}>Financial Insights</h2>
                <p className='m-0 text-muted'>Smart analysis of your spending patterns and financial habits</p>
            </div>

            <Row className="mb-5">
                <Col md={12} lg={8}>
                    <Card className="shadow-sm border-0 rounded-4 h-100" style={{ borderTop: '4px solid #a855f7' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <BsCalendarMonth className="fs-5 text-purple me-2" style={{ color: '#a855f7' }} />
                                <h5 className="m-0 fw-bold">Monthly Insights</h5>
                            </div>
                            
                            {loadingInsights ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" style={{ color: '#a855f7' }} />
                                    <p className="mt-2 text-muted">Menganalisis data transaksi Anda...</p>
                                </div>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {insights.map((insight, idx) => (
                                        <div key={idx} className="p-3 rounded-3" style={{ backgroundColor: idx % 2 === 0 ? '#f3e8ff' : '#e0e7ff', borderLeft: `4px solid ${idx % 2 === 0 ? '#a855f7' : '#4f46e5'}` }}>
                                            <div className="d-flex">
                                                <BsInfoCircle className="mt-1 me-2" style={{ color: idx % 2 === 0 ? '#a855f7' : '#4f46e5' }} />
                                                <p className="m-0" style={{ fontSize: '14px', color: '#4b5563' }}>{insight}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="mt-4 mb-0 text-muted" style={{ fontSize: '12px', fontStyle: 'italic' }}>Based on this month's data</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className='mb-3 d-flex align-items-center'>
                <FaRobot className="fs-4 me-2 text-primary" />
                <h3 className='m-0 fs-4 fw-bold' style={{ color: '#2c3e50' }}>AI-Powered Predictions</h3>
            </div>

            <Row>
                <Col md={12} lg={8}>
                    <Card className="shadow-sm border-0 rounded-4" style={{ borderTop: '4px solid #a855f7' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <BsCalendarMonth className="fs-5 text-purple me-2" style={{ color: '#a855f7' }} />
                                    <h5 className="m-0 fw-bold">Next Month's Prediction</h5>
                                </div>
                            </div>

                            {loadingPrediction ? (
                                <div className="text-center py-4">
                                    <Spinner animation="border" style={{ color: '#a855f7' }} />
                                    <p className="mt-2 text-muted">Menghasilkan prediksi dengan model AI...</p>
                                </div>
                            ) : prediction ? (
                                <>
                                    <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#f9fafb' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <BsInfoCircle className="text-muted me-2" />
                                                <span className="fw-semibold text-muted" style={{ fontSize: '14px' }}>Model Prediction</span>
                                            </div>
                                            <span className="fw-bold" style={{ color: '#a855f7', fontSize: '13px' }}>{prediction.prediction.confidence}% confidence</span>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <span className="text-muted" style={{ fontSize: '12px' }}>Expected Spending</span>
                                            <div className="d-flex align-items-end">
                                                <h3 className="m-0 fw-bold me-2">{formatCurrency(prediction.prediction.expectedSpending)}</h3>
                                                <span className="text-danger mb-1" style={{ fontSize: '13px' }}><BsGraphUpArrow className="me-1"/> 15%</span>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 flex-wrap">
                                            {prediction.prediction.topCategories.map((cat, idx) => (
                                                <span key={idx} style={{ fontSize: '11px', color: '#a855f7', fontWeight: '500' }}>{cat}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center">
                                        <FaRobot className="me-2 text-primary" />
                                        <span className="fw-bold" style={{ color: '#374151' }}>AI Analysis</span>
                                    </div>
                                    <div className="text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                        {prediction.analysis.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-2">{paragraph}</p>
                                        ))}
                                    </div>

                                    <div className="mb-2">
                                        <span className="fw-bold" style={{ color: '#374151', fontSize: '14px' }}>Recommended Actions:</span>
                                    </div>
                                    <ul className="text-muted mb-0 pl-3" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                        {prediction.recommendedActions.map((action, idx) => (
                                            <li key={idx} className="mb-1">{action}</li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <p className="mt-4 text-muted" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                Predictions powered by Machine Learning and analyzed by AI
            </p>
        </article>
    );
}
