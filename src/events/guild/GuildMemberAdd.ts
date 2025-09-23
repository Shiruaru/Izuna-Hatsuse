import { Embed, EmbedBuilder, Events, GuildMember, Message } from "discord.js";
import Event from "../../utils/classes/Event";
import IzunaClient from "../../utils/classes/IzunaClient";
import internal = require("stream");
import logger from "../../utils/logger";


export default class GuildMemberAdd extends Event {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: Events.GuildMemberAdd,
						description: "Whenever a new member joins the guild",
						once: false
				})
		}


		async Execute(member: GuildMember) {
				const guildDetails = await this.client.databaseClient?.guild.findFirst({
						select: {
								wlcChannel: true
						},
						where: {
								id: member.guild.id
						}
				})

				if (!guildDetails || !guildDetails?.wlcChannel) { return }
				const channel = await member.guild.channels.fetch(guildDetails.wlcChannel);
				if (!channel || !channel.isSendable()) return;

        const embed = new EmbedBuilder()
            .setAuthor( {name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL()} )
            .setColor('#21ff81')
            .setDescription(`֍ Nom d'utilisateur : ${member}
            ֍ Créé le : <t:${member.user.createdTimestamp / 1000}:f> (<t:${member.user.createdTimestamp / 1000}:R>)
            ֍ Rejoint le : <t:${member.joinedTimestamp || 0 / 1000}:f> (<t:${member.joinedTimestamp || 0 / 1000}:R>)`)
            .setTimestamp()
            .setFooter( { text: `L'utilisateur à rejoint` } )

				channel.send({ embeds: [embed] });
    }
}
