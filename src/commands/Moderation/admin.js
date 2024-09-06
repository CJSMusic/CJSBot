const { SlashCommandBuilder } = require('discord.js');

// In-memory storage for command states
const commandStates = {
    countgame: true, // Command is enabled by default
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin command to enable or disable other commands.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to enable or disable')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Set the command as enabled or disabled')
                .setRequired(true)),
        
    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const enabled = interaction.options.getBoolean('enabled');

        if (commandStates[commandName] === undefined) {
            return interaction.reply({ content: `The command \`${commandName}\` does not exist.`, ephemeral: true });
        }

        commandStates[commandName] = enabled;
        await interaction.reply({ content: `The command \`${commandName}\` has been ${enabled ? 'enabled' : 'disabled'}.`, ephemeral: true });
    },
};