import { Bet } from "../models/models.mjs";
import db from "../utilities/db.mjs";
import dayjs from "dayjs";

export default function BetDAO() {
    this.getBetByUserAndDraw = (user, drawId) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM bets WHERE user_id = ? AND draw_id = ?";
            db.all(query, [user, drawId], (err, rows) => {
                if (err) reject(err);
                else {
                    const bets = rows.map(
                        (row) => new Bet(row.user_id, row.draw_id, JSON.parse(row.bet_numbers), row.points_spent, row.points_won, row.created_at, row.id)
                    );
                    resolve(bets);
                }
            })
        })
    }

    this.insertBet = (bet) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO bets (user_id, draw_id, bet_numbers, points_spent, points_won, created_at) VALUES (?, ?, ?, ?, ?, ?)";
            db.run(query, [bet.user_id, bet.draw_id, JSON.stringify(bet.bet_numbers), bet.points_spents, bet.points_won, bet.created_at.format("YYYY-MM-DD HH:mm:ss")], function (err) {
                if (err) {
                    reject(err);
                }
                else resolve(this.lastID);
            })
        })
    }

    this.getBetsByDraw = (drawId) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM bets WHERE draw_id = ?";
            db.all(query, [drawId], (err, rows) => {
                if (err) reject(err);
                else {
                    const bets = rows.map(
                        (row) => new Bet(row.user_id, row.draw_id, JSON.parse(row.bet_numbers), row.points_spent, row.points_won, row.created_at, row.id)
                    );
                    resolve(bets);
                }
            })
        })
    }

    this.updateBet = (bet) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE bets SET points_won=? WHERE id=?";
            db.run(query, [bet.points_won, bet.id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        })
    }

    this.getBetsByUser = (username) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM bets WHERE user_id = ?";
            db.all(query, [username], (err, rows) => {
                if (err) reject(err);
                else {
                    const bets = rows.map(
                        (row) => new Bet(row.user_id, row.draw_id, JSON.parse(row.bet_numbers), row.points_spent, row.points_won, row.created_at, row.id)
                    );
                    resolve(bets);
                }
            })
        })
    }

    this.getActiveBetsByUser = (username) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM bets, draws WHERE bets.draw_id=draws.id AND draws.completed = false AND user_id = ?";
            db.all(query, [username], (err, rows) => {
                if (err) reject(err);
                else {
                    const bets = rows.map(
                        (row) => {
                            return {
                                user_id: row.user_id,
                                bet_numbers: JSON.parse(row.bet_numbers),
                                points_spent: row.points_spent,
                                created_at: dayjs(row.created_at).format("YYYY-MM-DD HH:mm:ss")
                            }
                        }
                    );
                    resolve(bets);
                }
            })
        })
    }
}
