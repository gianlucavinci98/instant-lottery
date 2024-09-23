import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
    return (
        <Container className="text-center not-found-container">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h1 className="display-1">404</h1>
                    <h2>Pagina Non Trovata</h2>
                    <p>La pagina che stai cercando non esiste.</p>
                    <Link to="/">
                        <Button variant="primary">Torna alla Home</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}