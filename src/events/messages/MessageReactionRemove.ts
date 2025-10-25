import { Embed, EmbedBuilder, Events, Message, MessageReaction, MessageReactionEventDetails, TextChannel, User } from "discord.js";
import Event from "../../utils/classes/Event";
import IzunaClient from "../../utils/classes/IzunaClient";
import internal = require("stream");
import logger from "../../utils/logger";


export default class MessageReactionRemove extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.MessageReactionRemove,
						description: "Whenever a reaction is added to a message (guild / dm)",
						once: false
				})
		}

		async Execute(reaction: MessageReaction, user: User)  {
				console.log("Message reaction");


				// First check if the reaction comes from an old message (priot to bot start = partials)
				if (reaction.partial) {
						console.log("partial received")
						try {
								await reaction.fetch()
						} catch (err) {
								logger.error("Error fetching old message data from reaction")
								console.log(err)
								return
						}
				}

				if (reaction.message.channel.isDMBased()) return;
				
				// Check if this reaciton is linked to a message reaction (messageId + guildID)
				const roleReaction = await this.client.databaseClient?.roleReaction.findFirst(
						{ where: { 
								guildId: reaction.message.guildId!,
								messageId: reaction.message.id,
								reaction: reaction.emoji.toString()
						}
				});

				if (!roleReaction || !roleReaction.roleId) return;

				const role = await reaction.message.guild?.roles.fetch(roleReaction.roleId)
				if (!role) {
						// dont want to send any message in case it trigger for non roleReaction cases
						logger.warn("Invalid role defined for " + reaction.message.guild?.name + ": messageId -> " + reaction.message.id); 
						return
				}

				// Check if the member already have the role
				const member = await reaction.message.guild?.members.fetch(user.id);
				if (!member?.roles.cache.get(roleReaction.roleId)) {
						return
				}

				if (!member) {
						logger.error('Cannot find member who instanciated the reaction')
						return
				}

				const result = await member.roles.remove(roleReaction.roleId)
		}
}
