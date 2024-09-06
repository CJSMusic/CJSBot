const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    boitinfo: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays information about the bot.'),

    async execute(interaction) {
        const bot = interaction.client;

        // Create an embed to display bot information
        const pingEmbed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setColor(0xff7e80)
            .addFields(
                {
                    name: '🏓 Bot Latency',
                    value: `${Date.now() - interaction.createdTimestamp}ms`,
                    inline: true
                },
                {
                    name: '⏳ Bot Uptime',
                    value: formatDuration(bot.uptime),
                    inline: true
                },
                {
                    name: '🌐 Server Count',
                    value: `${bot.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: '👥 User Count',
                    value: `${bot.users.cache.size}`,
                    inline: true
                },
                {
                    name: '🔗 Invite Link',
                    value: '[Invite me to your server!](https://discord.com/oauth2/authorize?client_id=1279563313436426291&scope=bot&permissions=8)',
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: '/botinfo Command' });

        return interaction.reply({ embeds: [pingEmbed] });
    },
};

// Helper function to format the bot uptime
function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
