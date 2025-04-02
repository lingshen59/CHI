// src/index.ts
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './handlers/commandHandler.js';
import { registerEvents } from './handlers/eventHandler.js';
import { logger } from './utils/logger.js';
import './types/Client.js'; // Ensure the augmentation is loaded

dotenv.config();

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration
    ],
    partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message]
});

// Extend the Client class to include commands
client.commands = new Collection();
client.musicStates = new Collection();
client.warnSettings = new Collection();

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