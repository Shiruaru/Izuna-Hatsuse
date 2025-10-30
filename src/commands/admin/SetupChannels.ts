import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class Setup extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "setup_channels",
						description: "Configuration des salons du serveur",
						category: Categories.Admin,
						dm_permission: false,
						owner: false,
						custom: false,
						options: [
								{
										name: "channel_type",
										description: "Rôle à configurer",
										type: ApplicationCommandOptionType.String,
										required: true,
										choices: [
												{ name: "welcome", value: "guild_wlc" },
												{ name: "rule", value: "guild_rule" },
												{ name: "warn", value: "guild_warn" },
												{ name: "message_logs", value: "log_message" },
												{ name: "admin_logs", value: "log_admin" },
												{ name: "member_logs", value: "log_member" },
										]
								},
								{
										name: "salon",
										description: "le salon à assigner",
										type: ApplicationCommandOptionType.Channel,
										required: true
								},
								{ 
										name: "status",
										description: "status des logs, utile uniquement pour les logs",
										type: ApplicationCommandOptionType.Boolean,
										required: true
								}
						],
						default_member_permissions: PermissionsBitField.Flags.Administrator
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const configChannel = interaction.options.getString("channel_type");
				const channel = interaction.options.getChannel("salon");
				const status = interaction.options.getBoolean("status") || false;

				if (!interaction.guild?.id) {
						interaction.reply("Command not available in DM");
						logger.error("Guild command was used in DM");
						return
				}

				if (!configChannel || !channel) {
						interaction.reply("An error occured : required argument were missing");
						logger.error("Required argument were missing for command 'setup_channels'");
						return
				}

				let channel_type = configChannel?.startsWith("guild_") ? "guild" : "log";

				if (channel_type == "guild") {
						const channelConfigName = configChannel?.split("_")[1] + "Channel";
						const created = await this.client.databaseClient?.guild.update({
								where: {
										id: interaction.guild.id
								},
								data: {
										[channelConfigName]: channel.id
								}
								
						})

						if (!created) {
								interaction.reply("An error occured saving the changes");
								logger.error("Unable to update database for guild " + interaction.guild.id + " using command : 'setup_channels'");
								return
						}

						// Generate success embed
						const successEmbed = new EmbedBuilder()
								.setTitle("Success")
								.setColor(this.client.config.embed_colors)
								.addFields([
										{ name: channelConfigName, value: `${channel}` }
								])
								.setFooter({ text: `© Izuna` });
								
						interaction.reply({ embeds: [successEmbed] });
				} else {
						const channelConfigName = configChannel?.split("_")[1] + "LogChannel";
						const statusConfigName = configChannel?.split("_")[1] + "LogStatus";
						if (!await this.client.databaseClient?.logs.findFirst({ where: { guildId: interaction.guildId! } })) {
								await this.client.databaseClient?.logs.create({
										data: {
												guildId: interaction.guildId!,
												messageLogStatus: false,
												adminLogStatus: false,
												memberLogStatus: false
										}
								})
						}

						const created = await this.client.databaseClient?.logs.update({
								where: {
										guildId: interaction.guild.id
								},
								data: {
										[channelConfigName]: channel.id,
										[statusConfigName]: status
								}
								
						})

						if (!created) {
								interaction.reply("An error occured saving the changes");
								logger.error("Unable to update database for guild " + interaction.guild.id + " using command : 'setup_channels'");
								return
						}

						// Generate success embed
						const successEmbed = new EmbedBuilder()
								.setTitle("Success")
								.setColor(this.client.config.embed_colors)
								.addFields([
										{ name: channelConfigName, value: `${channel}` }
								])
								.setFooter({ text: `© Izuna` });
								
						interaction.reply({ embeds: [successEmbed] });
				}
		}
}
