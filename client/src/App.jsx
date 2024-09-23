import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useEffect, useState } from 'react';
import { Container, Row, Alert } from "react-bootstrap";
import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom"
import NavHeader from './components/NavHeader';
import GamePage from "./components/GamePage";
import Ranking from "./components/Ranking";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import NotFound from "./components/NotFound";
import BetHistory from "./components/BetHistory";
import API from "./API.mjs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUser();
        // Prendo i punti sepratamente perchè se li prendo dalla sessione non si aggiornerebbero
        const points = await API.getUserInfo();
        if (user && points) {
          setLoggedIn(true);
          setUser(user);
          setUserPoints(points.points);
        }
      }
      catch (error) {
        setUser('');
      }
    };
    checkAuth();
  }, []);

  // Prendo i punti sepratamente perchè se li prendo dalla sessione non si aggiornerebbero
  const updateUserPoints = async () => {
    try {
      const updatedUser = await API.getUserInfo();
      setUserPoints(updatedUser.points);
    } catch (err) {
      setUser('');
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      const points = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
      setUserPoints(points.points);
    }
    catch (err) {
      setMessage({ msg: err.message, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser('');
    navigate('/');
  };

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} user={user} userPoints={userPoints} handleLogout={handleLogout} />
          <Container fluid>
            <Outlet />
          </Container>
        </>
      }>
        <Route path="/" element={<Home />} />
        <Route path="play" element={<GamePage loggedIn={loggedIn} updateUserPoints={updateUserPoints} />} />
        <Route path="ranking" element={<Ranking loggedIn={loggedIn} />} />
        <Route path="history" element={<BetHistory loggedIn={loggedIn} />} />
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm message={message} login={handleLogin} setMessage={setMessage} />
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;