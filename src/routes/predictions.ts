import { Router } from "express";
import { getDb } from "../mongo";

const router = Router();

// POST /predictions - Store a prediction in MongoDB
router.post("/", async (req, res) => {
	const { userId = "usr123", gameId, pick, amount } = req.body;

	console.log(
		`POST /predictions - User: ${userId}, Game: ${gameId}, Pick: ${pick}, Amount: ${amount}`
	);

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

export default router;
