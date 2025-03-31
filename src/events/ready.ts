// src/events/ready.ts
import { Client, Events } from 'discord.js';
import { logger } from '../utils/logger';

export const event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (!client.user) return;
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('/help for commands', { type: 4 });
  }
};