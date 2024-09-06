const { Events, VoiceConnectionStatus } = require('discord.js');
const { AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        // When a user joins or leaves a voice channel
        if (oldState.channelId !== newState.channelId) {
            // User joined or left a voice channel

            // If the bot itself is changing voice channels
            if (newState.member.id === client.user.id) {
                if (newState.channelId) {
                    console.log(`Bot has joined channel: ${newState.channel.name}`);
                } else {
                    console.log('Bot has disconnected from the voice channel');
                }
                return; // Skip further checks if it's the bot changing channels
            }

            // Check if a user has disconnected from the voice channel
            if (!newState.channelId && oldState.channelId) {
                console.log(`${oldState.member.user.tag} has left the channel`);
            }

            // Example: Disconnect from the voice channel after 5 minutes of inactivity
            const voiceConnection = getVoiceConnection(oldState.guild.id);
            if (voiceConnection && voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
                setTimeout(() => {
                    if (voiceConnection.state.status === VoiceConnectionStatus.Ready && !voiceConnection.state.subscription) {
                        voiceConnection.destroy();
                        console.log('Bot disconnected from voice channel due to inactivity.');
                    }
                }, 5 * 60 * 1000); // 5 minutes in milliseconds
            }
        }

        // Handle cases where the bot needs to stop the music
        if (oldState.channelId === newState.channelId && oldState.channelId !== null) {
            // Check if the bot is in the same channel and if it's supposed to stop
            const voiceConnection = getVoiceConnection(newState.guild.id);
            if (voiceConnection) {
                const player = voiceConnection.state.subscription?.player;
                if (player && player.state.status === AudioPlayerStatus.Playing) {
                    // Optionally handle the case where you need to stop the player
                    // player.stop();
                }
            }
        }
    },
};
