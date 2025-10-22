import { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class GameRemove extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "game-remove",
            description: "Retirer un rôle associé à un jeu",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
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

    }
}
