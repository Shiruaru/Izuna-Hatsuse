import { ApplicationCommandOptionType, ChatInputCommandInteraction, Collection, PermissionsBitField, REST, Routes } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";
import { Events } from "discord.js";


export default class Emit extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "emit",
            description: "Simule un événement",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: true,
            owner: true,
            custom: false,
            options: [
								{
										name: "event",
										description: "l'événemnt à simuler",
										type: ApplicationCommandOptionType.String,
										choices: [
												{ name: "join", value: "join" },
												{ name: "leave", value: "leave" },
												{ name: "kick", value: "kick" }
										],
										required: true
								}
						]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
				const eventName = interaction.options.getString("event");

				switch (eventName) {
						case "join" : {
								this.client.emit(Events.GuildMemberAdd);
						}

						default: 
								interaction.reply("Unknown event")
								break;
				}
		}
}
