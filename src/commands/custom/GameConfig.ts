import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class GameConfig extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "game-config",
            description: "configuration de la fonctionnalité de messages",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            owner: false,
            custom: true,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        const embed = new EmbedBuilder() 
            .setTitle("Votre Jeu Favoris")
            .setColor(this.client.config.embed_colors)
            .setFooter({ text: `© Izuna` });

        const button = new ButtonBuilder()
            .setCustomId("game-select")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Choisir un Jeu")

        const buttonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)


        const chann = interaction.channel;
        (chann as TextChannel).send({ embeds: [embed], components: [buttonRow] });
        
        interaction.reply({ content: "Message généré", flags: ["Ephemeral"] })
    }
}
