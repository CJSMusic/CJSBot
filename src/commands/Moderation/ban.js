const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to be banned")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the ban")
        ),
    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("user");
        const reason = options.getString("reason") || "No reason provided.";

        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({
                content: "User is not in the guild.",
                ephemeral: true
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: "You don't have permission to ban members.",
                ephemeral: true
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: "I don't have permission to ban members.",
                ephemeral: true
            });
        }

        const errEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
            .setColor(0xff7e80);

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        await member.ban({ reason: reason });  // Fixed this line

        const embed = new EmbedBuilder()
            .setDescription(`${user} has been banned for **${reason}**`)
            .setColor(0xff7e80);

        await interaction.reply({
            embeds: [embed]
        });
    }
};