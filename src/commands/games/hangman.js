const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play Hangman with friends'),
    async execute(interaction) {
        const wordList = ['javascript', 'discord', 'programming', 'hangman', 'developer'];
        const chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
        let displayWord = '_'.repeat(chosenWord.length).split('');
        let wrongGuesses = 0;
        const maxGuesses = 6;
        const guessedLetters = [];
        const player = interaction.user;
        let gameOver = false;

        const hangmanEmbed = new EmbedBuilder()
            .setTitle('Hangman')
            .setDescription(`Word: ${displayWord.join(' ')}\n\nWrong guesses: ${wrongGuesses}/${maxGuesses}`)
            .setColor(0x00ff00);

        const createButtons = () => {
            const rows = [];
            const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

            for (let i = 0; i < alphabet.length; i += 5) {
                const row = new ActionRowBuilder();
                alphabet.slice(i, i + 5).forEach(letter => {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(letter)
                            .setLabel(letter)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(guessedLetters.includes(letter))
                    );
                });
                rows.push(row);
            }
            return rows;
        };

        await interaction.reply({ embeds: [hangmanEmbed], components: createButtons() });

        const filter = i => i.user.id === player.id && !gameOver;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            const guessedLetter = i.customId;

            if (guessedLetters.includes(guessedLetter)) {
                await i.reply({ content: 'You already guessed that letter!', ephemeral: true });
                return;
            }

            guessedLetters.push(guessedLetter);

            if (chosenWord.includes(guessedLetter)) {
                for (let j = 0; j < chosenWord.length; j++) {
                    if (chosenWord[j] === guessedLetter) {
                        displayWord[j] = guessedLetter;
                    }
                }
            } else {
                wrongGuesses++;
            }

            if (!displayWord.includes('_')) {
                gameOver = true;
                hangmanEmbed
                    .setDescription(`Word: ${displayWord.join(' ')}\n\nCongratulations, you guessed the word!`)
                    .setColor(0x00ff00);
            } else if (wrongGuesses >= maxGuesses) {
                gameOver = true;
                hangmanEmbed
                    .setDescription(`Word: ${chosenWord}\n\nGame over! You used all your guesses.`)
                    .setColor(0xff0000);
            } else {
                hangmanEmbed
                    .setDescription(`Word: ${displayWord.join(' ')}\n\nWrong guesses: ${wrongGuesses}/${maxGuesses}`)
                    .setColor(0x00ff00);
            }

            await i.update({ embeds: [hangmanEmbed], components: gameOver ? [] : createButtons() });
        });

        collector.on('end', collected => {
            if (!gameOver) {
                hangmanEmbed
                    .setDescription(`Word: ${displayWord.join(' ')}\n\nGame timed out.`)
                    .setColor(0xff0000);
                interaction.editReply({ embeds: [hangmanEmbed], components: [] });
            }
        });
    },
};