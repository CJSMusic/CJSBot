const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');

// Initialize YouTube Data API v3 with the API key
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyDS1Cw-lz8iGGeA3vCuH-vf5-r3iMJee8k',
});

// Function to search for a YouTube video
async function searchYouTube(query) {
    try {
        const response = await youtube.search.list({
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 1,
        });

        const items = response.data.items;
        if (items && items.length > 0) {
            return items[0]; // Return the first video found
        } else {
            throw new Error('No videos found.');
        }
    } catch (error) {
        console.error('Error searching YouTube:', error.response ? error.response.data : error.message);
        throw new Error('Search failed.');
    }
}

// Create a new client instance with intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in the voice channel.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song title or artist')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const { member, guild } = interaction;

        if (!member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
        }

        const voiceChannel = member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const player = createAudioPlayer();

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('The bot has connected to the channel!');
        });

        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5000),
                    ]);
                } catch (error) {
                    console.log('The bot has disconnected from the channel and will not attempt to reconnect.');
                    connection.destroy();
                }
            }
        });

        try {
            // Search for the video on YouTube
            const video = await searchYouTube(query);
            const videoId = video.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const stream = ytdl(videoUrl, { filter: 'audioonly' });
            const resource = createAudioResource(stream);

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                interaction.reply(`Now playing: ${video.snippet.title}`).catch(err => {
                    console.error('Error sending reply:', err);
                });
            });

            player.on('error', (error) => {
                console.error('Error playing audio:', error);
                interaction.reply({ content: 'There was an error playing the audio.', ephemeral: true }).catch(err => {
                    console.error('Error sending reply:', err);
                });
                if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            });

            player.on(AudioPlayerStatus.Idle, () => {
                if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            });

        } catch (error) {
            console.error('Error searching YouTube:', error);
            interaction.reply({ content: `No videos found for: "${query}". Please try another search term.`, ephemeral: true }).catch(err => {
                console.error('Error sending reply:', err);
            });
        }
    },
};
