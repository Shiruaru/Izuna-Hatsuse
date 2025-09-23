import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Categories from "../enums/Categories";
import ICommand from "../interfaces/ICommand";
import ICommandData from "../interfaces/ICommandData";
import ICommandOptions from "../interfaces/ICommandOptions";
import IzunaClient from "./IzunaClient";

export default class Command implements ICommand{
		client: IzunaClient
		name: string;
		description: string;
		default_member_permissions: bigint;
		custom: boolean;
		owner: boolean;
		dm_permission: boolean;
		category: Categories;
		options: ICommandOptions[];
		config?: object;

		constructor(client: IzunaClient, commandData: ICommandData, config?: object) {
				this.client = client,
				this.name = commandData.name,
				this.description = commandData.description,
				this.default_member_permissions = commandData.default_member_permissions,
				this.custom = commandData.owner
				this.owner = commandData.owner
				this.dm_permission = commandData.dm_permission
				this.category = commandData.category
				this.options = commandData.options
				this.config = config
		}

		Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
				interaction.reply('Not implemented for now')
				return
		}
		Autocomplete(_interaction: ChatInputCommandInteraction<CacheType>): void {
				throw new Error("Method not implemented.");
		}

}
