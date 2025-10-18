import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class HoyoConfig extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "hoyo_config",
            description: "Configuration paramètres Hoyolab",
            category: Categories.Hoyo,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "ltuid_v2",
                    description: "cookie ltuid_v2",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "ltoken_v2",
                    description: "cookie ltoken_v2",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "genshin_uid",
                    description: "UID Genshin Impact",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "hsr_uid",
                    description: "UID Honkai Star Rail",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "zzz_uid",
                    description: "UID Honkai Star Rail",
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
