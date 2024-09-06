const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear/Delete messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount of messages.")
                .setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger("amount")

        const errorembed = new EmbedBuilder()
        .setDescription("<:xmark:1280442835853643815> You can only delete between **1** and **99** messages.")
        .setColor(0xff7e80)

        if (amount < 1 || amount > 99) {
            return interaction.reply({ embeds: [errorembed], ephemeral: true });
        }

        const cleanembed = new EmbedBuilder()
        .setDescription(`<:checkmark:1280441508297838633> Successfully deleted **${amount}** messages.`)
        .setColor(0xff7e80)

        await interaction.channel.bulkDelete(amount, true);
        return interaction.reply({ embeds: [cleanembed], ephemeral: true });
    },
};