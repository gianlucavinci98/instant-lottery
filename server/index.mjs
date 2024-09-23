// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { startDrawScheduler } from './utilities/drawScheduler.mjs';
import BetHandler from './utilities/betHandler.mjs';
import DrawDAO from './daos/draw_dao.mjs';
import UserDAO from './daos/user_dao.mjs';
import BetDAO from './daos/bet_dao.mjs';

// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init express
const app = new express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport configurations
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const user = await userDAO.getUserAccess(username, password);
    if (!user) return cb(null, false, { message: 'Incorrect username or password.' });
    return cb(null, user);
  }
  catch (error) {
    return cb({ error: error.message });
  }
}));
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) { // this user is just username
  return cb(null, user);
});

app.use(session({
  secret: "WA1 miglior corso del poli",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// Middleware for checking if user is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' }).end();
};


const betHandler = new BetHandler();
const drawDAO = new DrawDAO();
const userDAO = new UserDAO();
const betDAO = new BetDAO();

/* ROUTES */

/* SESSION Routes */

// Login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info).end();
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user).end();
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user).end();
  }
  else
    res.status(401).json({ error: 'Not authenticated' }).end();
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/* BET Routes */
// Place a bet
app.post("/api/bets", isLoggedIn,
  [
    check('numbers').isArray({ min: 1, max: 3 }).withMessage('Numbers must be an array with at min 1 number and max 3 numbers'),
    check('numbers.*').isInt({ min: 1, max: 90 }).withMessage('Each number must be an integer between 1 and 90'),
    check('numbers')
      .custom((numbers) => {
        const uniqueNumbers = new Set(numbers);
        if (uniqueNumbers.size !== numbers.length) {
          throw new Error('All numbers must be different');
        }
        return true;
      })
  ],
  async (req, res) => {
    const invalidFields = validationResult(req);
    if (!invalidFields.isEmpty()) {
      return res.status(422).json({ errors: invalidFields.array() }).end();
    }

    const user = req.user.username;

    try {
      const drawid = await betHandler.placeBet(user, req.body.numbers);
      // setTimeout(() => { res.status(201).json({ draw_id: drawid }).end(); }, 5000)
      res.status(201).json({ draw_id: drawid }).end();
    }
    catch (err) {
      res.status(500).json({ error: err.message }).end();
    }
  });

// Get bets by user
app.get("/api/bets/history", isLoggedIn, async (req, res) => {
  try {
    const user = req.user.username;
    const bets = await betDAO.getBetsByUser(user);
    res.status(200).json(bets).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});

// Get active bet by user
app.get("/api/bets/active", isLoggedIn, async (req, res) => {
  try {
    const user = req.user.username;
    const bets = await betDAO.getActiveBetsByUser(user);
    res.status(200).json(bets).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});


/* DRAW Routes */
// History of past completed draws
app.get("/api/draws", isLoggedIn, async (req, res) => {
  try {
    const draws = await drawDAO.getComepletedDraws();
    if (draws === null) return res.status(404).json({ error: 'No past draws available' }).end();
    res.status(200).json(draws).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});

// Get next draw time
app.get("/api/draws/next", isLoggedIn, async (req, res) => {
  try {
    const draw = await drawDAO.getValidDraw();
    if (draw === null) return res.status(404).json({ error: 'No draw available' }).end();
    res.status(200).json({ draw_time: draw.draw_time.format("YYYY-MM-DD HH:mm:ss") }).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});

// Get draw by id
app.get("/api/draws/:id", isLoggedIn, async (req, res) => {
  try {
    const draw = await drawDAO.getDrawById(req.params.id);
    if (draw === null || draw.completed === false) return res.status(404).json({ error: 'Draw not found or not yet completed' }).end();
    res.status(200).json(draw).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});

/* USER Routes */
// get users ranking by points
app.get("/api/users/ranking", isLoggedIn, async (req, res) => {
  try {
    const users = await userDAO.getAllUsers();
    if (users === null) return res.status(404).json({ error: 'No users available' }).end();
    const rank = users.map((user) => {
      return { username: user.username, points: user.points };
    }).sort((a, b) => b.points - a.points);
    res.status(200).json(rank).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});

// get user info
app.get("/api/users/info", isLoggedIn, async (req, res) => {
  try {
    const user = await userDAO.getUser(req.user.username);
    if (user === null) return res.status(404).json({ error: 'User not found' }).end();
    res.status(200).json({ username: user.username, points: user.points }).end();
  } catch (error) {
    res.status(500).json({ error: error.message }).end();
  }
});


// activate the server
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);

  await drawDAO.resetDraws();

  startDrawScheduler();
});