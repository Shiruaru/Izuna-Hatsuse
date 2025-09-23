import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, EmbedBuilder, PermissionsBitField } from "discord.js";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";

export default class ToggleAntiRaid extends Button {
    constructor(client: IzunaClient) {
        super(client, {
            name: "toggle-anti-raid",
            description: "Change le status de l'anti raid'",
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
                antiDiscordInvite: true
            },
            where: {
                guildId: interaction.guild?.id
            }
        });

        await this.client.databaseClient?.security.update({
            where: { guildId: interaction.guild?.id },
            data: { antiDiscordInvite: !antiSpamStatus?.antiDiscordInvite }
        })

        const embed = new EmbedBuilder()
            .setTitle("Sécurité Anti Raid")
            .setDescription("Supprime automatiquement tous les messages contenant une invitation discord")
            .addFields([
                { name: "Status", value: antiSpamStatus?.antiDiscordInvite ? "🔴 Disabled": "🟢 Active"  }
            ])
            .setColor("#7F0856")
            .setFooter({ text: `© Izuna` });

        interaction.reply.edit({ embeds: [newEmbed] })
        

        interaction.reply({ content: "Claim by", flags: "Ephemeral" })
    }
}
