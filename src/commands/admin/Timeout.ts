import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class Kick extends Command {
    constructor(Izuna: IzunaClient) {
	super(Izuna, {
	    name: "kick",
	    description: "kick un membre",
	    category: Categories.Admin,
	    dm_permission: false,
	    owner: false,
	    custom: false,
	    options: [
		{
		    name: "member",
		    description: "membre à exclure",
		    type: ApplicationCommandOptionType.User,
		    required: true
		}
	    ],
	    default_member_permissions: PermissionsBitField.Flags.Administrator
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
