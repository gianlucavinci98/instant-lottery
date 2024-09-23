import { User } from "../models/models.mjs";
import db from "../utilities/db.mjs";
import crypto from 'crypto';

export default function UserDAO() {
    this.getAllUsers = () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users";
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const users = rows.map((row) => new User(row.username, row.email, row.password, row.salt, row.points));
                    resolve(users);
                }
            });
        })
    }

    this.getUser = (username) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE username=?";
            db.get(query, [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (row === undefined) {
                        resolve(null);
                    }
                    else {
                        const user = new User(row.username, row.email, row.password, row.salt, row.points);
                        resolve(user);
                    }
                }
            });
        })
    }

    this.updateUser = (user) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE users SET email=?, password=?, salt=?, points=? WHERE username=?";
            db.run(query, [user.email, user.password, user.salt, user.points, user.username], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        })
    }

    this.getUserAccess = (username, password) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE username=?";
            db.get(query, [username], (err, row) => {
                if (err) reject(err);
                else if (row === undefined) resolve(null);
                else {
                    const user = { username: row.username };

                    crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) resolve(false);
                        resolve(user);
                    })
                }
            })
        })
    }
}