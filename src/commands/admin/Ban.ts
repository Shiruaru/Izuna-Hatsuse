import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class Ban extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "ban",
						description: "Ban un membre",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Admin,
						default_member_permissions: PermissionsBitField.Flags.BanMembers,
						options: [
								{
										name: "membre",
										description: "Membre à bannir",
										required: true,
										type: ApplicationCommandOptionType.User
								},
								{
										name: "raison",
										description: 'Raison du banissement',
										required: false,
										type: ApplicationCommandOptionType.String
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const user = interaction.options.getUser('membre');
				const reason = interaction.options.getString('raison');

				if(!user) {
						logger.error('Ban.js : utilisateur non reçus')
						return
				}

				const member = interaction.guild?.members.cache.get(user.id)

				// send a message to the user
				try {
						await user.send(`Vous avez été bannis de ${interaction.guild?.name}` + (reason? ` pour ${reason}` : ""))
				} catch (error) {
						logger.warn(`Unable to dm the following user after a ban : \`\`${user.globalName} ${user.bot ? "- BOT" : ""}\`\``)
				}

				member?.ban({reason: `Par ${interaction.user.globalName} avec comme raison : ${reason}`, deleteMessageSeconds: 60*60*24*7})

				interaction.reply(`Banned ${user} for reason : ${reason || "No reason specified"}`)
		}
}
