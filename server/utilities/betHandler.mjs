import DrawDAO from "../daos/draw_dao.mjs";
import BetDAO from "../daos/bet_dao.mjs";
import UserDAO from "../daos/user_dao.mjs";
import { Bet } from "../models/models.mjs";
import dayjs from "dayjs";

const drawDAO = new DrawDAO();
const betDAO = new BetDAO();
const userDAO = new UserDAO();

export default function BetHandler() {
    this.placeBet = async (username, numbers) => {
        try {
            // Controlli per validazione scommessa
            const draw = await drawDAO.getValidDraw();
            if (draw === null) {
                throw new Error("No valid draw available");
            }

            const currentTime = dayjs();
            if (currentTime > draw.draw_time) {
                throw new Error("Draw time expired");
            }

            const bets = await betDAO.getBetByUserAndDraw(username, draw.id);
            if (bets.length > 0) {
                throw new Error("User already placed a bet on this draw");
            }

            // controllo punti sufficienti
            const pointsSpent = 5 * numbers.length;
            const user = await userDAO.getUser(username);
            if (user === null) throw new Error("User not found");
            if (user.points < pointsSpent) throw new Error("Insufficient points");

            // Inserimento scommessa
            const bet = new Bet(username, draw.id, numbers, pointsSpent, 0, currentTime);
            await betDAO.insertBet(bet);

            // Aggiornamento punti utente
            user.points -= pointsSpent;
            await userDAO.updateUser(user);

            return draw.id;
        }
        catch (err) {
            throw err;
        }
    }
}