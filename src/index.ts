import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import gamesData from "./data/games.json";
import { connectInMemoryMongo, getDb } from "./mongo";
import gamesRouter from "./routes/games";

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

	// Example: update game status and scores every 10 seconds
	const tickCounts: Record<string, number> = {};
	const games = await getDb().collection("games").find().toArray();
	games.forEach((game: any) => {
		if (game.status === "inProgress") {
			tickCounts[game.id] = 6;
		}
	});

	setInterval(async () => {
		const games = await getDb().collection("games").find().toArray();
		for (const game of games) {
			if (game.status === "inProgress") {
				const ticksLeft = tickCounts[game.id] ?? 0;
				if (ticksLeft <= 0) {
					game.status = "final";
					const homeScore = game.homeTeam.score ?? 0;
					const awayScore = game.awayTeam.score ?? 0;
					game.winner =
						homeScore > awayScore
							? game.homeTeam.abbreviation
							: game.awayTeam.abbreviation;
					delete tickCounts[game.id];
					console.log(`Game ${game.id} finished.`);
				} else {
					game.homeTeam.score =
						(game.homeTeam.score ?? 0) + Math.floor(Math.random() * 3);
					game.awayTeam.score =
						(game.awayTeam.score ?? 0) + Math.floor(Math.random() * 3);
					game.clock = `${Math.floor(Math.random() * 10)}:${Math.floor(
						Math.random() * 59
					)
						.toString()
						.padStart(2, "0")}`;
					game.period = "3rd";
					tickCounts[game.id] = ticksLeft - 1;
					console.log(
						`Game ${game.id} updated, ticks left: ${tickCounts[game.id]}`
					);
				}
				await getDb()
					.collection("games")
					.updateOne({ id: game.id }, { $set: game });
			}
		}
		io.emit("gamesUpdate", await getDb().collection("games").find().toArray());
	}, 10000);

	server.listen(PORT, () => {
		console.log(`🚀 Server with WebSocket running at http://localhost:${PORT}`);
	});
});
