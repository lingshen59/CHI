// src/handlers/commandHandler.ts
import { Client, Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command } from '../types/Command';
import { logger } from '../utils/logger.js';

export async function registerCommands(client: Client) {
    client.commands = new Collection();

    // Get the directory name using import.meta.url
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const commandsPath = join(__dirname, '..', 'commands');
    const commandFolders = readdirSync(commandsPath);

    const commands = [];

    for (const folder of commandFolders) {
        const commandFiles = readdirSync(join(commandsPath, folder))
            .filter(file => file.endsWith('.ts')); // Ensure you are importing .ts files

        for (const file of commandFiles) {
            try {
                const filePath = join(commandsPath, folder, file);
                const module = await import(`file://${filePath}`); // Use file:// to import the module correctly
                const { command } = module;
                if ('data' in command && typeof command.execute === 'function') {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                } else {
                    logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                logger.error(`Error loading command ${file}:`, error);
            }
        }
    }

    // Register commands globally
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

    try {
        logger.info('Started refreshing global application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        logger.info('Successfully reloaded global application (/) commands.');
    } catch (error) {
        logger.error('Error refreshing global application (/) commands:', error);
    }
}