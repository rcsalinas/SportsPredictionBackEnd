import { Router } from "express";
import gamesData from "../data/games.json";
import { predictions } from "../memory/predictions";

const router = Router();

router.get("/:id", (req, res) => {
	console.log(`GET /games/${req.params.id} - Fetching game details`);
	const gameId = req.params.id;
	const game = gamesData.games.find((g: any) => g.id === gameId);

	if (!game) {
		return res.status(404).json({ message: "Game not found" });
	}

	return res.json(game);
});

router.get("/", (req, res) => {
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
