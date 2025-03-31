// src/index.ts
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './handlers/commandHandler';
import { registerEvents } from './handlers/eventHandler';
import { logger } from './utils/logger';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

async function main() {
  try {
    await registerCommands(client);
    await registerEvents(client);
    await client.login(process.env.TOKEN);
  } catch (error) {
    logger.error('Error starting bot:', error);
    process.exit(1);
  }
}

main();

export { client };