// src/handlers/eventHandler.ts
import { Client, Events } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

export async function registerEvents(client: Client) {
    // Get the directory name using import.meta.url
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        try {
            const filePath = join(eventsPath, file);
            const { default: event } = await import(`file://${filePath}`);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            logger.info(`Loaded event: ${event.name}`);
        } catch (error) {
            logger.error(`Error loading event ${file}:`, error);
        }
    }
}