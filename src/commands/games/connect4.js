const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect4')
        .setDescription('Play Connect 4 with a friend'),
    async execute(interaction) {
        const player1 = interaction.user;
        let player2;
        let currentPlayer = player1;
        const columns = 7;
        const rows = 6;
        let board = Array.from({ length: rows }, () => Array(columns).fill('⬜'));
        let gameOver = false;
        let winner = null;

        const generateBoard = (board) => {
            return board.map(row => row.join('')).join('\n');
        };

        const checkWinner = (board) => {
            // Check horizontal, vertical, and diagonal for a win
            const directions = [
                { x: 0, y: 1 },  // Vertical
                { x: 1, y: 0 },  // Horizontal
                { x: 1, y: 1 },  // Diagonal /
                { x: 1, y: -1 }  // Diagonal \
            ];

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    if (board[y][x] === '⬜') continue;
                    for (const { x: dx, y: dy } of directions) {
                        let connected = 0;
                        for (let i = 0; i < 4; i++) {
                            const nx = x + dx * i;
                            const ny = y + dy * i;
                            if (nx < 0 || ny < 0 || nx >= columns || ny >= rows || board[ny][nx] !== board[y][x]) {
                                break;
                            }
                            connected++;
                        }
                        if (connected === 4) {
                            return board[y][x] === '🟥' ? player1 : player2;
                        }
                    }
                }
            }

            return board.flat().includes('⬜') ? null : 'Tie';
        };

        const boardEmbed = new EmbedBuilder()
            .setTitle('Connect 4')
            .setDescription(generateBoard(board))
            .setColor(0x00ff00);

        const createActionRow = () => {
            const row = new ActionRowBuilder();
            for (let i = 0; i < columns; i++) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(i.toString())
                        .setLabel((i + 1).toString())
                        .setStyle(ButtonStyle.Secondary)
                );
            }
            return row;
        };

        await interaction.reply({ embeds: [boardEmbed], components: [createActionRow()] });

        const filter = i => i.user.id === currentPlayer.id && !gameOver;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            const column = parseInt(i.customId);

            // Place piece in the selected column
            for (let y = rows - 1; y >= 0; y--) {
                if (board[y][column] === '⬜') {
                    board[y][column] = currentPlayer === player1 ? '🟥' : '🟦';
                    break;
                }
            }

            winner = checkWinner(board);

            if (winner) {
                gameOver = true;
                boardEmbed.setDescription(generateBoard(board) + (winner === 'Tie' ? '\nIt\'s a Tie!' : `\n${winner.username} Wins!`))
                    .setColor(winner === 'Tie' ? 0xffff00 : 0x00ff00);
                await i.update({ embeds: [boardEmbed], components: [] });
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                boardEmbed.setDescription(generateBoard(board));
                await i.update({ embeds: [boardEmbed], components: [createActionRow()] });
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