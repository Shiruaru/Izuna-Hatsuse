import { CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import { ApplicationCommandOptionType } from "discord.js"
import logger from "../../utils/logger";
import { title } from "process";

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
										name: "description",
										description: "description du champ",
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
								},
								{
										name: "title",
										description: "titre du message",
										required: false,
										type: ApplicationCommandOptionType.String
								},
								{
										name: "message-id",
										description: "Id du message à enregistrer",
										required: false,
										type: ApplicationCommandOptionType.String
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				// Get the datas
				const description = interaction.options.getString("description")!;
				let messageId = interaction.options.getString("message-id");
				const reaction = interaction.options.getString("reaction")!;
				const role = interaction.options.getRole("role")!;
				const messageTitle = interaction.options.getString("title");

				if (!messageId && !messageTitle) {
						interaction.reply({ content: "Please provide a messageId or a title to proceed" });
						return 
				}

				if (messageId == null) {
						// create the message & set message id to the role reaction
            const embed = new EmbedBuilder()
                .setTitle(messageTitle)
                .setColor(this.client.config.embed_colors)
								.setFooter({ text: `© Izuna` });

						const meessage = await (interaction.channel as TextChannel).send({ embeds: [embed] })
						messageId = meessage.id
				} else if (!await this.client.databaseClient?.roleReaction.findFirst({
						where: {
								messageId: messageId
						}
				})) {
						interaction.reply({ content: "Invalid message provided", flags: ["Ephemeral"] });
						return
				} 

				// if the role reaction already exist, simply add the reaction to the embed

				// Add reaction to the message
				const message = await interaction.channel?.messages.fetch(messageId.toString());
				if (!message) {
						interaction.reply({ content: "Invalid message provided", flags: ["Ephemeral"] });
				}

				// recreate the embeds with the new fields
				const newEmbed = new EmbedBuilder()
						.setTitle(message?.embeds[0]?.title!)
						.setFields(
								...message?.embeds[0]?.fields!,
								{ name: `${reaction} | ${description}`, value: "" },
						)
						.setColor(this.client.config.embed_colors)
						.setFooter({ text: `© Izuna` });

				await message?.edit({ embeds: [newEmbed] })

				await message?.react(reaction)
				.catch(err => {
						interaction.reply({ content: "An error occured", flags: ["Ephemeral"] });
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

				interaction.reply({ flags: ["Ephemeral"], content: "Reaction role created" })
		}
}
