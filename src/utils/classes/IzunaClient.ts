import IIzuna from "../interfaces/IIzuna";
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import IConfig from "../interfaces/IConfig";
import IzunaFunctions from "./IzunaFunctions";
import Handler from "./Handler";
import Command from "./Command";
import logger from "../logger";

import { PrismaClient } from "@prisma/client";
import Button from "./Button";

export default class IzunaClient extends Client implements IIzuna {
		config: IConfig
		function: IzunaFunctions
		commands: Collection<string, Command>;
		buttons: Collection<string, Button>;
		handler: Handler;
		databaseClient: PrismaClient | undefined;

		constructor() {
				super({ intents: [
						GatewayIntentBits.Guilds, // Guild information
						GatewayIntentBits.GuildMembers,
						GatewayIntentBits.MessageContent,
						GatewayIntentBits.GuildMessages
				] })
				this.handler = new Handler(this)

				this.commands = new Collection();
				this.buttons = new Collection();

				this.config = {
						discord_token: process.env.DISCORD_TOKEN!,
						test_server_id: "926874968925548554",
						client_id: process.env.DISCORD_CLIENT_ID!,
						embed_colors: "#7F0856"
				}
				this.function = new IzunaFunctions()
		}

		async Init() {
				this.login(this.config.discord_token)
				this.handler.LoadEvents();
				this.handler.LoadCommands();
				this.handler.LoadButtons();

				await this.databaseConfig()
				.then(() => logger.status("Connected to database"))
				.catch((err) => logger.error(err))

		}

		async databaseConfig() {
				const prisma = new PrismaClient()

				await prisma.$queryRaw`SELECT 1 as test`; // Test if database is up

				this.databaseClient = prisma;
		}
}
