CREATE TABLE Users (
    username TEXT PRIMARY KEY,
    password TEXT,
    salt TEXT,
    points INTEGER DEFAULT 100
);
CREATE TABLE Draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numbers TEXT,
    -- Memorizza i numeri estratti come una stringa JSON
    draw_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP completed BOOLEAN DEFAULT false
);
CREATE TABLE Bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    draw_id INTEGER,
    bet_numbers TEXT,
    -- Memorizza i numeri scommessi come una stringa JSON
    points_spent INTEGER,
    points_won INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(username),
    FOREIGN KEY(draw_id) REFERENCES Draws(id)
);