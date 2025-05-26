import { Router } from "express";
import { getDb } from "../mongo";

const router = Router();

// POST /predictions - Store a prediction in MongoDB
router.post("/", async (req, res) => {
	const { userId = "usr123", gameId, pick, amount } = req.body;

	console.log(
		`POST /predictions - User: ${userId}, Game: ${gameId}, Pick: ${pick}, Amount: ${amount}`
	);

	// Check if the game has already ended
	const game = await getDb().collection("games").findOne({ id: gameId });
	if (!game) {
		return res.status(404).json({ message: "Game not found." });
	}
	if (game.status === "final") {
		return res
			.status(400)
			.json({ message: "You cannot predict on a finished game." });
	}

	// Check if the user already has a prediction for this game
	const existing = await getDb()
		.collection("predictions")
		.findOne({ userId, gameId });

	if (existing) {
		return res
			.status(400)
			.json({ message: "You have already placed a prediction on this game." });
	}

	const prediction = {
		userId,
		gameId,
		pick,
		amount,
		result: "pending",
	};

	await getDb().collection("predictions").insertOne(prediction);

	res.status(200).json({ message: "Prediction received!" });
});

// GET /predictions - Get all predictions for a user
router.get("/", async (req, res) => {
	const userIdRaw = req.query.userId;
	let userId: string = "usr123";

	if (typeof userIdRaw === "string") {
		userId = userIdRaw;
	} else if (Array.isArray(userIdRaw) && typeof userIdRaw[0] === "string") {
		userId = userIdRaw[0];
	}

	console.log(`GET /predictions - Fetching predictions for user: ${userId}`);

	const userPredictions = await getDb()
		.collection("predictions")
		.find({ userId })
		.toArray();

	if (!userPredictions.length) {
		return res
			.status(404)
			.json({ message: "No predictions found for this user" });
	}

	return res.json({ predictions: userPredictions });
});

// DELETE /predictions/:id - Delete a prediction by its MongoDB _id
router.delete("/:id", async (req, res) => {
	const predictionId = req.params.id;

	try {
		const result = await getDb()
			.collection("predictions")
			.deleteOne({ _id: new (require("mongodb").ObjectId)(predictionId) });

		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Prediction not found." });
		}

		return res.status(200).json({ message: "Prediction deleted." });
	} catch (err) {
		return res.status(400).json({ message: "Invalid prediction ID." });
	}
});

export default router;
