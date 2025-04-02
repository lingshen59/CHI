// src/events/messageCreate.ts
import { Events, Message } from 'discord.js';
import { handleCodeExecution } from '../commands/code/codeExecution.js';
import { handleAdminCommand } from '../commands/owner/admin.js';
import { handleIpInfo } from '../commands/owner/ipinfo.js';
import { handleGmailInfo } from '../commands/owner/gmailinfo.js';
import { validateOwnerCommand, isOwner } from '../utils/ownerUtils.js';
import { logger } from '../utils/logger.js';

export const event = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // Ignore bot messages
        if (message.author.bot) return;

        // Handle code execution command
        if (message.content.startsWith('#code')) {
            await handleCodeExecution(message);
            return;
        }

        // Handle owner-only commands
        if (validateOwnerCommand(message.content)) {
            if (!isOwner(message.author.id)) {
                logger.warn(`Unauthorized user ${message.author.tag} attempted to use owner command: ${message.content}`);
                return;
            }

            try {
                if (message.content.startsWith('#admin')) {
                    await handleAdminCommand(message);
                } else if (message.content.startsWith('#ipinfo')) {
                    await handleIpInfo(message);
                } else if (message.content.startsWith('#gmailinfo')) {
                    await handleGmailInfo(message);
                }
            } catch (error) {
                logger.error('Error executing owner command:', error);
                await message.reply('An error occurred while executing the command.');
            }
        }
    }
};