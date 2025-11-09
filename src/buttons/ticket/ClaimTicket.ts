import { ApplicationCommandOptionType, ButtonInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";

export default class OpenTicket extends Button {
    constructor(client: IzunaClient) {
        super(client, {
            name: "claim-ticket",
            description: "Claim un ticket",
            category: Categories.Ticket,
            default_member_permissions: PermissionsBitField.Flags.ModerateMembers,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [
                {
                    name: "response",
                    description: "response of the bot",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ],
        })
    }

    async Execute(interaction: ButtonInteraction): Promise<void> {
        const message = interaction.message;
        const authorId = message.embeds[0].fields.filter((field) => field.name == "Author")[0].value.slice(2, -1)
        if (interaction.user.id == authorId) {
            interaction.reply({ content: "Tu ne peux pas claim ton propre ticket", flags: "Ephemeral" })
            return
        }

        await this.client.databaseClient?.ticket.update({
            where: { messageId: interaction.message.id },
            data: { claimedById: interaction.user.id }
        })

        const newEmbed = new EmbedBuilder()
            .setTitle(message.embeds[0].title)
            .setFields(
            { name: "Status", value: `Open`, inline: true },
            { name: "Author", value: `<@${authorId}>`, inline: true},
            { name: "Claimed By", value: `${interaction.user}`, inline: true },
            )
            .setColor("#7F0856")
            .setFooter({ text: `© Izuna` });

        message.edit({ embeds: [newEmbed] })
        

        interaction.reply({ content: "Claim by", flags: "Ephemeral" })
    }
}
