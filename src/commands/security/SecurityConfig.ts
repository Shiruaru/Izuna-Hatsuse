import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class SecurityConfig extends Command {
		constructor(client: IzunaClient) {
				super(client, {
						name: "security_config",
						description: "Permet de configurer la fonction de sécurité",
						default_member_permissions: PermissionsBitField.Flags.Administrator,
						dm_permission: false,
						custom: false,
						owner: false,
						category: Categories.Security,
						options: [
								{
										name: "feature",
										description: "La fonctionnalité à configurer",
										type: ApplicationCommandOptionType.String,
										required: true, // TODO: Make it false and enable the user to get prompted by an embed along with a select menu to choose which feature to configure
										choices: [
												{ name: "anti-raid", value: "anti-raid" }
										]
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction){
				const feature = interaction.options.getString("feature");
				if (!feature) {
						interaction.reply("Unexpected error occured");
						logger.error("Unable to retrieve required option 'feature' for command 'security_config'")
						return
				}

				switch (feature) {
						case "anti-raid": 
								const antiDiscordInviteStatus = await this.client.databaseClient?.security.findFirst({
										select: {
												antiDiscordInvite: true
										},
										where: {
												guildId: interaction.guild?.id
										}
								})
								const embed = new EmbedBuilder()
										.setTitle("Sécurité Anti Raid")
										.setDescription("Supprime automatiquement tous les messages contenant une invitation discord")
										.addFields([
												{ name: "Status", value: antiDiscordInviteStatus?.antiDiscordInvite ? "🟢 Active" : "🔴 Disabled" }
										])
										.setColor("#7F0856")
										.setFooter({ text: `© Izuna` });

								
								// Buttons 
								const buttons = new ButtonBuilder()
										.setCustomId("toggle-anti-raid")
										.setLabel(antiDiscordInviteStatus?.antiDiscordInvite ? "Désactiver" : "Activer")
										.setStyle(antiDiscordInviteStatus?.antiDiscordInvite ? ButtonStyle.Danger : ButtonStyle.Primary);

								const row = new ActionRowBuilder<ButtonBuilder>()
										.addComponents(buttons);

								interaction.reply({ embeds: [embed], components: [row] })

								break

						default: 
								interaction.reply("Fonctionnalité non reconnue");
								logger.error("Wrong feature received from a choice option")
				}
		}
}
