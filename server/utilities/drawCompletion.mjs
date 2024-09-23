import DrawDAO from "../daos/draw_dao.mjs";
import BetDAO from "../daos/bet_dao.mjs";
import UserDAO from "../daos/user_dao.mjs";

const drawDAO = new DrawDAO();
const betDAO = new BetDAO();
const userDAO = new UserDAO();

function calculatePoints(pointsSpent, correctNumbers, totalNumbers) {
    if (correctNumbers === totalNumbers) {
        return pointsSpent * 2;
    } else if (correctNumbers === 0) {
        return 0;
    } else {
        return Math.floor(2 * pointsSpent * correctNumbers / totalNumbers);
    }
}

export async function handleDrawCompletion(drawId) {
    try {
        console.log("Handling draw completion for draw with id: " + drawId);

        await drawDAO.closeDraw(drawId);

        const draw = await drawDAO.getDrawById(drawId);
        const drawNumbers = draw.numbers;

        const bets = await betDAO.getBetsByDraw(drawId);

        for (const bet of bets) {
            const betNumbers = bet.bet_numbers;
            const correctNumbers = betNumbers.filter((number) => drawNumbers.includes(number));

            const pointsWon = calculatePoints(bet.points_spents, correctNumbers.length, betNumbers.length);
            if (pointsWon > 0) {
                bet.points_won = pointsWon;
                await betDAO.updateBet(bet);
            }

            const user = await userDAO.getUser(bet.user_id);
            user.points += pointsWon;
            await userDAO.updateUser(user);
        }

    }
    catch (err) {
        throw err;
    }
}