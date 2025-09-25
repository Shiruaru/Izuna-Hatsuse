module.exports = {
  apps: [
    {
      name: "izuna",
      script: "src/main.ts",
      interpreter: "bun",
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        WANIKANI_API_KEY: process.env.WANIKANI_API_KEY,
        STEAM_API_KEY: process.env.STEAM_API_KEY,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID
      }
    }
  ]
};
