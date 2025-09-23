import { glob } from "glob";
import path = require("path");
import IHandler from "../interfaces/IHandler";
import IzunaClient from "./IzunaClient";
import Event from "./Event";
import Command from "./Command";
import logger from "../logger";
import Button from "./Button";

export default class Handler implements IHandler {
		client: IzunaClient

		constructor(client: IzunaClient) {
				this.client = client
		}

		async LoadEvents() {
				console.log('Loading events')
				// using glob to retrieve all the event files
				const eventFiles = (await glob('src/events/**/*.ts')).map(filepath => path.resolve(filepath))

				eventFiles.map(async (file: string) => {
						const event: Event = (await new(await import(file)).default(this.client))

						if (!event.name) return delete require.cache[require.resolve(file)] && logger.propError(file.split('/').pop()!, "name", "event")

						if (!event.Execute) return delete require.cache[require.resolve(file)] && logger.propError(file.split('/').pop()!, "Execute", "event")


						const execute = (...args: any) => event.Execute(...args);


						//@ts-ignore
						if (event.once) this.client.once(event.name, execute)
								//@ts-ignore
								else this.client.on(event.name, execute)

						logger.event(event.name)
						return delete require.cache[require.resolve(file)]
				})
				// require them
		}
		async LoadCommands() {
				const commandFiles = (await glob('src/commands/**/*.ts')).map(file => path.resolve(file))

				commandFiles.map( async (file: string) => {
						const command: Command = new (await import(file)).default(this.client)

						if (!command.name) return delete require.cache[require.resolve(file)] && logger.propError(file.split('/').pop()!, "name", "command")

						this.client.commands.set(command.name, command)
						logger.command(command.name)

						return delete require.cache[require.resolve(file)]
				})
		}

		async LoadButtons() {
				// Also loading buttons in client.commands for deployment purpose
				const buttonFiles = (await glob('src/buttons/**/*.ts')).map(file => path.resolve(file))

				buttonFiles.map( async (file: string) => {
						const button: Button = new (await import(file)).default(this.client)

						if (!button.name) return delete require.cache[require.resolve(file)] && logger.propError(file.split('/').pop()!, "name", "command")

						this.client.buttons.set(button.name, button)
						logger.command(button.name)

						return delete require.cache[require.resolve(file)]
				})
		}
}
