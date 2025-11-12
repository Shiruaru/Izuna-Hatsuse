import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import logger from "../../utils/logger";

export default class Annonce extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "annonce",
            description: "créer un embed d'annonce",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.MentionEveryone,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "title",
                    description: "titre de l'annonce'",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "content",
                    description: "description de l'annonce",
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        const title = interaction.options.getString("title")!;
        const description = interaction.options.getString("content")!;
        

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(this.client.config.embed_colors)
            .setFooter({ text: "© Izuna" })

        if (!interaction.channel?.isSendable()) {
            logger.error("Unable to send the integration because the channel is not sendable")
            interaction.reply("Unable to send the message because the channel is not sendable");
            return
        }

        (interaction.channel as TextChannel).send({ embeds: [embed] });
        interaction.reply("Message sent");
        return
    }
}
