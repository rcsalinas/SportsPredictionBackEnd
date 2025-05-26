import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import gamesData from "./data/games.json";
import { connectInMemoryMongo, getDb } from "./mongo";
import gamesRouter from "./routes/games";
import { startGameSimulation } from "./simulation/gameSimulation";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*" },
});

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api/games", gamesRouter);

async function seedGames() {
	const db = getDb();
	const gamesCollection = db.collection("games");
	const count = await gamesCollection.countDocuments();
	if (count === 0) {
		await gamesCollection.insertMany(gamesData.games);
		console.log("Seeded games collection.");
	}
}

connectInMemoryMongo().then(async () => {
	await seedGames();
	startGameSimulation(io);

	server.listen(PORT, () => {
		console.log(`🚀 Server with WebSocket running at http://localhost:${PORT}`);
	});
});
