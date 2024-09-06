const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder ()
    .setName("kick")
    .setDescription("kick a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
            option.setName("user")
            .setDescription("user to be kicked")
            .setRequired(true)   
    )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("reason for the kick")
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser("user")
        const reason = options.getString("reason");
        
        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
        .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
        .setColor(0xff7e80)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            await member.kick(reason);

            const embed = new EmbedBuilder()
        .setDescription(`${user} has been kicked for **${reason}**`)
        .setColor(0xff7e80)

         await interaction.reply({
             embeds: [embed]
        })
    }
}