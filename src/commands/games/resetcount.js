const { SlashCommandBuilder } = require('discord.js');

// In-memory storage for count
let count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetcount')
        .setDescription('Reset the count to zero.'),
        
    async execute(interaction) {
        try {
            count = 0;
            await interaction.reply({ content: `The count has been reset to ${count}.`, ephemeral: true });
        } catch (error) {
            console.error('Error executing the resetcount command:', error);
            await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    },
};