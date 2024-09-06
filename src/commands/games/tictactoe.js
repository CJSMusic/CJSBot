const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play Tic-Tac-Toe with a friend'),
    async execute(interaction) {
        const player1 = interaction.user;
        let player2;

        const emptyBoard = ['⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜', '⬜'];
        let currentPlayer = player1;
        let board = [...emptyBoard];
        let gameOver = false;
        let winner = null;

        const generateBoard = (board) => {
            return `${board[0]}${board[1]}${board[2]}\n${board[3]}${board[4]}${board[5]}\n${board[6]}${board[7]}${board[8]}`;
        };

        const checkWinner = (board) => {
            const winningCombos = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

            for (const combo of winningCombos) {
                const [a, b, c] = combo;
                if (board[a] !== '⬜' && board[a] === board[b] && board[a] === board[c]) {
                    return board[a] === '❌' ? player1 : player2;
                }
            }

            return board.includes('⬜') ? null : 'Tie';
        };

        const boardEmbed = new EmbedBuilder()
            .setTitle('Tic-Tac-Toe')
            .setDescription(generateBoard(board))
            .setColor(0x00ff00);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('0').setLabel('1').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('1').setLabel('2').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('2').setLabel('3').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('3').setLabel('4').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('4').setLabel('5').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('5').setLabel('6').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('6').setLabel('7').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('7').setLabel('8').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('8').setLabel('9').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [boardEmbed], components: [row, row2] });

        const filter = i => i.user.id === currentPlayer.id && !gameOver;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            const index = parseInt(i.customId);

            if (board[index] === '⬜') {
                board[index] = currentPlayer === player1 ? '❌' : '⭕';
                winner = checkWinner(board);

                if (winner) {
                    gameOver = true;
                    boardEmbed.setDescription(generateBoard(board) + (winner === 'Tie' ? '\nIt\'s a Tie!' : `\n${winner.username} Wins!`))
                        .setColor(winner === 'Tie' ? 0xffff00 : 0x00ff00);
                    await i.update({ embeds: [boardEmbed], components: [] });
                } else {
                    currentPlayer = currentPlayer === player1 ? player2 : player1;
                    boardEmbed.setDescription(generateBoard(board));
                    await i.update({ embeds: [boardEmbed] });
                }
            } else {
                await i.reply({ content: 'That spot is already taken!', ephemeral: true });
            }
        });

        collector.on('end', collected => {
            if (!gameOver) {
                boardEmbed.setDescription(generateBoard(board) + '\nGame timed out.')
                    .setColor(0xff0000);
                interaction.editReply({ embeds: [boardEmbed], components: [] });
            }
        });

        if (!player2) {
            const filter = m => m.author.id !== player1.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    player2 = collected.first().author;
                    currentPlayer = player1;
                    interaction.followUp(`${player2.username} has joined the game! ${player1.username}, you go first!`);
                })
                .catch(() => {
                    interaction.followUp('No one joined the game. Cancelling...');
                    collector.stop();
                });
        }
    },
};