import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

function Home() {
    return (
        <Container style={{ marginTop: '6rem' }}>
            <Row className="mb-4">
                <Col>
                    <h1 className="text-center text-primary">Welcome to Instant Lottery</h1>
                    <p className="text-center text-secondary">Play and win instantly!</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow-lg">
                        <Card.Header as="h2" className="text-center bg-primary text-white">
                            <i className="bi bi-dice-5-fill me-2 text-warning"></i>
                            Game Rules
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Follow these simple steps to participate in the Instant Lottery:
                            </Card.Text>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <i className="bi bi-person-fill text-primary"></i> <strong>1. Register and Login:</strong> Create an account or login if you already have one.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-123 text-primary"></i> <strong>2. Select Numbers:</strong> Choose up to 3 numbers from 1 to 90.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-cash-stack text-primary"></i> <strong>3. Place Your Bet:</strong> Decide how many points you want to bet.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-clock-fill text-primary"></i> <strong>4. Wait for the Draw:</strong> Draws happen every 2 minutes. Check if your numbers match the drawn numbers.
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-trophy-fill text-primary"></i> <strong>5. Earn Points:</strong> Earn points based on the number of matches. The more matches, the more points you earn!
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <i className="bi bi-bar-chart-line-fill text-primary"></i> <strong>6. Check the Leaderboard:</strong> See where you stand among the top players.
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;