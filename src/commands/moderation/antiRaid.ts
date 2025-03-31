// src/commands/moderation/antiRaid.ts
import { ChannelType, GuildChannel, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types';
import { logger } from '../../utils/logger';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Configure anti-raid settings')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Action to take on raid detection')
        .setRequired(true)
        .addChoices(
          { name: 'Ban', value: 'ban' },
          { name: 'Kick', value: 'kick' },
          { name: 'Remove Roles', value: 'removeroles' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.guild) return;
    
    const action = interaction.options.getString('action', true);
    const guildId = interaction.guild.id;

    // Store anti-raid settings
    process.env[`antiraid_${guildId}`] = action;

    // Set up channel creation monitoring
    interaction.guild.channels.cache.forEach(channel => {
      channel.guild.on('channelCreate', async (newChannel: GuildChannel) => {
        try {
          const auditLogs = await interaction.guild!.fetchAuditLogs({
            type: ChannelType.GuildText,
            limit: 1
          });
          
          const creator = auditLogs.entries.first()?.executor;
          if (!creator || creator.bot) return;

          switch (action) {
            case 'ban':
              await interaction.guild!.members.ban(creator);
              break;
            case 'kick':
              await interaction.guild!.members.kick(creator);
              break;
            case 'removeroles':
              const member = await interaction.guild!.members.fetch(creator.id);
              await member.roles.set([]);
              break;
          }

          logger.info(`Anti-raid action ${action} taken against ${creator.tag}`);
        } catch (error) {
          logger.error('Error in anti-raid handling:', error);
        }
      });
    });

    await interaction.reply(`Anti-raid protection set to: ${action}`);
  }
};