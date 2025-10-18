import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class HoyoEnable extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "hoyo_enable",
            description: "Configuration paramètres Hoyolab",
            category: Categories.Hoyo,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "status",
                    description: "Wether the feature is enabled or not",
                    type: ApplicationCommandOptionType.Boolean,
                    required: true
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
    }
}
