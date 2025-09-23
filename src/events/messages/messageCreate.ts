import { Events, Message } from "discord.js";
import Event from "../../utils/classes/Event";
import IzunaClient from "../../utils/classes/IzunaClient";
import internal = require("stream");


export default class MessageCreate extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.MessageCreate,
						description: "Whenever a message is sent in a guild / in DM",
						once: false
				})
		}


		async Execute(message: Message) {
				if (message.channel.isDMBased()) return;
				const discordInviteProtection = await this.client.databaseClient?.security.findFirst({ where: { guildId: message.guild?.id } })

				console.log('Message received');
				if (discordInviteProtection?.antiDiscordInvite) {
						console.log("Toggling security ");
						if (message.content.includes("discord.gg/")) {
								await message.delete()
								return
						}
				}
				console.log(message.content)

		}
}
