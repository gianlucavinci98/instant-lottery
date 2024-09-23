import sqlite3 from 'sqlite3';
sqlite3.verbose();

const database_path = "./";
const db = new sqlite3.Database(database_path + 'instant_lottery.db', (err) => {
    if (err) throw err;
    else {
        // Verifico se il file SQLite è valido eseguendo una query di prova
        db.get("SELECT username FROM Users LIMIT 1", (err, row) => {
            if (err) {
                console.error('Invalid SQLite database file:', err.message);
                throw err;
            } else {
                console.log('SQLite database file is valid.');
            }
        });
    }
});

export default db;