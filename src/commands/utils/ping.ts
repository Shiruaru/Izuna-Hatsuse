import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class Ping extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "ping",
            description: "Répond Pong",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "response",
                    description: "response of the bot",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        interaction.reply('Pong! updated')
    }
}
