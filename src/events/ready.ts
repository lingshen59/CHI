// src/events/ready.ts
import { Client, Events, ActivityType } from 'discord.js';
import { logger } from '../utils/logger.js';

export const event = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client.user) return;
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('Hello guys! Nice to meet yall', { type: ActivityType.Streaming, url: 'https://www.twitch.tv/yourtwitchchannel' });
    }
};