// src/commands/general/help.ts
import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/Command';

const categories = {
    Music: ['play', 'skip', 'stop', 'queue'],
    Moderation: ['warn', 'warnsettings', 'antiraid'],
    Code: ['code'],
    General: ['help', 'ping']
};

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction: ChatInputCommandInteraction) {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_category')
                    .setPlaceholder('Select a category')
                    .addOptions(
                        Object.keys(categories).map(category => ({
                            label: category,
                            value: category.toLowerCase(),
                            description: `View ${category} commands`
                        }))
                    )
            );

        const initialEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Help Menu')
            .setDescription('Please select a category below to view available commands.')
            .setFooter({ text: 'Use the menu below to navigate through command categories' });

        await interaction.reply({
            embeds: [initialEmbed],
            components: [row]
        });
    }
};