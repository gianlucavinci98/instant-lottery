import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

function NavHeader(props) {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg" className="shadow-lg fixed-top">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/" className='navbar-brand'>
              <Nav.Link>
                <i className="bi bi-house-door-fill me-2"></i>Instant Lottery
              </Nav.Link>
            </LinkContainer>
            {props.loggedIn && <LinkContainer to="/play">
              <Nav.Link>
                <i className="bi bi-play-circle-fill me-2"></i>Play
              </Nav.Link>
            </LinkContainer>}
            {props.loggedIn && <LinkContainer to="/ranking">
              <Nav.Link>
                <i className="bi bi-trophy-fill me-2"></i>Ranking
              </Nav.Link>
            </LinkContainer>}
          </Nav>

          {props.loggedIn && (
            <Nav className="mx-auto" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              <Nav.Item className="text-white">
                <Link to="/history" style={{ textDecoration: 'none', color: 'white' }}>
                  <i className="bi bi-person-circle me-2"></i>{props.user.username}
                </Link> - <i className="bi bi-coin me-2"></i>{props.userPoints} Points
              </Nav.Item>
            </Nav>
          )}

          <Nav className="ms-auto">
            {props.loggedIn ?
              <Nav.Link onClick={props.handleLogout}>
                <i className="bi bi-box-arrow-left me-2"></i>Logout
              </Nav.Link> :
              <Link to="/login" className="nav-link">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
