import { Events } from "discord.js";
import IEvent from "../interfaces/IEvent";
import IEventData from "../interfaces/IEventData";
import IzunaClient from "./IzunaClient";

export default class Event implements IEvent {
		client: IzunaClient;
		name: Events;
		description: string;
		once: boolean;

		Execute(...args: any): void {
				throw new Error("Method not implemented.");
		}

		constructor(Izuna: IzunaClient, eventData: IEventData) {
				this.client = Izuna,
				this.name = eventData.name,
				this.description = eventData.description,
				this.once = eventData.once
		}
}
