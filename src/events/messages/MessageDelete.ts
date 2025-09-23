import { Embed, EmbedBuilder, Events, Message } from "discord.js";
import Event from "../../utils/classes/Event";
import IzunaClient from "../../utils/classes/IzunaClient";
import internal = require("stream");
import logger from "../../utils/logger";


export default class MessageCreate extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.MessageDelete,
						description: "Whenever a message is deleted in a guild / in DM",
						once: false
				})
		}

		async Execute(message: Message) {
				if (message.channel.isDMBased()) return;

				console.log("Message deleted");
				// Check if the guild has enabled messages logs
				const logStatus = await this.client.databaseClient?.logs.findFirst(
						{ where: { guildId: message.guild?.id }
				});

				if (!logStatus?.messageLogStatus || !logStatus.messageLogChannel) return;

				const channel = await message.guild?.channels.fetch(logStatus.messageLogChannel)
				if (!channel || !channel.isSendable()) {
						logger.warn("Invalid log channel defined for " + message.guild?.name);
						return
				}

				const executor = (await message.guild?.fetchAuditLogs())?.entries.first()?.executor;

				const deletionEmbed = new EmbedBuilder()
						.setTitle("Message Supprimé")
						.setColor(this.client.config.embed_colors)
						.setFields([
								{ name: "Auteur", value: `${message.author}` },
								{ name: "Supprimé Par", value: `${executor}`  },
								{ name: "Contenus", value: `\`\`\`${message.content}\`\`\`` }
						])
				channel.send({ embeds: [deletionEmbed] });

		}
}
