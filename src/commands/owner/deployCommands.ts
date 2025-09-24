import { ChatInputCommandInteraction, Collection, PermissionsBitField, REST, Routes } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";
import logger from "../../utils/logger";

export default class Ping extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "deploy-commands",
            description: "Déploie les commandes du bot",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: true,
            owner: true,
            custom: false,
            options: []
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
				const commands = this.GetJson(this.client.commands);
				const buttons = this.GetJson(this.client.buttons)

				const interactions = [...commands, ...buttons];
				const rest = new REST().setToken(this.client.config.discord_token)

				await rest.put(Routes.applicationGuildCommands(this.client.config.client_id, this.client.config.test_server_id), {
						body: interactions
				})

				// Tuf Chill server
				await rest.put(Routes.applicationGuildCommands(this.client.config.client_id, "811261520524607529"), {
						body: interactions
				})

				logger.status(`Successfuly deployed ${commands.length} commands`)

				// Then add command to database
				// first identify the new commands

				let newCommands = [];
				let databaseCommands = await this.client.databaseClient?.commands.findMany()
				for (const [commandName, command] of this.client.commands) {
						if (databaseCommands?.find(dbCommand => dbCommand.name == commandName)) continue;
						
						newCommands.push(command)
				}


				// then add each new command to commands table
				let generated = [];
				for (const newCommand of newCommands) {
						let command = await this.client.databaseClient?.commands.create({
								data: {
										name: newCommand.name,
										description: newCommand.description,
										permissions: newCommand.default_member_permissions.toString(),
										status: true,
										custom: newCommand.custom,
								}
						})

						if (command == undefined) {
								interaction.reply("There was an error in the process, could not save command to database");
								return
						}
						generated.push(command)
				}

				// And generate the config for each command in 
				const guildIds = await this.client.databaseClient?.guild.findMany({
						select: { id: true }
				})

				if (!guildIds) {
						interaction.reply("Error querrying guilds, failed to generate command configs which can lead to unusable command");
						return
				}

				for (const command of generated) {
						await this.client.databaseClient?.commandConfig.createMany({
								data: guildIds.map(guild => ({
										guildId: guild.id,
										commandId: command.id,
										status: false
								}))
						})
				}

				interaction.reply('Successfully deployed commands')
    }

		GetJson(commands: Collection<string, Command | Button>): object[] {
				const data: object[] = []
				commands.forEach(command => {
						data.push({
								name: command.name,
								description: command.description,
								options: command.options,
								default_member_permissions: command.default_member_permissions.toString(),
								dm_permission: command.dm_permission
						})
				})

				return data
		}
}


