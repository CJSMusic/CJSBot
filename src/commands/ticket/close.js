const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();
// In-memory storage for command states and count
const commandStates = {
    close: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close your support ticket.'),
    
        async execute(interaction) {
            const ticketChannel = interaction.channel;
            const validChannelId = process.env.TICKET_CHANNEL_ID;

        // Ensure that the command is used within a ticket channel
        if (!ticketChannel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This command can only be used within a ticket channel.', ephemeral: true });
        }

        // Check if the user is the ticket creator or has appropriate permissions
        if (ticketChannel.name !== `ticket-${interaction.user.username}` && !interaction.member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
            return interaction.reply({ content: '🔒 You do not have permission to close this ticket.', ephemeral: true });
        }

        // Send a message to the ticket channel indicating closure
        const closeEmbed = new EmbedBuilder()
            .setTitle('Ticket Closed')
            .setDescription('🔒 This ticket has been closed. If you need further assistance, please create a new ticket using command /ticket.')
            .setColor(0xFF0000);

        await ticketChannel.send({ embeds: [closeEmbed] });

        // Delete the ticket channel
        await ticketChannel.delete();

        // Notify the user
        await interaction.reply({ content: '🔒 Your ticket has been closed.', ephemeral: true });
    },
};
