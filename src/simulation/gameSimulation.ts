import { getDb } from "../mongo";
import { decrementClock, nextPeriod } from "../helpers/gameClock";
import { Server } from "socket.io";

export async function startGameSimulation(io: Server) {
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
				if (!game.clock) game.clock = "10:00";
				game.clock = decrementClock(game.clock, 60);

				if (game.clock === "0:00") {
					const next = nextPeriod(game.period || "1st");
					if (next) {
						game.period = next;
						game.clock = "10:00";
					} else {
						game.status = "final";
						const homeScore = game.homeTeam.score ?? 0;
						const awayScore = game.awayTeam.score ?? 0;
						game.winner =
							homeScore > awayScore
								? game.homeTeam.abbreviation
								: game.awayTeam.abbreviation;
						delete tickCounts[game.id];
						console.log(`Game ${game.id} finished.`);
					}
				}

				// Simulate score update (optional)
				game.homeTeam.score =
					(game.homeTeam.score ?? 0) + Math.floor(Math.random() * 3);
				game.awayTeam.score =
					(game.awayTeam.score ?? 0) + Math.floor(Math.random() * 3);

				await getDb()
					.collection("games")
					.updateOne({ id: game.id }, { $set: game });
			}
		}
		io.emit("gamesUpdate", await getDb().collection("games").find().toArray());
	}, 1000); // 1 second per tick
}
