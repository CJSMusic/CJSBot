const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const choices = ['rock', 'paper', 'scissors'];
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock-Paper-Scissors')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Choose rock, paper, or scissors')
                .setRequired(true)
                .addChoices(
                    { name: 'Rock', value: 'rock' },
                    { name: 'Paper', value: 'paper' },
                    { name: 'Scissors', value: 'scissors' }
                )),
    async execute(interaction) {
        const userChoice = interaction.options.getString('choice');
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = '';
        if (userChoice === botChoice) {
            result = 'It\'s a tie!';
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = '<:checkmark:1280441508297838633> You win!';
        } else {
            result = '<:xmark:1280442835853643815> You lose!';
        }

        const rpsEmbed = new EmbedBuilder()
            .setTitle('Rock-Paper-Scissors')
            .setDescription(`You chose: **${userChoice}**\nBot chose: **${botChoice}**\n\n${result}`)
            .setColor(result === 'You win!' ? 0x00ff00 : (result === 'You lose!' ? 0xff0000 : 0xffff00));

        await interaction.reply({ embeds: [rpsEmbed] });
    },
};