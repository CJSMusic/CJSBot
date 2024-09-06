const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone'); // Use moment-timezone for time formatting
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Get the current GMT time.'),
    
    async execute(interaction) {
        const commandName = 'time'; // Define the command name
        try {
            // Get current GMT time and format it
            const currentGMTTime = moment().utc().format('HH:mm:ss - DD-MM-YYYY');
            
            // Create and configure the embed message
            const embed = new EmbedBuilder()
                .setTitle('Current GMT Time')
                .setColor(0x00FFFF) // Set color to cyan
                .addFields(
                    { name: 'GMT Time:', value: currentGMTTime, inline: true }
                );

            // Reply with the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing the time command:', error);
            await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    },
};
