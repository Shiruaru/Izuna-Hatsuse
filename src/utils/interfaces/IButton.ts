import Categories from "../enums/Categories";
import IzunaClient from "../classes/IzunaClient";
import { ButtonInteraction } from "discord.js";

export default interface IButton {
		client: IzunaClient,
		name: string,
		description: string,
		default_member_permissions: bigint,
		custom: boolean,
		owner: boolean,
		dm_permission: boolean
		category: Categories,
		options: [];
		config?: object,

		Execute(interaction: ButtonInteraction): void,
}
