import Categories from "../enums/Categories";
import IzunaClient from "../classes/IzunaClient";
import ICommandOptions from "./ICommandOptions";
import { ChatInputCommandInteraction } from "discord.js";

export default interface ICommand {
		client: IzunaClient,
		name: string,
		description: string,
		default_member_permissions: bigint,
		custom: boolean,
		owner: boolean,
		dm_permission: boolean
		category: Categories,
		options: ICommandOptions[]
		config?: object,

		Execute(interaction: ChatInputCommandInteraction): void,
		Autocomplete(interaction: ChatInputCommandInteraction): void,
}
