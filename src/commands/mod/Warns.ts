import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Embed, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class Warns extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "warns",
						description: "Liste les différents warns",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Mod,
						default_member_permissions: PermissionsBitField.Flags.MuteMembers,
						options: [
								{
										name: "user",
										description: "Utilisateur précis",
										type: ApplicationCommandOptionType.User,
										required: false
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const user = interaction.options.getUser("user");


				let warns = null;

				warns = await this.client.databaseClient?.warn.findMany({
						where: {
								guildId: interaction.guild?.id,
								...(user && { memberId:user.id })
						}
				});

				if (!warns || warns.length === 0) {
						return interaction.reply({ content: "No warn founds" });
				}

				// Await all promises from the map operation
				const embedPromises = warns.map(async (warn) => {
						let user = interaction.guild?.members.cache.get(warn.memberId);

						if (!user) {
								user = await interaction.guild?.members.fetch(warn.memberId);
								console.log("Fetching user : ", user?.displayName);
						}

						let embed = new EmbedBuilder();
						embed.setTitle(`Avertissement de ${user?.displayName || 'Utilisateur Inconnu'}`)
								.addFields(
										{ name: 'Raison', value: `${warn.reason || 'Aucune raison fournie'}` },
										{ name: 'Auteur', value: `${warn.authorId ? `<@${warn.authorId}>` : 'Inconnu'}` }
								)
								.setFooter({ text: `ID de l'avertissement: ${warn.id} | © Izuna` });

						return embed;
				});

				// Wait for all embeds to be created
				const embeds = await Promise.all(embedPromises);

				// Now reply with all the embeds
				await interaction.reply({ embeds: embeds });
		}
}
