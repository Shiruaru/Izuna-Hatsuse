import { Collection, Events, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import Event from "../../utils/classes/Event";
import IzunaClient from "../../utils/classes/IzunaClient";

type Mess = {
		content: string,
		id: string,
		channel: string
		timestamp: number
}

const TIME_WINDOW = 30000;
const THRESHOLD = 5;

export default class MessageCreate extends Event {
	 userMessageMap: Collection<string, Mess[]>
		

		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.MessageCreate,
						description: "Whenever a message is sent in a guild / in DM",
						once: false
				})
				this.userMessageMap = new Collection()
		}


		async Execute(message: Message) {
				if (message.channel.isDMBased()) return;
				const securityTable = await this.client.databaseClient?.security.findFirst({ where: { guildId: message.guild?.id } })

				console.log('Message received');
				if (securityTable?.antiDiscordInvite) {
						console.log("Toggling security ");
						if (message.content.includes("discord.gg/") && !message.member?.permissions.has(PermissionFlagsBits.MentionEveryone)) {
								await message.delete()
								return
						}
				}

				// Anti-Spam
				if (securityTable?.antiSpam) {
						const userId = message.author.id;
						const now = Date.now()

						// Add message to map
						const data = this.userMessageMap.get(userId) || [];
						const recent = data.filter(m => now - m.timestamp < TIME_WINDOW);
						recent.push({ id: message.id, channel: message.channelId, content: message.content, timestamp: now})

						// Detect Spam
						const filter = recent.filter(m => m.content === message.content);
						if (filter.length >= THRESHOLD) {
								// first timeout the user
								message.member?.timeout(2 * 60 * 60 * 1000, "Spamming")
								for (let mess of filter) {
										// retrieve the mesage
										const channel = await message.guild?.channels.fetch(mess.channel);
										if (!channel || !channel.isTextBased) continue

										const msg  = await (channel as TextChannel).messages.fetch(mess.id)
										msg.delete()
								}
						}
				}

				console.log(message.content)
		}
}
