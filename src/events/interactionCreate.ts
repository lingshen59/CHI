// src/events/interactionCreate.ts
import { Events, Interaction } from 'discord.js';
import { logger } from '../utils/logger.js';

export const event = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(`Error executing ${interaction.commandName}:`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Error executing command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Error executing command!', ephemeral: true });
            }
        }
    }
};