import { ColorResolvable } from "discord.js"

export default interface IConfig {
		discord_token: string 
		wanikani_token: string
		client_id: string
		test_server_id: string
		embed_colors: ColorResolvable
}
