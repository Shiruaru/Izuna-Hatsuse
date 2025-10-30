import { Collection, EmbedBuilder, Events, Message, PermissionFlagsBits, TextChannel } from "discord.js";
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
						console.log("security enabled")
						const userId = message.author.id;
						const now = Date.now()

						// Add message to map
						const data = this.userMessageMap.get(userId) || [];
						const recent = data.filter(m => now - m.timestamp < TIME_WINDOW);
						recent.push({ id: message.id, channel: message.channelId, content: message.content, timestamp: now})
						this.userMessageMap.set(userId, recent)

						// Detect Spam
						const filter = recent.filter(m => m.content === message.content);
						if (filter.length == THRESHOLD) { // Not using >= to avoid detection spamming due to await / async
								// first timeout the user
								message.member?.timeout(2 * 60 * 60 * 1000, "Spamming")
								for (let mess of filter) {
										// retrieve the mesage
										const channel = await message.guild?.channels.fetch(mess.channel);
										if (!channel || !channel.isTextBased) continue;

										// and delete them
										const msg  = await (channel as TextChannel).messages.fetch(mess.id);
										msg.delete();

								}
								// send log if log channel configured
								const logChannels = await this.client.databaseClient?.logs.findFirst({
										where: {
												guildId: message.guildId!
										}
								})

								if (!logChannels || !logChannels.adminLogChannel || !logChannels.adminLogStatus) return;

								const logChannel = await message.guild?.channels.fetch(logChannels.adminLogChannel);
								if (!logChannel?.isSendable()) return;

								const logEmbed = new EmbedBuilder()
										.setTitle("Spam detected")
										.setDescription(`User ${message.member?.user} was detected for spamming.`)
										.setFields([
												{ name: "Message", value: filter[0].content }
										])
										.setColor('Red');


								// get the role mod to ping, or else send nothin 
								await (logChannel as TextChannel).send({ content: `${securityTable.moderatorRoles ? `<@&${securityTable.moderatorRoles}>` : ""}`, embeds: [logEmbed] });
						}

				}

				console.log(message.content)
		}
}
