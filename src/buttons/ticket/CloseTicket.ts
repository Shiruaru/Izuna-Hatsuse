import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, EmbedBuilder, ModalBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";

export default class OpenTicket extends Button {
    constructor(client: IzunaClient) {
        super(client, {
            name: "close-ticket",
            description: "Ferme un ticket",
            category: Categories.Ticket,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [],
        })
    }

    async Execute(interaction: ButtonInteraction): Promise<void> {
        const message = interaction.message;
        const ticketInfo = await this.client.databaseClient?.ticket.findFirst({
            where: { messageId: message.id },
            select: { authorId: true }
        })


        if (ticketInfo?.authorId !== interaction.user.id) {
            interaction.reply({ content: "Seul l'auteur du ticket peux le fermer", flags: "Ephemeral"})
            return
        }

        // ----- Ask for comment -----
        // TODO: Future update, ask for a comment in a modal (popup).
        // Modal will also serve as confirmation

        // ----- Update database -----
        await this.client.databaseClient?.ticket.update({
            where: { messageId: message.id },
            data: { status: false }
        })

        // ----- Update Discord -----
        interaction.reply("Ticket fermé, ce salon sera supprimé dans 5 secondes");

        setTimeout(() => {
            interaction.channel?.delete();
        }, 5000);
    }
}
