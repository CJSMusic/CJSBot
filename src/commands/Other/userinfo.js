const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    userionfo: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')   
        .setDescription(`Information about a user.`)
        .setDMPermission(false)
        .addUserOption(option => option 
            .setName('user')
            .setDescription(`The user you want to get information about`)
            .setRequired(true)
        ),
    async execute(interaction) {
        try {

            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const userAvatar = user.displayAvatarURL({ size: 64 });
            const badges = user.flags.toArray().join(', ');
            const botStatus = user.bot ? 'Yes' : 'No';
            
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Information`) 
                .setColor('#ff7e80')
                .setThumbnail(userAvatar)
                .addFields({
                    name: `<:discord:1280376963831431259> Joined Discord`,
                    value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
                    inline: true
                })
                .addFields({
                    name: `<:CJSBot:1280446000162668636>  Joined Server`,
                    value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
                    inline: true
                })
                .setTimestamp()
                .setFooter({ text: `User ID: ${user.id}`})

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `An error occurred while executing the command.` });
        }
    }
}