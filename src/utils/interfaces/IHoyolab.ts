import HoyoGames from "../enums/HoyoGames";

export default interface IHoyolab {
	user_id: string,
	ltuid_v2: string,
	ltoken_v2: string,
	games : [{
		game: HoyoGames,
		uid: string,
		status: boolean,
		dailyClaim: boolean,
	}]
}
