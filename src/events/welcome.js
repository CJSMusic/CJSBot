
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();
// In-memory storage for command states and count
const commandStates = {
    welcome: true, // Command is enabled by default
};
// In-memory storage for welcome messages and channels
const welcomeSettings = new Map();

/**
 * Register the 'setwelcome' command with Discord.
 * @param {Client} client - The Discord client instance.
 */
async function registerCommands(client) {
    const commands = [
        new SlashCommandBuilder()
            .setName('setwelcome')
            .setDescription('Set a custom welcome message and channel for new members')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('The welcome message to greet new members with')
                    .setRequired(true))
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('The channel where the welcome message will be sent')
                    .setRequired(true))
            .toJSON()
    ];

    try {
        // Register commands for a specific guild
        await client.application.commands.set(commands);
        console.log('Slash commands registered');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

/**
 * Handle interactions from the bot's commands.
 * @param {Interaction} interaction - The interaction that triggered the event.
 */
async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'setwelcome') {
        const message = interaction.options.getString('message');
        const channelId = interaction.options.getChannel('channel').id;

        // Save the welcome message and channel in memory
        welcomeSettings.set(interaction.guild.id, { message, channelId });

        await interaction.reply({ content: 'Welcome message and channel have been set!', ephemeral: true });
    }
}

/**
 * Handle new member join events and send a welcome message.
 * @param {GuildMember} member - The member who joined the guild.
 */
async function handleMemberJoin(member) {
    const guildSettings = welcomeSettings.get(member.guild.id);

    if (guildSettings) {
        const { message, channelId } = guildSettings;
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('Welcome to the Server!')
            .setDescription(message.replace('{user}', member.user.username))
            .setColor(0x00ff00);

        const channel = member.guild.channels.cache.get(channelId);
        if (channel) {
            channel.send({ content: `${member}`, embeds: [welcomeEmbed] });
        } else {
            console.error('Channel not found for welcome message.');
        }
    }
}

module.exports = { registerCommands, handleInteraction, handleMemberJoin };
