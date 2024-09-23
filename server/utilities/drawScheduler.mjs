import { Draw } from "../models/models.mjs";
import { handleDrawCompletion } from "./drawCompletion.mjs";
import DrawDAO from "../daos/draw_dao.mjs";
import dayjs from "dayjs";

const drawDAO = new DrawDAO();


function generateRandomNumbers() {
    const numbers = new Array();

    while (numbers.length < 5) {
        const randomNumber = Math.floor(Math.random() * 90) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers;
}

async function createDraw() {
    const numbers = generateRandomNumbers();
    const created_at = dayjs();
    const draw_time = created_at.add(2, "minutes");

    const draw = new Draw(numbers, draw_time, created_at);

    let drawId = undefined;
    try {
        drawId = await drawDAO.insertNewDraw(draw)
    }
    catch (err) {
        console.log(err);
    }
    console.log("Draw inserted with id: " + drawId);

    const delay = draw_time.diff(dayjs(), "milliseconds");
    const drawTime = dayjs().add(delay, "milliseconds");
    console.log("Draw scheduled at: " + drawTime.format("HH:mm:ss"));

    setTimeout(() => {
        handleDrawCompletion(drawId);
    }, delay)
}

export function startDrawScheduler() {
    createDraw();
    setInterval(() => {
        createDraw();
    }, 2 * 60 * 1000);
}