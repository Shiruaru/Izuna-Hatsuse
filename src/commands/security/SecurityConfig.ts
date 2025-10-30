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
												{ name: "anti-raid", value: "anti-raid" },
												{ name: "anti-spam", value: "anti-spam" }
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

				let securityConfig  = await this.client.databaseClient?.security.findFirst({
						where: {
								guildId: interaction.guildId!
						}
				})

				if (!securityConfig) {
						securityConfig = await this.client.databaseClient?.security.create({
								data: {
										guildId: interaction.guildId!,
										antiSpam: false,
										antiDiscordInvite: false
								}
						})
				}

				switch (feature) {
						case "anti-raid": {
								const embed = new EmbedBuilder()
										.setTitle("Sécurité Anti Raid")
										.setDescription("Supprime automatiquement tous les messages contenant une invitation discord")
										.addFields([
												{ name: "Status", value: securityConfig?.antiDiscordInvite ? "🟢 Active" : "🔴 Disabled" }
										])
										.setColor("#7F0856")
										.setFooter({ text: `© Izuna` });

								
								// Buttons 
								const buttons = new ButtonBuilder()
										.setCustomId("toggle-anti-raid")
										.setLabel(securityConfig?.antiDiscordInvite ? "Désactiver" : "Activer")
										.setStyle(securityConfig?.antiDiscordInvite ? ButtonStyle.Danger : ButtonStyle.Primary);

								const row = new ActionRowBuilder<ButtonBuilder>()
										.addComponents(buttons);

								interaction.reply({ embeds: [embed], components: [row] })

								break;

						}
						case "anti-spam": {
								const embed = new EmbedBuilder()
										.setTitle("Sécurité Anti Spam")
										.setDescription("Détecte et supprime les cas de spam, timeout l'utilisateur responsable")
										.addFields([
												{ name: "Status", value: securityConfig?.antiSpam ? "🟢 Active" : "🔴 Disabled" }
										])
										.setColor("#7F0856")
										.setFooter({ text: `© Izuna` });

								
								// Buttons 
								const buttons = new ButtonBuilder()
										.setCustomId("toggle-anti-spam")
										.setLabel(securityConfig?.antiSpam ? "Désactiver" : "Activer")
										.setStyle(securityConfig?.antiSpam ? ButtonStyle.Danger : ButtonStyle.Primary);

								const row = new ActionRowBuilder<ButtonBuilder>()
										.addComponents(buttons);

								interaction.reply({ embeds: [embed], components: [row] })

								break;

						}

						default: 
								interaction.reply("Fonctionnalité non reconnue");
								logger.error("Wrong feature received from a choice option");
				}
		}
}
