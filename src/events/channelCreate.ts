// src/events/channelCreate.ts
import { Events, GuildChannel, AuditLogEvent } from 'discord.js';
import { antiRaidConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export const event = {
    name: Events.ChannelCreate,
    async execute(newChannel: GuildChannel) {
        const guild = newChannel.guild;
        if (!guild) return;

        const action = antiRaidConfig.get(guild.id);
        if (!action) return;

        try {
            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelCreate,
                limit: 1
            });

            const creator = auditLogs.entries.first()?.executor;
            if (!creator || creator.bot) return;

            const member = await guild.members.fetch(creator.id);
            if (!member) return;

            switch (action) {
                case 'ban':
                    if (member.bannable) {
                        await member.ban({ reason: 'Raid detected' });
                        logger.info(`Banned ${creator.tag} for raid detection.`);
                    } else {
                        logger.warn(`Cannot ban ${creator.tag}, missing permissions.`);
                    }
                    break;

                case 'kick':
                    if (member.kickable) {
                        await member.kick('Raid detected');
                        logger.info(`Kicked ${creator.tag} for raid detection.`);
                    } else {
                        logger.warn(`Cannot kick ${creator.tag}, missing permissions.`);
                    }
                    break;

                case 'removeroles':
                    if (member.manageable) {
                        await member.roles.set([]);
                        logger.info(`Removed roles from ${creator.tag} for raid detection.`);
                    } else {
                        logger.warn(`Cannot remove roles from ${creator.tag}, missing permissions.`);
                    }
                    break;
            }

        } catch (error) {
            logger.error('Error handling anti-raid event:', error);
        }
    }
};