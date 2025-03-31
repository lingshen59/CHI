// src/commands/music/musicPanel.ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Song } from '../../types';

export async function createMusicPanel(interaction: any, song: Song) {
    const embed = new EmbedBuilder()
        .setTitle('Now Playing')
        .setDescription(`**${song.title}**`)
        .addFields(
            { name: 'Duration', value: song.duration, inline: true },
            { name: 'Author', value: song.author, inline: true },
            { name: 'Requested By', value: song.requestedBy, inline: true }
        )
        .setThumbnail(song.thumbnail)
        .setColor('#0099ff');

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('volumeDown')
                .setLabel('🔉')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('volumeUp')
                .setLabel('🔊')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('pause')
                .setLabel('⏸️')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('⏭️')
                .setStyle(ButtonStyle.Primary)
        );

    const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('shuffle')
                .setLabel('🔀')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('loop')
                .setLabel('🔁')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('⏹️')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('autoplay')
                .setLabel('📻')
                .setStyle(ButtonStyle.Secondary)
        );

    await interaction.reply({ embeds: [embed], components: [row, row2] });
}