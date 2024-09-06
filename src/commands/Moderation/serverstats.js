const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Displays statistics about the server'),
    async execute(interaction) {
        const { guild } = interaction;

        // Gather server statistics
        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
        const totalChannels = guild.channels.cache.size;
        const totalRoles = guild.roles.cache.size;
        const totalEmojis = guild.emojis.cache.size;
        const createdAt = guild.createdAt.toDateString();

        const serverStatsEmbed = new EmbedBuilder()
            .setTitle(`Server Stats for ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .setColor(0x00ff00)
            .addFields(
                { name: 'Total Members', value: totalMembers.toString(), inline: true },
                { name: 'Online Members', value: onlineMembers.toString(), inline: true },
                { name: 'Total Channels', value: totalChannels.toString(), inline: true },
                { name: 'Total Roles', value: totalRoles.toString(), inline: true },
                { name: 'Total Emojis', value: totalEmojis.toString(), inline: true },
                { name: 'Server Created On', value: createdAt, inline: true }
            )
            .setFooter({ text: `Server ID: ${guild.id}` });

        await interaction.reply({ embeds: [serverStatsEmbed] });
    },
};