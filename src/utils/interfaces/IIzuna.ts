import { Collection } from "discord.js";
import Command from "../classes/Command";
import Handler from "../classes/Handler";
import IzunaFunctions from "../classes/IzunaFunctions";
import { PrismaClient } from "@prisma/client";

export default interface IIzuna {
		Init(): void;
		function: IzunaFunctions
		commands: Collection<string, Command>;
		handler: Handler;
		databaseClient: PrismaClient | undefined;
}
