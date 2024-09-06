const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Embed } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
function parseDuration(duration) {
    const regex = /(\d+)([smhd])/g;
    let match;
    let milliseconds = 0;

    while ((match = regex.exec(duration)) !== null) { 
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 's':
                milliseconds += value * 1000;
                break;
            case 'm':
                milliseconds += value * 60 * 1000;
                break;
            case 'h':
                milliseconds += value * 60 * 60 * 1000;
                break;
            case 'd':
                milliseconds += value * 24 * 60 * 60 * 1000;
                break;
        }
    }

    return milliseconds;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member.')
        .addStringOption(option => option
            .setName('time')
            .setDescription('Sets the mute time (ex., "1h 20m").')
            .setRequired(true))
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to be muted.')
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {

               await LogChannel.send({embeds: [warnEmbed]})
                return await interaction.reply({
                    content: `${interaction.user}! Do not have the required permissions.`
                });

            }

            const { options } = interaction;
            const muteTimeInput = options.getString('time');
            const muteTime = parseDuration(muteTimeInput);
            const user = options.getUser('user');
            const timeoutTarget = await interaction.guild.members.fetch(user.id);

            if (isNaN(muteTime) || muteTime <= 0) {
                return interaction.reply({ content: 'Please provide a valid mute time.', ephemeral: true });
            }

            
            const maxMuteTime = 28 * 24 * 60 * 60 * 1000;
            if (muteTime > maxMuteTime) {
                return interaction.reply({ content: 'Mute time cannot exceed 28 days.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setDescription(`<:checkmark:1280376981405564979> ${user} has been muted.`)
                .setColor(0xff7e80);

            const dmEmbed = new EmbedBuilder()
                .setTitle(`Star Automation`)
                .setDescription(`<:mute:1280376968046575688> You have been muted in ${interaction.guild.name}`)
                .setColor(0xff7e80)
                .setTimestamp();

     
            const muteUntil = new Date(Date.now() + muteTime);

            await timeoutTarget.disableCommunicationUntil(muteUntil, 'Muted via command');
            await user.send({ embeds: [dmEmbed] });
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error muting the user:', error);
            await interaction.reply({ content: `There was an error trying to mute the ${user}.`, ephemeral: true });
        }
    }
};
