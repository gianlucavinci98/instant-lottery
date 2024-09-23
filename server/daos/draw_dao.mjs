import { Draw } from "../models/models.mjs";
import db from "../utilities/db.mjs";

export default function DrawDAO() {
    this.insertNewDraw = (draw) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO draws (numbers, draw_time, created_at) VALUES (?, ?, ?)";
            db.run(query, [JSON.stringify(draw.numbers), draw.draw_time.format("YYYY-MM-DD HH:mm:ss"), draw.created_at.format("YYYY-MM-DD HH:mm:ss")], function (err) {
                if (err) {
                    reject(err);
                }
                else resolve(this.lastID);
            })
        })
    }

    this.getValidDraw = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM draws WHERE completed=false ORDER BY created_at DESC";
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (rows.length > 1) {
                        reject(new Error("More than one active draw"));
                    }
                    if (rows.length > 0) {
                        const draw = new Draw(JSON.parse(rows[0].numbers), rows[0].draw_time, rows[0].created_at, rows[0].completed, rows[0].id);
                        resolve(draw);
                    }
                    else {
                        resolve(null);
                    }
                }
            })
        })
    }

    this.getDrawById = (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM draws WHERE id=?";
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (row === undefined) {
                        reject(new Error("Draw not found"));
                    }
                    else {
                        const draw = new Draw(JSON.parse(row.numbers), row.draw_time, row.created_at, row.completed, row.id);
                        resolve(draw);
                    }
                }
            });
        })
    }

    this.closeDraw = (id) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE draws SET completed=true WHERE id=?";
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        })
    }

    this.getComepletedDraws = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM draws WHERE completed=true";
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const draws = rows.map(
                        (row) => new Draw(JSON.parse(row.numbers), row.draw_time, row.created_at, row.completed, row.id)
                    );
                    resolve(draws);
                }
            });
        })
    }

    this.resetDraws = () => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE draws SET completed=true WHERE completed=false";
            db.run(query, [], function (err) {
                if (err) {
                    console.log("error resetting draws");
                    reject(err);
                }
                else {
                    console.log("### Draws reset");
                    resolve();
                }
            });
        })
    }
}