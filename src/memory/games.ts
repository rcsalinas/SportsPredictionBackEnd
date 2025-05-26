export type Team = {
	name: string;
	abbreviation: string;
	record: string;
	score?: number;
};

export type Odds = {
	spread: string;
	favorite: string;
};

export type Game = {
	id: string;
	status: string;
	period?: string;
	clock?: string;
	homeTeam: Team;
	awayTeam: Team;
	odds?: Odds;
	winner?: string;
};

export const games: Game[] = [];
