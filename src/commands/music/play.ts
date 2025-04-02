// src/commands/music/play.ts
import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import play from 'play-dl';
import { Command } from '../../types';
import { createMusicPanel } from './musicPanel.js';

const commandBuilder = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
        option.setName('song')
            .setDescription('Song name or URL')
            .setRequired(true)
    ) as SlashCommandBuilder; // Explicitly cast to SlashCommandBuilder

export const command: Command = {
    data: commandBuilder,

    async execute(interaction) {
        if (!interaction.guild) return;

        const query = interaction.options.getString('song', true);
        const member = interaction.guild.members.cache.get(interaction.user.id);

        if (!member?.voice.channel) {
            await interaction.reply('You must be in a voice channel!');
            return;
        }

        try {
            const searchResult = await play.search(query, { limit: 1 });
            if (!searchResult.length) {
                await interaction.reply('No results found!');
                return;
            }

            const song = {
                title: searchResult[0].title || 'Unknown',
                url: searchResult[0].url,
                duration: searchResult[0].durationRaw,
                thumbnail: searchResult[0].thumbnails[0].url,
                author: searchResult[0].channel?.name || 'Unknown',
                requestedBy: interaction.user.tag
            };

            if (!interaction.client.musicStates.has(interaction.guildId!)) {
                interaction.client.musicStates.set(interaction.guildId!, {
                    queue: [],
                    isPlaying: false,
                    volume: 100,
                    loop: false,
                    autoplay: false
                });
            }

            const musicState = interaction.client.musicStates.get(interaction.guildId!);
            if (!musicState) return;

            musicState.queue.push(song);

            if (!musicState.isPlaying) {
                musicState.isPlaying = true;
                await playSong(interaction, song);
            } else {
                await interaction.reply(`Added **${song.title}** to the queue!`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while playing the song!');
        }
    }
};

async function playSong(interaction: any, song: any) {
    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    const player = createAudioPlayer();

    connection.subscribe(player);
    player.play(resource);

    await createMusicPanel(interaction, song);

    player.on(AudioPlayerStatus.Idle, () => {
        const musicState = interaction.client.musicStates.get(interaction.guildId);
        if (musicState?.queue.length) {
            const nextSong = musicState.queue.shift();
            if (nextSong) playSong(interaction, nextSong);
        } else {
            musicState.isPlaying = false;
            connection.destroy();
        }
    });
}