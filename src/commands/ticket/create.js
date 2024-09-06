const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config();
// In-memory storage for command states and count
const commandStates = {
    create: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-ticket')
        .setDescription('Create a new support ticket'),
    async execute(interaction) {
        const { guild } = interaction;
        const channelName = `ticket-${interaction.user.username}`;

        try {
            const channel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });

            await interaction.reply(`Your ticket has been created: ${channel}`);
        } catch (error) {
            console.error('Error creating ticket:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an error creating the ticket.', ephemeral: true });
            }
        }
    },
};
