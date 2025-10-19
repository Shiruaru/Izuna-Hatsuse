import { Events, Interaction } from "discord.js"
import Event from "../../utils/classes/Event"
import IzunaClient from "../../utils/classes/IzunaClient"
import logger from "../../utils/logger";

export default class InteractionCreate extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.InteractionCreate,
						description: "Intéraction de l'utilisateur",
						once: false
				})
		}

		async Execute(interaction: Interaction): Promise<void> {
				if (interaction.isChatInputCommand()) {
						// First check if the command is active on the server
						const command = this.client.commands.get(interaction.commandName);

						command?.Execute(interaction)
				} else if (interaction.isButton()) {
						console.log(interaction.customId)
						const command = this.client.buttons.get(interaction.customId);

						command?.Execute(interaction);
				} else {
						logger.error("Method not supported for interaction")
				}
		}
}
