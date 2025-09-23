import { CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class InitDB extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "init_db",
						description: "Initialise la base de donnée pour le serveur",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Admin,
						default_member_permissions: PermissionsBitField.Flags.Administrator,
						options: []
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				if (!interaction.guild) return interaction.reply("Command non disponnible en message privé")

				// check if the guild already exists
				const chekcup = await this.client.databaseClient?.guild.findFirst({
						where: {id: interaction.guild?.id}
				})

				if (chekcup) return interaction.reply({content: "This guild already have a database initialised"})

				await this.client.databaseClient?.guild.create({
						data: {
								id: interaction.guild?.id || "ERROR",
								name: interaction.guild?.name || "ERROR",
						}
				}).catch(e => {
						logger.error("Error occured initialising guild");
						console.log(e);

						interaction.reply({content:"An Error occured please contact bot owner"})
				})

				const commands = await this.client.databaseClient?.commands.findMany();

				if (!commands) return interaction.reply("Commands not set in database, please contact bot owner for further informations");

				for (let command of commands) {
						// Insert it in command config

						await this.client.databaseClient?.commandConfig.create({
								data: {
										guildId: interaction.guild.id,
										commandId: command.id,
										status: true
								}
						})
				}

				// then create the Security config

				await this.client.databaseClient?.security.create({
						data: {
								guildId: interaction.guildId || "",
								status: false,
								adminRoles: "",
								moderatorRoles: "",
								antiDiscordInvite: false
						}
				}).catch(e => {
						logger.error("Error occured initialising Security");
						console.log(e);

						interaction.reply({content:"An Error occured please contact bot owner"})
				})

				// then create the Logs config

				await this.client.databaseClient?.logs.create({
						data: {
								guildId: interaction.guildId || "",
								messageLogStatus: false,
								messageLogChannel: "",
								adminLogStatus: false,
								adminLogChannel: "",
								memberLogStatus: false,
								memberLogChannel: ""
						}
				}).catch(e => {
						logger.error("Error occured initialising Logs");
						console.log(e);

						interaction.reply({content:"An Error occured please contact bot owner"})
				})

				interaction.reply("Database initialised successfully")
		}
}
