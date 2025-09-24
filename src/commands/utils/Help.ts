import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class Help extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "help",
            description: "Liste les commandes",
            category: Categories.Utils,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: [
                {
                    name: "commande",
                    description: "Commande pour obtenir une description plus précise",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const searchCommand = interaction.options.getString('commande');

        // Si une commande spécifique est demandée
        if (searchCommand) {
            const command = this.client.commands.get(searchCommand);
            if (!command) {
                interaction.reply({ content: `La commande \`${searchCommand}\` n'existe pas.`, flags: "Ephemeral" });
                return
            }

            const embed = new EmbedBuilder()
                .setTitle(`Commande: ${command.name}`)
                .setDescription(command.description || "Aucune description disponible")
                .addFields(
                    { name: "Catégorie", value: command.category, inline: true },
                    { name: "Permission requise", value: command.default_member_permissions ? `\`${new PermissionsBitField(command.default_member_permissions).toArray().join(", ")}\`` : "Aucune", inline: true }
                )
                .setColor("#7F0856")
								.setFooter({ text: `© Izuna | [GitHub](https://github.com/Shiruaru/Izuna-Hatsuse)` });

            if (command.options && command.options.length > 0) {
                embed.addFields({ 
                    name: "Options", 
                    value: command.options.map(opt => `\`${opt.name}\` - ${opt.description} ${opt.required ? "(Requis)" : ""}`).join("\n") 
                });
            }

            interaction.reply({ embeds: [embed] });
            return
        }

        // Afficher toutes les commandes par catégorie
        let categories: { [name: string]: string[] } = {};

        for (let [_, command] of this.client.commands) {
            if (command.button) continue; // Ignore buttons from the help command
            if (!Object.keys(categories).includes(command.category)) {
                categories[command.category] = [];
            }

            categories[command.category].push(command.name);
        }

        const embed = new EmbedBuilder()
            .setTitle("Liste des commandes")
            .setDescription("Voici la liste des commandes disponibles. Utilisez `/help commande` pour plus de détails sur une commande spécifique.")
            .setColor("#7F0856")
            .setFooter({ text: `${this.client.commands.size} commandes disponibles` });

        // Ajouter chaque catégorie comme un champ dans l'embed
        for (const [category, commands] of Object.entries(categories)) {
            embed.addFields({
                name: `${category}`,
                value: commands.map(cmd => `\`${cmd}\``).join(", "),
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
}
