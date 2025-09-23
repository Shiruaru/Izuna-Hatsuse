import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class FindUser extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "find_user",
            description: "Retourne l'utilisateur dans le serveur avec cet ID",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.SendMessages,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [
                {
                    name: "id",
                    description: "id de l'utilisateur",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        const id = interaction.options.getString("id");

        const user = interaction.guild?.members.cache.get(id || "");

        interaction.reply({content: `The user id : ${user}`})
    }
}
