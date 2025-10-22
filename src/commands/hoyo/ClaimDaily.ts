import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import { claimDaily, type User } from "../../utils/hoyoDaily";

export default class ClaimDaily extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "claim_daily",
            description: "Récupère toutes les daily",
            category: Categories.Hoyo,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: []
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const userData = await this.client.databaseClient?.hoyolab.findFirst({
            where: { discordId: interaction.user.id }
        })

        if (userData?.status == false || userData == undefined) {
            interaction.reply({content: "Fonction désactivée", flags: ["Ephemeral"]})
            return
        }


        // Claim the config 
        claimDaily(this.client, userData)

        interaction.reply({ content: "Claiming Daily", flags: ["Ephemeral"] })
    }
}
