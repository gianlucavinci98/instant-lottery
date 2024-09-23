import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import API from '../API.mjs';
import "./GamePage.css";

const GamePage = (props) => {
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [error, setError] = useState('');
    const [nextDrawTime, setNextDrawTime] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeBet, setActiveBet] = useState(null);
    const [betResult, setBetResult] = useState(null);

    const fetchNextDrawTime = async () => {
        try {
            const draw = await API.getNextDrawTime();
            if (draw) setNextDrawTime(new Date(draw.draw_time));
            else setError('No draws available');
        } catch (err) {
            setError('Failed to fetch next draw time.');
        }
    };

    const fetchActiveBet = async () => {
        try {
            const bets = await API.getActiveBetByUser();
            if (bets.length > 0) {
                setActiveBet(bets[0]);
            } else {
                setActiveBet(null);
            }
        } catch (err) {
            setError('Failed to fetch active bet.');
        }
    };

    useEffect(() => {
        fetchActiveBet();
    }, []);

    useEffect(() => {
        fetchNextDrawTime();
    }, []);

    useEffect(() => {
        if (nextDrawTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const distance = nextDrawTime - now;

                if (distance < 0) {
                    setCountdown('Draw in progress...');
                    fetchNextDrawTime();
                    setActiveBet(null);
                    clearInterval(interval);
                } else {
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setCountdown(`${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [nextDrawTime]);

    const handleNumberSelection = (number) => {
        if (selectedNumbers.length < 4) setError('');
        if (selectedNumbers.includes(number)) {
            setSelectedNumbers(selectedNumbers.filter(n => n !== number));
        } else {
            if (selectedNumbers.length < 3) {
                setSelectedNumbers([...selectedNumbers, number]);
                setError('');
            } else {
                setError('You can select up to 3 numbers!');
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedNumbers.length < 1) {
            setError('Select at least one number!');
            return;
        }

        setLoading(true);
        try {
            setBetResult(null);
            const result = await API.placeBet(selectedNumbers);
            setSelectedNumbers([]);
            setError('');
            await fetchActiveBet();

            const drawTime = new Date(nextDrawTime).getTime();
            const currentTime = new Date().getTime();
            const delay = drawTime - currentTime;

            setTimeout(() => checkBetResult(result.draw_id, selectedNumbers), delay + 1000);
            // Aggiungo un ulteriore secondo altrimenti il server non mi restituirebbe il draw perchè non ancora settatto completed = true
            props.updateUserPoints();
        } catch (err) {
            setError(`Error during placing bet: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkBetResult = async (drawId, betNumbers) => {
        try {
            const drawResult = await API.getDrawNumbers(drawId);
            const winningNumbers = drawResult.numbers;
            const matchedNumbers = betNumbers.filter(number => winningNumbers.includes(number));

            const DrawResultString = "Draw result: " + winningNumbers.join(' | ') + "\n";

            if (matchedNumbers.length > 0) {
                setBetResult(DrawResultString + `You won with numbers: ${matchedNumbers.join(', ')}!`);
                props.updateUserPoints();
            } else {
                setBetResult(DrawResultString + 'You lost! Better luck next time!');
            }
        } catch (err) {
            setError(`Errore durante la verifica del risultato della scommessa: ${err.message}`);
        }
    };

    const renderNumberButtons = () => {
        const buttons = [];
        for (let i = 1; i <= 90; i++) {
            buttons.push(
                <Button key={i}
                    variant={selectedNumbers.includes(i) ? 'primary' : 'outline-primary'}
                    onClick={() => handleNumberSelection(i)}
                    className="m-1"
                >
                    {i}
                </Button>
            );
        }
        return buttons;
    };

    if (!props.loggedIn) {
        return (
            <Container style={{ marginTop: '6rem' }}>
                <Row className="my-4">
                    <Col>
                        <Alert variant="danger">
                            <h4>Accesso Negato</h4>
                            <p>Devi essere loggato per poter giocare.</p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: '5rem' }} >
            <Row>
                <Col md={8} className="d-flex flex-column align-items-center">
                    <h2 className="text-center mb-4">Choose your numbers!</h2>
                    <div className='number-grid'>
                        {renderNumberButtons()}
                    </div>
                </Col>

                <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
                    <Row className="mb-1">
                        <Col className="text-center">
                            <h4><i className="bi bi-coin coin-icon"></i>{selectedNumbers.length * 5}</h4>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col className="text-center">
                            <h5>Next Draw: {countdown}</h5>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="text-center">
                            <Button onClick={handleSubmit} variant="success" disabled={selectedNumbers.length === 0 || loading}>
                                {loading ? 'Placing Bet...' : 'Bet Now!'}
                            </Button>
                        </Col>
                    </Row>

                    {activeBet && (
                        <Row className="mt-3">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Active Bet</Card.Title>
                                        <Card.Text>
                                            <strong>Numbers:</strong> {activeBet.bet_numbers.join(', ')}<br />
                                            <strong>Points Spent:</strong> {activeBet.points_spent}<br />
                                            <strong>Created At:</strong> {activeBet.created_at}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {!activeBet && (
                        <Row className="mt-3">
                            <Col>
                                <Alert variant="info">No active bet</Alert>
                            </Col>
                        </Row>
                    )}

                    {betResult && (
                        <Row className="mt-3">
                            <Col>
                                <Alert variant="success">{betResult.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                                </Alert>
                            </Col>
                        </Row>
                    )}

                </Col>
            </Row>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')} className='mt-4'>{error}</Alert>}

        </Container>
    );
};

export default GamePage;