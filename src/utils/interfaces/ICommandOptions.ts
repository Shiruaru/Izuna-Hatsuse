import { ApplicationCommandOptionChoiceData, ApplicationCommandOptionType } from "discord.js";

export default interface ICommandOptions {
		name: string,
		description: string,
		type: ApplicationCommandOptionType,
		required: boolean,
		choices?: ApplicationCommandOptionChoiceData[]
}
