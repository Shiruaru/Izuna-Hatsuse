import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../utils/classes/Command";
import IzunaClient from "../../utils/classes/IzunaClient";
import Categories from "../../utils/enums/Categories";

export default class Ping extends Command {
    constructor(client: IzunaClient) {
        super(client, {
            name: "policy",
            description: "Règles et terms d'utilisations de la fonctionnalité de jeux",
            category: Categories.Game,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            owner: false,
            custom: false,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        const embed = new EmbedBuilder()
        .setTitle("Politique d'utilisation des données Steam")
        .setDescription(
            "Avant d'utiliser les fonctionnalités liées à Steam, veuillez lire et accepter cette politique."
        )
        .addFields(
            {
                name: "୭ ˚ Collecte des données",
                value:
                "- Seules les données **publiques** du profil Steam sont utilisées : temps de jeu, succès débloqués, jeux joués.\n" +
                    "- Aucune information personnelle (email, liste d'amis, achats, etc.) n’est collectée."
            },
            {
                name: "୭ ˚ Données stockées",
                value:
                "- Les **temps de jeu** et **succès** sont enregistrés uniquement dans le but de détecter l'obtention de récompenses en jeu (badges, titres, objets).\n" +
                    "- Ces données ne sont **pas rendues publiques**, uniquement utilisées de manière interne par l’application."
            },
            {
                name: "୭ ˚ Hébergement des données",
                value:
                "- Les données sont hébergées sur un serveur situé en **France**, administré en interne dans le cadre du projet Izuna."
            },
            {
                name: "୭ ˚ Authentification",
                value:
                "- L'identification via **Steam OpenID** peut être utilisée pour garantir un lien sécurisé avec le compte Steam et obtenir le consentement explicite."
            },
            {
                name: "୭ ˚ Refus ou retrait du consentement",
                value:
                "- En cliquant sur **Refuser**, l'accès aux fonctionnalités liées à Steam sera désactivé.\n" +
                    "- Il est possible d’utiliser à nouveau la commande `/policy` pour changer cette décision à tout moment."
            },
            {
                name: "୭ ˚ Accès à l’API Steam",
                value:
                "- L'accès à l'API Steam est réservé exclusivement à un usage interne au sein du projet Izuna, conformément aux [conditions d'utilisation de l'API Steam](https://steamcommunity.com/dev/apiterms)."
            }
        )
        .setFooter({ text: "Dernière mise à jour : Juin 2025" })
        .setColor(0x5865F2);

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("policy_accept")
                .setLabel("Accepter")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("policy_decline")
                .setLabel("Refuser")
                .setStyle(ButtonStyle.Danger)
        );

        interaction.reply({
            embeds: [embed],
            components: [buttons],
            flags: "Ephemeral"
        });
    }
}
