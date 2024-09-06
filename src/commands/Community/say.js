const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something in chat.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Please enter the message you want the bot to say.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const commandName = 'say'; // Define the command name
        try {
            // Retrieve the message option
            const message = interaction.options.getString('message');
            const channel = interaction.channel;

            // Acknowledge the command execution with a reply
            await interaction.reply({ content: `Message received.`, ephemeral: true });

            // Send the message to the channel
            await channel.send({ content: message });

        } catch (error) {
            console.error('Error executing the say command:', error);
            await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    },
};
