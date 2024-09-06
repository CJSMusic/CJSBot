const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice'); // Import this to get the current voice connection
// In-memory storage for command states and count
const commandStates = {
    stop: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and make the bot leave the voice channel.'),
    async execute(interaction) {
        const { member, guild } = interaction;

        // Check if the user is in a voice channel
        if (!member.voice.channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
        }

        const voiceChannel = member.voice.channel;
        const connection = getVoiceConnection(guild.id);

        // Check if the bot is connected to the voice channel
        if (!connection || connection.joinConfig.channelId !== voiceChannel.id) {
            return interaction.reply({ content: 'The bot is not in the same voice channel as you.', ephemeral: true });
        }

        const player = connection.state.subscription?.player;

        if (player) {
            // Stop the player
            player.stop();
            interaction.reply('Stopped the music.');
        } else {
            interaction.reply('No music is currently playing.');
        }

        // Disconnect from the voice channel
        wait(15).connection.destroy();
    },
};
