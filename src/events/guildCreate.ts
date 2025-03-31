// src/events/guildCreate.ts
import { EmbedBuilder, Events, Guild } from 'discord.js';
import { logger } from '../utils/logger';

export const event = {
  name: Events.GuildCreate,
  execute(guild: Guild) {
    // Log join to console
    logger.info(`Joined new guild: ${guild.name}`);

    // Send welcome message to the first available channel
    const channel = guild.channels.cache
      .find(ch => ch.type === 0 && ch.permissionsFor(guild.members.me!)?.has('SendMessages'));

    if (channel && channel.isTextBased()) {
      const welcomeEmbed = new EmbedBuilder()
        .setTitle('Thanks for inviting me! 🎉')
        .setDescription('Use `/help` to see all available commands!')
        .setColor('#00ff00');

      channel.send({ embeds: [welcomeEmbed] });
    }

    // Send server info to bot owner's logging channel
    const ownerChannel = process.env.OWNER_LOG_CHANNEL;
    if (ownerChannel) {
      const infoEmbed = new EmbedBuilder()
        .setTitle('New Server Joined!')
        .addFields(
          { name: 'Server Name', value: guild.name },
          { name: 'Total Members', value: guild.memberCount.toString() },
          { name: 'Users', value: guild.members.cache.filter(m => !m.user.bot).size.toString() },
          { name: 'Bots', value: guild.members.cache.filter(m => m.user.bot).size.toString() },
          { name: 'Boost Level', value: guild.premiumTier.toString() },
          { name: 'Total Channels', value: guild.channels.cache.size.toString() },
          { name: 'Text Channels', value: guild.channels.cache.filter(c => c.type === 0).size.toString() },
          { name: 'Voice Channels', value: guild.channels.cache.filter(c => c.type === 2).size.toString() }
        )
        .setColor('#0099ff')
        .setThumbnail(guild.iconURL() || '');

      const channel = guild.client.channels.cache.get(ownerChannel);
      if (channel?.isTextBased()) {
        channel.send({ embeds: [infoEmbed] });
      }
    }
  }
};