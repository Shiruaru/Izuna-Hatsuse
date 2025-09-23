import IzunaClient from "../../utils/classes/IzunaClient";
import Event from "../../utils/classes/Event";
import { Collection, Events, REST, Routes } from "discord.js";
import Command from "../../utils/classes/Command";
import logger from "../../utils/logger";
import Button from "../../utils/classes/Button";

export default class Ready extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.ClientReady,
						description: "Izuna is online on dev",
						once: true
				})
		}

		async Execute() {
				console.log('Izuna is online on dev environment')
		}

		GetJson(commands: Collection<string, Command | Button>): object[] {
				const data: object[] = []
				commands.forEach(command => {
						data.push({
								name: command.name,
								description: command.description,
								options: command.options,
								default_member_permissions: command.default_member_permissions.toString(),
								dm_permission: command.dm_permission
						})
				})

				return data
		}
}
