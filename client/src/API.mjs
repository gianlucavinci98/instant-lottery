const SERVER_URL = 'http://localhost:3001/api';

const getRanking = async () => {
    const response = await fetch(`${SERVER_URL}/users/ranking`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    users.map((user) => {
        const oggetto = { username: user.username, points: user.points };
        return oggetto;
    });
    return users;
}

const getNextDrawTime = async () => {
    const response = await fetch(`${SERVER_URL}/draws/next`, {
        credentials: 'include',
    });

    if (response.ok) {
        const draw = await response.json();
        return draw;
    }
    if (response.status === 404) {
        return null;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
}

const placeBet = async (selectedNumbers) => {
    const response = await fetch(`${SERVER_URL}/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers: selectedNumbers }),
        credentials: 'include'
    });

    const draw = await response.json();

    if (!response.ok) {
        throw new Error(draw.error);
    }
    else return draw;
}

const getActiveBetByUser = async () => {
    const response = await fetch(`${SERVER_URL}/bets/active`, {
        credentials: 'include',
    });

    if (response.ok) {
        const bet = await response.json();
        return bet;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
}

const getDrawNumbers = async (drawId) => {
    const response = await fetch(`${SERVER_URL}/draws/${drawId}`, {
        credentials: 'include',
    });

    const draw = await response.json();

    if (!response.ok) throw new Error(draw.error);

    return draw;
}

const logIn = async (credenziali) => {
    const response = await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credenziali),
    });
    const user = await response.json();
    if (response.ok) return user; // user = {username: 'xxx', points: 0}
    else throw new Error(user.message);
};

const getUser = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) return user;
    else return '';
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/users/info', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) return user;
    else throw new Error(user.error);
};

const logOut = async () => {
    const response = await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) return null;
    else throw new Error(response.status);
}

const getUserBetsHistory = async () => {
    const response = await fetch(SERVER_URL + '/bets/history', {
        credentials: 'include',
    });
    const bets = await response.json();
    if (response.ok) return bets;
    else throw new Error(response.status);
}

const API = { getRanking, getNextDrawTime, placeBet, getActiveBetByUser, getDrawNumbers, logIn, getUser, logOut, getUserBetsHistory, getUserInfo };
export default API;