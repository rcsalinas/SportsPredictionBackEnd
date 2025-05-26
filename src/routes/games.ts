import { Router, Request, Response } from "express";
import gamesData from "../data/games.json";
import { predictions, Prediction } from "../memory/predictions";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	console.log("GET /games - Returning all games data");
	res.json(gamesData);
});

router.post("/predict", (req, res) => {
	const { userId = "usr123", gameId, pick, amount } = req.body;

	console.log(
		`POST /games/predict - User: ${userId}, Game: ${gameId}, Pick: ${pick}, Amount: ${amount}`
	);

	if (!predictions[userId]) predictions[userId] = [];

	predictions[userId].push({
		gameId,
		pick,
		amount,
		result: "pending",
	});

	res.status(200).json({ message: "Prediction received!" });
});

export default router;
