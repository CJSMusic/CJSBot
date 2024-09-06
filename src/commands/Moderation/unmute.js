const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a member.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('user to be muted')
            .setRequired(true)),
    execute: async function (interaction) {
        const { options } = interaction;
        const user = options.getUser('user')
        const timeoutTarget = await interaction.guild.members.fetch(user)
        const embed = new EmbedBuilder()
        .setDescription(`<:checkmark:1280376981405564979> ${user} has been unmuted`)
        .setColor(0xff7e80)

        const dmEmbed = new EmbedBuilder()
        .setTitle(`Star Automation`)
        .setDescription(`<:checkmark:1280376981405564979> You have been unmuted in ${interaction.guild.name}`)
        .setColor(0xff7e80) 
        .setTimestamp()


       await timeoutTarget.timeout(1000)
        await user.send({embeds: [dmEmbed]});
        await interaction.reply({embeds: [embed]})

        

    }
}