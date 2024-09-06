const { SlashCommandBuilder } = require('discord.js');

// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
let count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countgame')
        .setDescription('Increment the count.'),
        
    async execute(interaction) {
        const commandName = 'countgame';

        // Check if this command is disabled
        if (!commandStates[commandName]) {
            return interaction.reply({ content: `The command \`${commandName}\` is currently disabled.`, ephemeral: true });
        }

        try {
            count++;
            await interaction.reply({ content: `The count has been incremented to ${count}.`, ephemeral: true });
        } catch (error) {
            console.error('Error executing the countgame command:', error);
            await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    },
};