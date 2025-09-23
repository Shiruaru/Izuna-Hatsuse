import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class TicketSetup extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "ticket_setup",
            description: "Permet de configurer la fonction de ticket",
            category: Categories.Ticket,
            default_member_permissions: PermissionsBitField.Flags.ManageChannels,
            dm_permission: false,
            owner: false,
            custom: false,
            options: [
                {
                    name: "action",
                    description: "Action de configuration",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "init", value: "init" },
                        { name: "config", value: "config" }
                    ]
                }
            ]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const action = interaction.options.getString("action");

        switch (action) {
            case "init": {
                // First check for the moderator role
                const staffRoles = await this.client.databaseClient?.guild.findFirst({
                    where: { id: interaction.guild?.id },
                    select: { moderatorRole: true, adminRole: true }
                })


                if (!staffRoles || !staffRoles?.moderatorRole) {
                    interaction.reply("Role modérateur manquant, veuillez l'ajouter en utilisant la commande `/setup`")
                    return
                }

                // Then generate the guild channel
                const category = await interaction.guild?.channels.create({
                    name: "Tickets(Test)",
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: staffRoles.moderatorRole,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        ...(staffRoles.adminRole ? [{
                            id: staffRoles.adminRole,
                            allow: [PermissionFlagsBits.ViewChannel]
                        }] : [])
                    ]
                })

                // Save to database
                await this.client.databaseClient?.guild.update({
                    where: { id: interaction.guild?.id },
                    data: { ticketCategory: category?.id }
                })


                const responseEmbed = new EmbedBuilder()
                    .setTitle("Initialisation réussie")
                    .setDescription(`La catégorie \`\`${category?.name}\`\` a été créée et les permissions ont étés correctement accordées`)
                    .setColor("#7F0856")
                    .setFooter({ text: `© Izuna` });

                interaction.reply({ embeds: [responseEmbed] })

                break;
            }

            default: {
                const errorEmbed= new EmbedBuilder()
                    .setTitle("Une erreur est survenue")
                    .addFields([{ name: "Error", value: "Unknown action : ``" + action + "``"}])
                    .setColor("#FF0000")
                    .setFooter({ text: `© Izuna` });

                interaction.reply({ embeds: [errorEmbed] })
            }
        }


    }
}
