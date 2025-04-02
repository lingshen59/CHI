// src/events/guildCreate.ts
import { EmbedBuilder, Events, Guild, ChannelType, Invite } from 'discord.js';
import { logger } from '../utils/logger.js';

export const event = {
    name: Events.GuildCreate,
    async execute(guild: Guild) {
        try {
            // Log join to console
            logger.info(`Joined new guild: ${guild.name}`);

            // Send welcome message to the first available channel
            const channel = guild.channels.cache
                .find(ch => ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me!)?.has('SendMessages'));

            if (channel && channel.isTextBased()) {
                const welcomeEmbed = new EmbedBuilder()
                    .setTitle('Thanks for inviting me! 🎉')
                    .setDescription('Use `/help` to see all available commands!')
                    .setColor('#00ff00');

                await channel.send({ embeds: [welcomeEmbed] });
            } else {
                logger.warn('No suitable channel found to send a welcome message.');
            }

            // Send server info to bot owner's logging channel
            const ownerChannelId = process.env.OWNER_LOG_CHANNEL;
            if (ownerChannelId) {
                const owner = await guild.fetchOwner();

                // Get the invite URL
                let inviteUrl = '';
                try {
                    // Check for vanity URL
                    const vanityInvite = await guild.fetchVanityData();
                    if (vanityInvite.code) {
                        inviteUrl = `https://discord.gg/${vanityInvite.code}`;
                    } else {
                        // Create a permanent invite if no vanity URL is available
                        const firstChannel = guild.channels.cache
                            .find(ch => ch.type === ChannelType.GuildText && ch.permissionsFor(guild.members.me!)?.has('CreateInstantInvite'));
                        if (firstChannel && firstChannel.isTextBased()) {
                            const inviteChannel = firstChannel as import('discord.js').TextChannel;
                            const invite: Invite = await inviteChannel.createInvite({ maxAge: 0, maxUses: 0 });
                            inviteUrl = invite.url;
                        }
                    }
                } catch (inviteError) {
                    logger.error('Error fetching invite URL:', inviteError);
                }

                const infoEmbed = new EmbedBuilder()
                    .setTitle('New Server Joined!')
                    .addFields(
                        { name: 'Server Name', value: guild.name },
                        { name: 'Server Owner Name', value: owner.user.tag },
                        { name: 'Total Members', value: guild.memberCount.toString() },
                        { name: 'Users', value: guild.members.cache.filter(m => !m.user.bot).size.toString() },
                        { name: 'Bots', value: guild.members.cache.filter(m => m.user.bot).size.toString() },
                        { name: 'Boosts', value: (guild.premiumSubscriptionCount ?? 0).toString() },
                        { name: 'Total Channels', value: guild.channels.cache.size.toString() },
                        { name: 'Text Channels', value: guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size.toString() },
                        { name: 'Voice Channels', value: guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size.toString() },
                        { name: 'Invite URL', value: inviteUrl || 'No invite URL available' }
                    )
                    .setColor('#0099ff')
                    .setThumbnail(guild.iconURL() || '');

                const logChannel = guild.client.channels.cache.get(ownerChannelId);
                if (logChannel && logChannel.isTextBased()) {
                    const textLogChannel = logChannel as import('discord.js').TextChannel;
                    await textLogChannel.send({ embeds: [infoEmbed] });
                } else {
                    logger.warn(`Owner log channel (ID: ${ownerChannelId}) not found or not a text channel.`);
                }
            } else {
                logger.warn('OWNER_LOG_CHANNEL environment variable is not set.');
            }
        } catch (error) {
            logger.error('Error handling guildCreate event:', error);
        }
    }
};