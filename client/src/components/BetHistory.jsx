import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Alert, Badge } from 'react-bootstrap';
import { FaTrophy, FaCalendarAlt, FaClock, FaCoins } from 'react-icons/fa';
import API from '../API.mjs';

const BetHistory = (props) => {
    const [bets, setBets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBetHistory = async () => {
            try {
                const betHistory = await API.getUserBetsHistory();
                setBets(betHistory);
            } catch (err) {
                setError('Failed to fetch bet history.');
            }
        };
        fetchBetHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    if (!props.loggedIn) {
        return (
            <Container style={{ marginTop: '6rem' }}>
                <Row className="my-4">
                    <Col>
                        <Alert variant="danger">
                            <h4>Accesso Negato</h4>
                            <p>Devi essere loggato per visualizzare il ranking.</p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: '6rem' }}>
            <Row className="my-4">
                <Col>
                    <h1>Bet History</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th className="w-auto text-center"><i className="bi bi-award-fill"></i></th>
                                <th className="w-auto text-center"><FaCalendarAlt /> Date</th>
                                <th className="w-auto text-center"><FaClock /></th>
                                <th className="w-auto text-center">Numbers</th>
                                <th className="w-auto text-center"><FaCoins /></th>
                                <th className="w-auto text-center"><FaTrophy /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bets.map((bet, index) => (
                                <tr key={bet.id} className={bet.points_won > 0 ? 'table-success' : ''}>
                                    <td className="w-auto text-center">{bet.points_won > 0 ? <i class="bi bi-star-fill"></i> : <i class="bi bi-person-x"></i>}</td>
                                    <td className="w-auto text-center">{formatDate(bet.created_at)}</td>
                                    <td className="w-auto text-center">{formatTime(bet.created_at)}</td>
                                    <td className="w-auto text-center">
                                        {bet.bet_numbers.map((num, i) => (
                                            <Badge key={i} pill bg="primary" className="me-1">
                                                {num}
                                            </Badge>
                                        ))}
                                    </td>
                                    <td className="w-auto text-center">{bet.points_spents}</td>
                                    <td className="w-auto text-center">{bet.points_won}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default BetHistory;