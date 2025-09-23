import { ChatInputCommandInteraction, CacheType, ButtonInteraction } from "discord.js";
import Categories from "../enums/Categories";
import ICommandData from "../interfaces/ICommandData";
import IzunaClient from "./IzunaClient";
import IButton from "../interfaces/IButton";

export default class Button implements IButton{
		client: IzunaClient
		name: string;
		description: string;
		default_member_permissions: bigint;
		custom: boolean;
		owner: boolean;
		dm_permission: boolean;
		category: Categories;
		options: [];
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
				this.config = config
				this.options = [];
		}

		Execute(interaction: ButtonInteraction): void {
				interaction.reply('Not implemented for now')
				return
		}
}
