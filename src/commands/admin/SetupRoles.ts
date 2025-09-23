import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class Setup extends Command {
		constructor(Izuna: IzunaClient) {
				super(Izuna, {
						name: "setup_roles",
						description: "Configuration des roles du serveur",
						category: Categories.Admin,
						dm_permission: false,
						owner: false,
						custom: false,
						options: [
								{
										name: "role_type",
										description: "Rôle à configurer",
										type: ApplicationCommandOptionType.String,
										required: true,
										choices: [
												{ name: "moderator", value: "moderator" },
												{ name: "admin", value: "admin" },
												{ name: "member", value: "member" }
										]
								},
								{
										name: "role",
										description: "le rôle à assigner",
										type: ApplicationCommandOptionType.Role,
										required: true
								}
						],
						default_member_permissions: PermissionsBitField.Flags.Administrator
				})
		}

		async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
				const configRole = interaction.options.getString("role_type");
				const role = interaction.options.getRole("role");


				const response = await this.client.databaseClient?.guild.update({
						where: { id: interaction.guild?.id },
						data: {
								[`${configRole}Role`]: role?.id
						}
				})

				console.log(response);


				const responseEmbed = new EmbedBuilder()
						.setTitle("Configuration")
						.setDescription(`Le rôle \`\`${configRole}\`\` est désormais ${role}` )
						.setColor("#7F0856")
						.setFooter({ text: `© Izuna` });

				interaction.reply({ embeds: [responseEmbed] })
		}
}
