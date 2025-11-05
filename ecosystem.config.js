module.exports = {
  apps: [
    {
      name: "izuna-prod",
      script: "src/main.ts",
      interpreter: "bun",
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
        DISCORD_TOKEN: process.env.DISCORD_TOKEN,
        STEAM_API_KEY: process.env.STEAM_API_KEY,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID
      }
    }
  ]
};
