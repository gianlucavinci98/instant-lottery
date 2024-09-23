import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Alert } from 'react-bootstrap';
import API from '../API.mjs';

function Ranking(props) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await API.getRanking();
                setUsers(data);
            } catch (err) {
                setError('Failed to fetch ranking data.');
            }
        }
        fetchRanking();
    }, []);

    const getRowClass = (index) => {
        switch (index) {
            case 0:
                return 'table-warning';
            case 1:
                return 'table-info';
            case 2:
                return 'table-light';
            default:
                return '';
        }
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
                    <h1>Ranking</h1>
                    {error && <p className="text-danger">{error}</p>}
                    <Table bordered hover >
                        <thead>
                            <tr>
                                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 3).map((user, index) => (
                                <tr key={index} className={getRowClass(index)}>
                                    <td style={{ textAlign: 'center' }}>
                                        {index === 0 ? (<i className="bi bi-trophy-fill text-warning"></i>) : (index + 1)}
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default Ranking;