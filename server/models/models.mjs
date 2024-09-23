import dayjs from "dayjs";

function User(username, email, password, salt, points = 100) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.points = points;
}

function Bet(user_id, draw_id, bet_numbers, points_spents, points_won, created_at, id = undefined) {
    this.user_id = user_id;
    this.draw_id = draw_id;
    this.bet_numbers = bet_numbers;
    this.points_spents = points_spents;
    this.points_won = points_won;
    this.created_at = dayjs(created_at);
    this.id = id;
}

// Il parametro numbers qui è un array di interi
function Draw(numbers, draw_time, created_at, completed = false, id = undefined) {
    this.numbers = numbers;
    this.created_at = dayjs(created_at);
    this.draw_time = dayjs(draw_time);
    this.completed = !!completed;
    this.id = id;
}

export { User, Bet, Draw };