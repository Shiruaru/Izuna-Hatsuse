import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, EmbedBuilder, PermissionsBitField } from "discord.js";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";

export default class ToggleAntiSpam extends Button {
    constructor(client: IzunaClient) {
        super(client, {
            name: "toggle-anti-spam",
            description: "Change le status de l'anti spam'",
            category: Categories.Security,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [],
        })
    }

    async Execute(interaction: ButtonInteraction): Promise<void> {
        const antiSpamStatus = await this.client.databaseClient?.security.findFirst({
            select: {
                antiSpam: true
            },
            where: {
                guildId: interaction.guild?.id
            }
        });

        await this.client.databaseClient?.security.update({
            where: { guildId: interaction.guild?.id },
            data: { antiSpam: !antiSpamStatus?.antiSpam }
        })

        const embed = new EmbedBuilder()
            .setTitle("Sécurité Anti Spam")
            .setDescription("Détecte et supprime les cas de spam, timeout l'utilisateur responsable")
            .addFields([
                { name: "Status", value: antiSpamStatus?.antiSpam ? "🟢 Active" : "🔴 Disabled" }
            ])
            .setColor("#7F0856")
            .setFooter({ text: `© Izuna` });

        interaction.message.edit({ embeds: [embed] });
        interaction.reply("Status updated");
    }
}
