import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CategoryChannel, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import Button from "../../utils/classes/Button";
import logger from "../../utils/logger";

export default class OpenTicket extends Button {
    constructor(client: IzunaClient) {
        super(client, {
            name: "open-ticket",
            description: "Créer un ticket",
            category: Categories.Ticket,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [],
        })
    }

    async Execute(interaction: ButtonInteraction): Promise<void> {
        const topic = interaction.message.embeds[0].title;

        const ticketInfo = await this.client.databaseClient?.guild.findFirst({
            where: { id: interaction.guild?.id },
            select: { ticketCategory: true }
        });

        if (!ticketInfo || !ticketInfo.ticketCategory) {
            interaction.reply("La fonction de tickets n'est pas disponnible sur ce serveur, veuillez contacter un adminsitrateur");
            return
        }

        const category = await interaction.guild?.channels.fetch(ticketInfo.ticketCategory) as CategoryChannel;

        if (!category) {
            interaction.reply("Erreur, impossible de trouver la catégorie associée aux tickets, veuillez contacter un administrateur");
            return;
        }

        const channel = await interaction.guild?.channels.create({
            name: `${interaction.user.displayName} - ${topic}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                },
                ...category.permissionOverwrites.cache.map((p) => {
                    return {
                        id: p.id,
                        deny: p.deny.toArray(),
                        allow: p.allow.toArray()
                    }
                })
            ],
            parent: category.id
        })


        if (!channel) {
            logger.error("Unable to create ticket channel for " + interaction.guild?.name)
            interaction.reply("Error creating the channel, please contact bot owner")
            return 
        }

        const ticketEmbed = new EmbedBuilder()
            .setTitle(topic)
            .setFields(
                { name: "Status", value: `Open`, inline: true },
                { name: "Author", value: `${interaction.user}`, inline: true},
                { name: "Claimed by", value: ``, inline: true}
            )
            .setColor("#7F0856")
            .setFooter({ text: `© Izuna` });

        const claimButton = new ButtonBuilder()
            .setCustomId("claim-ticket")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Primary)


        const closeButton = new ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)


        const row = new ActionRowBuilder<ButtonBuilder>()
            .setComponents([claimButton, closeButton])

        const message = await channel.send({ embeds: [ticketEmbed], components: [row] })

        // Add ticket to database 
        await this.client.databaseClient?.ticket.create({
            data: {
                authorId: interaction.user.id,
                guildId: interaction.guild?.id || "ERROR",
                title: channel.name,
                status: true, // true means enabled
                messageId: message.id
            }
        })



        interaction.reply({ content: `Ticket opened in ${channel}`, flags: "Ephemeral"});
    }
}
