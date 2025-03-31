// src/commands/moderation/warn.ts
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types';
import { logger } from '../../utils/logger';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    
    if (!interaction.guild || !targetUser) return;

    const warnSettings = interaction.client.warnSettings.get(interaction.guild.id) || {
      maxWarns: 3,
      action: 'kick'
    };

    const warnsKey = `warns_${interaction.guild.id}_${targetUser.id}`;
    const currentWarns = (parseInt(process.env[warnsKey] || '0') || 0) + 1;
    process.env[warnsKey] = currentWarns.toString();

    await interaction.reply(`Warned ${targetUser.tag} for: ${reason}\nWarnings: ${currentWarns}/${warnSettings.maxWarns}`);

    if (currentWarns >= warnSettings.maxWarns) {
      const member = interaction.guild.members.cache.get(targetUser.id);
      if (!member) return;

      try {
        if (warnSettings.action === 'kick') {
          await member.kick(`Reached maximum warnings (${warnSettings.maxWarns})`);
        } else if (warnSettings.action === 'ban') {
          await member.ban({ reason: `Reached maximum warnings (${warnSettings.maxWarns})` });
        }
        logger.info(`${targetUser.tag} has been ${warnSettings.action}ed from ${interaction.guild.name}`);
      } catch (error) {
        logger.error(`Failed to ${warnSettings.action} user:`, error);
      }
    }
  }
};