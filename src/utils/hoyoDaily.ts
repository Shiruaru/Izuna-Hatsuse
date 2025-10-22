import { Cookie, GenshinImpact, HonkaiStarRail, IDailyClaim, LanguageEnum, ZenlessZoneZero } from "node-hoyolab" 
import schedule = require('node-schedule');
import IzunaClient from "./classes/IzunaClient";
import logger from "./logger";
import { EmbedBuilder, TextChannel } from "discord.js";

export type User = {
    discordId: string;
    status: boolean;
    ltoken: string;
    ltuid: string;
    genshinUID: string;
    hsrUID: string;
    zzzUID: string;
}

enum Game {
		Genshin = "Genshin Impact",
		HSR = "Honkai Star Rail",
		ZZZ = "Zenless Zone Zero"
}

export default function(Izuna: IzunaClient) {
		console.log("Starting Schedule");
		schedule.scheduleJob('0 0 8 * * *', async () => {
				// Retrieve all users registered and with active function
				const users = await Izuna.databaseClient?.hoyolab.findMany({
						where: { status: true }
				})

				if (users == undefined) {
						logger.error("Hoyolab query returned UNDEFINED");
						return
				}

				for (let user of users) {
						await claimDaily(Izuna, user);
				}
		})
}

export async function claimDaily(Izuna: IzunaClient, user: User) {
		if (user.genshinUID !== "") {
				console.log("claiming genshin")
				const genshin = new GenshinImpact({
						cookie: {
								ltokenV2: user.ltoken,
								ltuidV2: parseInt(user.ltuid)
						},
						lang: LanguageEnum.FRENCH
				})

				const claim = await genshin.daily.claim()
				console.log("claimed")
				await sendEmbed(Izuna, Game.Genshin, claim)
		}

		if (user.hsrUID !== "") {
				const hsr = new HonkaiStarRail({
						cookie: {
								ltokenV2: user.ltoken,
								ltuidV2: parseInt(user.ltuid)
						}
				})

				const claim = await hsr.daily.claim()
				await sendEmbed(Izuna, Game.HSR, claim);
		}

		if (user.zzzUID !== "") {
				const zzz= new ZenlessZoneZero({
						cookie: {
								ltokenV2: user.ltoken,
								ltuidV2: parseInt(user.ltuid)
						}
				})

				const claim = await zzz.daily.claim();
				await sendEmbed(Izuna, Game.ZZZ, claim);
		}
}

async function sendEmbed(Izuna: IzunaClient, game: Game, claim: IDailyClaim) {
		const embed = new EmbedBuilder()
				.setTitle(game.toString() + " Daily Reward")
				.setThumbnail(claim.reward?.award.icon!)
				.addFields(
						{
								name: "Reward",
								value: claim.reward?.award.name!
						}
				)
				.setFooter({ text: `© Izuna` })
				.setColor("#7F0856")

		const channel = Izuna.channels.cache.get('926874969399500804')
		console.log(channel);

		if (channel?.isTextBased) {
				await (channel as TextChannel)?.send({ embeds: [embed] })
		}
}
