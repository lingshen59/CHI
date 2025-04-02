// src/commands/owner/gmailinfo.ts
import { Message } from 'discord.js';
import { isOwner } from '../../utils/ownerUtils.js';
import axios from 'axios';
import { logger } from '../../utils/logger.js';

export const handleGmailInfo = async (message: Message) => {
    if (!message.content.startsWith('#gmailinfo') || !isOwner(message.author.id)) return;

    const args = message.content.split(' ');
    if (args.length !== 2) {
        await message.reply('Usage: #gmailinfo <email>');
        return;
    }

    const email = args[1];
    if (!email.endsWith('@gmail.com')) {
        await message.reply('This command only works with Gmail addresses.');
        return;
    }

    try {
        // Note: This is a mock implementation as real email verification should use proper APIs
        const info = `Email Information:
    Email: ${email}
    Valid Format: ${/^[^\s@]+@gmail\.com$/.test(email)}
    Creation Date: Not available (requires Google API)
    Last Activity: Not available (requires Google API)`;

        await message.reply(`\`\`\`${info}\`\`\``);
    } catch (error) {
        logger.error('Error in gmailinfo command:', error);
        await message.reply('Failed to fetch email information.');
    }
};