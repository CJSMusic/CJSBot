const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
// In-memory storage for command states and count
const commandStates = {
    pause: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing audio.'),
    async execute(interaction) {
        const { guild } = interaction;
        const connection = getVoiceConnection(guild.id);

        if (!connection) {
            return interaction.reply({ content: 'The bot is not connected to a voice channel.', ephemeral: true });
        }

        const player = connection.state.subscription?.player;

        if (!player || player.state.status !== 'playing') {
            return interaction.reply({ content: 'No audio is currently playing.', ephemeral: true });
        }

        player.pause();
        interaction.reply('Audio playback paused.');
    },
};
