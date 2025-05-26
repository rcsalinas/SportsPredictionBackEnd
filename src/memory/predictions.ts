export type Prediction = {
	gameId: string;
	pick: string;
	amount: number;
	result: "pending" | "win" | "loss";
	payout?: number;
};

export const predictions: {
	[userId: string]: Prediction[];
} = {};
