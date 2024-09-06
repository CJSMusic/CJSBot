const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Shows the member count.'),
        
    async execute(interaction) {
        const commandName = 'membercount'; // Define the command name
        const guild = interaction.guild;
        const memberCount = guild.memberCount;
        const premiumSubscriptionCount = guild.premiumSubscriptionCount; // Corrected property name

        const embed = new EmbedBuilder()
            .setTitle('<:members:1280376966163464224> Member Count')
            .setColor(0xff7e80)
            .setDescription(`Member Count: \`${memberCount}\`\nBoost Count: \`${premiumSubscriptionCount}\``)
            .setThumbnail('https://media.discordapp.net/attachments/1277058642146889815/1280325674573500529/Star_Customs.png?ex=66d7abb4&is=66d65a34&hm=5e93d6a07915a1a9f3731db7cfa80be00cc1f9c9d558a9d41123adfef5b4eaa9&=&format=webp&quality=lossless&width=671&height=671')
            .setTimestamp()
            .setFooter({ text: '/membercount Command' });

        await interaction.reply({ embeds: [embed] });
    },
};
