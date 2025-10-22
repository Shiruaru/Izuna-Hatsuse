import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class GameConfig extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "game-config",
            description: "configuration de la fonctionnalité de messages",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.MentionEveryone,
            dm_permission: false,
            owner: false,
            custom: true,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
    }
}
