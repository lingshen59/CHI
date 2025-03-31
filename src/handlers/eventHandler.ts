// src/handlers/eventHandler.ts
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

export async function registerEvents(client: Client) {
  const eventsPath = join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventsPath)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of eventFiles) {
    try {
      const { event } = require(join(eventsPath, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      logger.error(`Error loading event ${file}:`, error);
    }
  }
}