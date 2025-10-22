import IzunaClient from "../../utils/classes/IzunaClient";
import Event from "../../utils/classes/Event";
import { Collection, Events, REST, Routes, TextChannel } from "discord.js";
import Command from "../../utils/classes/Command";
import logger from "../../utils/logger";
import Button from "../../utils/classes/Button";
import hoyoDaily from "../../utils/hoyoDaily";

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

				const commands = this.GetJson(this.client.commands);
				const buttons = this.GetJson(this.client.buttons)

				const interactions = [...commands, ...buttons];
				const rest = new REST().setToken(this.client.config.discord_token)

				await rest.put(Routes.applicationGuildCommands(this.client.config.client_id, this.client.config.test_server_id), {
						body: interactions
				})

				logger.status(`Successfuly deployed ${commands.length} commands`)


				this.client.channels.fetch('926874969399500804').then(channel => {
						(channel as TextChannel).send('Izuna Logged')
				}).catch(_ => logger.error('Unable to send login message'))

				hoyoDaily(this.client)
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
