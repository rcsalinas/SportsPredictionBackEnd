import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import gamesRouter from "./routes/games";
import gamesData from "./data/games.json";
import { predictions } from "./memory/predictions";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*" },
});

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api/games", gamesRouter);

// WebSocket connection
io.on("connection", (socket) => {
	console.log("Client connected:", socket.id);

	// Emit initial games data
	socket.emit("gamesUpdate", gamesData.games);

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);
	});
});

const tickCounts: Record<string, number> = {};

gamesData.games.forEach((game) => {
	if (game.status === "inProgress") {
		tickCounts[game.id] = 6; // simulate 1 minute updates x6 => ends after ~60 seconds
	}
});

setInterval(() => {
	gamesData.games.forEach((game) => {
		if (game.status === "inProgress") {
			const ticksLeft = tickCounts[game.id] ?? 0;

			if (ticksLeft <= 0) {
				// End the game
				game.status = "final";

				Object.entries(predictions).forEach(([userId, userPreds]) => {
					userPreds.forEach((p) => {
						if (p.gameId === game.id && p.result === "pending") {
							p.result = p.pick === game.winner ? "win" : "loss";
							if (p.result === "win") {
								p.payout = p.amount * 1.9;
							}
						}
					});
				});

				const homeScore = game.homeTeam.score ?? 0;
				const awayScore = game.awayTeam.score ?? 0;

				game.winner =
					homeScore > awayScore
						? game.homeTeam.abbreviation
						: game.awayTeam.abbreviation;

				delete tickCounts[game.id]; // Clean up
				console.log(`Game ${game.id} finished.`);
			} else {
				// Simulate score update
				game.homeTeam.score =
					(game.homeTeam.score ?? 0) + Math.floor(Math.random() * 3);
				game.awayTeam.score =
					(game.awayTeam.score ?? 0) + Math.floor(Math.random() * 3);
				game.clock = `${Math.floor(Math.random() * 10)}:${Math.floor(
					Math.random() * 59
				)
					.toString()
					.padStart(2, "0")}`;
				game.period = "3rd"; // optional, static
				tickCounts[game.id] = ticksLeft - 1;
				console.log(
					`Game ${game.id} updated, ticks left: ${tickCounts[game.id]}`
				);
			}
		}
	});

	io.emit("gamesUpdate", gamesData.games);
}, 10000); // every 10 seconds

server.listen(PORT, () => {
	console.log(`🚀 Server with WebSocket running at http://localhost:${PORT}`);
});
