// src/commands/moderation/antiRaid.ts
import { Command } from '../../types/index.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const antiRaidCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('antiraid')
        .setDescription('Enable or disable anti-raid measures')
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Enable anti-raid measures')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable anti-raid measures')
        ),
    execute: async (interaction) => {
        // Your command logic here
        await interaction.reply('Anti-raid command executed!');
    },
};