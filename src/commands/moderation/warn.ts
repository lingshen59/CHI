// src/commands/moderation/warnSettings.ts
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../types';

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('warnsettings')
        .setDescription('Configure warning settings')
        .addIntegerOption(option =>
            option.setName('maxwarns')
                .setDescription('Maximum number of warnings before action')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action to take when max warnings reached')
                .setRequired(true)
                .addChoices(
                    { name: 'Kick', value: 'kick' },
                    { name: 'Ban', value: 'ban' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

    async execute(interaction) {
        if (!interaction.guild) return;

        const maxWarns = interaction.options.getInteger('maxwarns', true);
        const action = interaction.options.getString('action', true) as 'kick' | 'ban';

        interaction.client.warnSettings.set(interaction.guild.id, {
            maxWarnings: maxWarns,
            action
        });

        await interaction.reply(`Warning settings updated:\nMax Warnings: ${maxWarns}\nAction: ${action}`);
    }
};