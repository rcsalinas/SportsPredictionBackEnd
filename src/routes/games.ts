import { Router } from "express";
import { getDb } from "../mongo";

const router = Router();

// GET /games/:id - Fetch a single game by ID from in-memory MongoDB
router.get("/:id", async (req, res) => {
	console.log(`GET /games/${req.params.id} - Fetching game details`);
	const gameId = req.params.id;
	const game = await getDb().collection("games").findOne({ id: gameId });

	if (!game) {
		return res.status(404).json({ message: "Game not found" });
	}

	return res.json(game);
});

// GET /games - Return all games from in-memory MongoDB
router.get("/", async (req, res) => {
	console.log("GET /games - Returning all games data");
	const games = await getDb().collection("games").find().toArray();
	res.json({ games });
});

export default router;
