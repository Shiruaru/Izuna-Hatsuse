import { CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import { ApplicationCommandOptionType } from "discord.js"
import logger from "../../utils/logger";

export default class RoleReaction extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "role-reaction",
						description: "Créer un message pour les rôles reactions",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Mod,
						default_member_permissions: PermissionsBitField.Flags.MentionEveryone,
						options: [
								{
										name: "message-id",
										description: "Id du message à enregistrer",
										required: true,
										type: ApplicationCommandOptionType.String
								},
								{
										name: "reaction",
										description: "réaction à utiliser",
										required: true,
										type: ApplicationCommandOptionType.String
								},
								{
										name: "role",
										description: "Rôle à attribuer",
										required: true,
										type: ApplicationCommandOptionType.Role
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				// Get the datas
				const messageId = interaction.options.getString("message-id")!;
				const reaction = interaction.options.getString("reaction")!;
				const role = interaction.options.getRole("role")!;


				// Add reaction to the message
				const messgage = await interaction.channel?.messages.fetch(messageId.toString());
				if (!messgage) {
						interaction.reply("Invalid message provided");
				}

				await messgage?.react(reaction)
				.catch(err => {
						interaction.reply("An error occured");
						logger.warn(err);
				})


				// then save the role reaction to database
				await this.client.databaseClient?.roleReaction.create({
						data: {
								guildId: interaction.guildId!, // ok because dm_permission = false
								messageId: messageId,
								roleId: role.id,
								reaction: reaction
						}
				}).catch(err => {
						interaction.reply("An error occured")
						logger.error("An error occured saving data to database")
						console.log(err)
				})

				interaction.reply("Reaction role created")
		}
}
