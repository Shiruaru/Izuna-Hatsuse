import { Events } from "discord.js";

export default interface IEventData {
	name: Events,
	description: string,
	once: boolean
}
