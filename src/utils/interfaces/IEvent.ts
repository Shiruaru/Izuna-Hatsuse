import { Events } from "discord.js";
import IzunaClient from "../classes/IzunaClient";

export default interface IEvent {
	client: IzunaClient,
	name: Events,
	description: string,
	once: boolean

	Execute(...args: any): void;
}
