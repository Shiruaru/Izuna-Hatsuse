import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class HoyoEnable extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "hoyo_enable",
            description: "Configuration paramètres Hoyolab",
            category: Categories.Hoyo,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "status",
                    description: "Wether the feature is enabled or not",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const status = interaction.options.getBoolean("status");

        const config = await this.client.databaseClient?.hoyolab.findFirst({
            where: { discordId: interaction.user.id }
        });


        if (!status) {
            if (!config) {
                interaction.reply("Vous n'êtes pas enregistrés")
                return
            }

            interaction.reply('Status : ' + config.status);
            return
        }

        if (!config?.status) {
            console.log('registering')
            await this.client.databaseClient?.hoyolab.create({
                data: { 
                    discordId: interaction.user.id,
                    status: status!,
                    ltoken: "",
                    ltuid: "",
                    genshinUID: "",
                    hsrUID: "",
                    zzzUID: ""
                }
            }).catch(e => {
                logger.error("Error occured registering user : ");
                console.log(e)
            })
        } else {
            await this.client.databaseClient?.hoyolab.update({
                where: { discordId: interaction.user.id },
                data: { status: status! }
            }).catch(e => {
                logger.error("Error occured updating user : ");
                console.log(e)
            })

        }


        const embed = new EmbedBuilder()
        .setTitle("Hoyolab Status")
        .setDescription(
            `The Hoyolab feature has been \`${status ? "enabled" : "disabled"}\` for your account.`
        )
        .addFields(
            { name: "User", value: `${interaction.user.tag}`, inline: true },
            { name: "Current Status", value: status ? "Enabled" : "Disabled", inline: true }
        )
        .setFooter({ text: "© Izuna" })
        .setColor("#7F0856");

        interaction.reply({ embeds: [embed] })
    }
}
