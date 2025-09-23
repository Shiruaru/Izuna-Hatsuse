import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, GuildMember, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command"
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class Kick extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "kick",
						description: "Exclus un membre",
						dm_permission: false,
						owner: false,
						custom: false,
						category: Categories.Admin,
						default_member_permissions: PermissionsBitField.Flags.KickMembers,
						options: [
								{
										name: "membre",
										description: "Membre à exclure",
										required: true,
										type: ApplicationCommandOptionType.User
								},
								{
										name: "raison",
										description: 'Raison',
										required: false,
										type: ApplicationCommandOptionType.String
								}
						]
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const user = interaction.options.getUser('membre');
				//@ts-ignore
				const member: GuildMember = interaction.options.getMember('membre');
				const reason = interaction.options.getString('raison');

				if(!user) {
						logger.error('Kick.js : utilisateur non reçus');
						return
				}

				// send a message to the user
				try {
						await user.send(`Vous avez été exclus de ${interaction.guild?.name}` + (reason? ` pour ${reason}` : ""))
				} catch (error) {
						logger.warn(`Unable to dm the following user after a ban : \`\`${user.globalName} ${user.bot ? "- BOT" : ""}\`\``)
				}

				member.kick(`Par ${interaction.user.globalName} avec comme raison : ${reason || "Aucune"}`)

				interaction.reply(`Banned ${user} for reason : ${reason || "No reason specified"}`)
		}
}
