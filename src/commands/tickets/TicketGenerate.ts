import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class TicketGenerate extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "ticket_generate",
            description: "Envoie un embed pour la création d'un ticket dans le salon actuel'",
            category: Categories.Ticket,
            default_member_permissions: PermissionsBitField.Flags.ManageChannels,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [
                {
                    name: "topic",
                    description: "Description des tickets",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "description",
                    description: "Sujet des ticket",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const topic = interaction.options.getString("topic");
        const description = interaction.options.getString("description");

        const ticketEmbed = new EmbedBuilder()
            .setTitle(topic)
            .setDescription(description)
            .setColor("#7F0856")
            .setFooter({ text: `© Izuna` });

    
        // Create actions buttons
        const button = new ButtonBuilder()
            .setCustomId(`open-ticket`)
            .setLabel("Ouvrir un ticket")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);
            

        const channel = interaction.channel as GuildTextBasedChannel
        await channel.send({embeds: [ticketEmbed], components: [row]})

        interaction.reply({ content: "Ticket message sent", flags:"Ephemeral" })
    }
}
