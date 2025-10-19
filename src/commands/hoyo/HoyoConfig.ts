import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class HoyoConfig extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "hoyo_config",
            description: "Configuration paramètres Hoyolab",
            category: Categories.Hoyo,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "ltuid_v2",
                    description: "cookie ltuid_v2",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                },
                {
                    name: "ltoken_v2",
                    description: "cookie ltoken_v2",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "genshin_uid",
                    description: "UID Genshin Impact",
                    required: false,
                    type: ApplicationCommandOptionType.Number,
                },
                {
                    name: "hsr_uid",
                    description: "UID Honkai Star Rail",
                    required: false,
                    type: ApplicationCommandOptionType.Number,
                },
                {
                    name: "zzz_uid",
                    description: "UID Honkai Star Rail",
                    required: false,
                    type: ApplicationCommandOptionType.Number,
                }
            ]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const ltuid = interaction.options.getNumber('ltuid_v2');
        const ltoken = interaction.options.getString('ltoken_v2') || "ERROR";
        const hsrUid = interaction.options.getNumber('hsr_uid');
        const genshinUid = interaction.options.getNumber('genshin_uid');
        const zzzUid = interaction.options.getNumber('zzz_uid');

        const userData = this.client.databaseClient?.hoyolab.findFirst({
            where: { discordId: interaction.user.id }
        })

        if (!userData) {
            await this.client.databaseClient?.hoyolab.create({
                data: {
                    discordId: interaction.user.id,
                    status: true,
                    ltoken: ltoken,
                    ltuid: ltuid!.toString(),
                    hsrUID: hsrUid ? hsrUid.toString() : "",
                    genshinUID: genshinUid ? genshinUid.toString() : "",
                    zzzUID: zzzUid ? zzzUid.toString() : ""
                }
            }).catch(e => {
                logger.error("Error occured registering user : ");
                console.log(e)
            })

        } else {
            await this.client.databaseClient?.hoyolab.update({
                where: {discordId: interaction.user.id},
                data: {
                    status: true,
                    ltoken: ltoken,
                    ltuid: ltuid!.toString(),
                    hsrUID: hsrUid ? hsrUid.toString() : "",
                    genshinUID: genshinUid ? genshinUid.toString() : "",
                    zzzUID: zzzUid ? zzzUid.toString() : ""
                }
            }).catch(e => {
                logger.error("Error occured registering user : ");
                console.log(e)
            })

        }


        const embed = new EmbedBuilder()
        .setTitle("Hoyolab Configuration")
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
            {
                name: "Genshin UID",
                value: genshinUid ? `\`${genshinUid}\`` : "NULL",
                inline: true
            },
            {
                name: "HSR UID",
                value: hsrUid ? `\`${hsrUid}\`` : "NULL",
                inline: true
            },
            {
                name: "ZZZ UID",
                value: zzzUid ? `\`${zzzUid}\`` : "NULL",
                inline: true
            }
        )
        .setFooter({ text: "© Izuna" })
        .setColor("#7F0856");


        interaction.reply({ embeds: [embed], flags: ["Ephemeral"] })
    }
}
