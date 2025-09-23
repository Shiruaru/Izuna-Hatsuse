import { CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import { ApplicationCommandOptionType } from "discord.js"
import logger from "../../utils/logger";

export default class Warn extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "warn",
						description: "Warn un membre",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Mod,
						default_member_permissions: PermissionsBitField.Flags.MuteMembers,
						options: [
								{
										name: "membre",
										description: "Membre à warn",
										required: true,
										type: ApplicationCommandOptionType.User
								},
								{
										name: "raison",
										description: "Raison du warn",
										required: true,
										type: ApplicationCommandOptionType.String
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const user = interaction.options.getUser("membre");
				const raison = interaction.options.getString("raison");

				if (user?.bot) return interaction.reply({content: "Cannot warn bot"})

				this.client.databaseClient?.warn.create({
						data : {
								guildId: interaction.guild?.id || "ERROR",
								reason: raison || "ERROR",
								memberId: user?.id || "ERROR",
								authorId: interaction.user.id
						}
				}).then(_ => {
						interaction.guild?.members.fetch(user?.id || "")
						interaction.reply({ content: `${user} has been warned` })
				}).catch(e => {
								logger.error("An error occured warning the person")
								console.log(e)

								interaction.reply({content: "Error occured warning the person, please contact bot owner"})
				})

		}
}
