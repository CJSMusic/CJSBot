const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// In-memory storage for command states and count
const commandStates = {
    countgame: true, // Command is enabled by default
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hogwarts')
        .setDescription('Choose a category out of Spells or Quotes!')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Select a category.')
                .setRequired(true)
                .addChoices(
                    { name: 'Harry Potter Spells', value: 'harry_potter_spells' },
                    { name: 'Harry Potter Quotes', value: 'harry_potter_quotes' }
                )
        )
        .addStringOption(option =>
            option.setName('type_spells')
                .setDescription('Choose a Spell or quote.')
                .setRequired(true)
                .addChoices(
                    { name: 'Expelliarmus', value: 'expelliarmus' },
                    { name: 'Avada Kedavra', value: 'avada_kedavra' },
                    { name: 'Famous Quotes', value: 'famous_quotes' },
                    { name: 'Inspirational Quotes', value: 'inspirational_quotes' }
                )
        )
        .addStringOption(option =>
            option.setName('type_quotes')
                .setDescription('Choose a Spell or quote.')
                .setRequired(true)
                .addChoices(
                    { name: 'Expelliarmus', value: 'expelliarmus' },
                    { name: 'Avada Kedavra', value: 'avada_kedavra' },
                    { name: 'Famous Quotes', value: 'famous_quotes' },
                    { name: 'Inspirational Quotes', value: 'inspirational_quotes' }
                )
        ),
    async execute(interaction) {
        const commandName = 'hogwarts';
        const category = interaction.options.getString('category');
        const subCategory = interaction.options.getString('type');

        if (category === 'harry_potter_spells') {
            if (subCategory === 'expelliarmus') {
                const spellEmbed = new EmbedBuilder()
                    .setTitle('Safe Spell: Expelliarmus')
                    .setColor(0x00FF00)
                    .setDescription('Expelliarmus is a Disarming Charm used to disarm an opponent, causing whatever they are holding to fly out of their hand.')
                    .setTimestamp()
                    .setFooter({ text: '/hogwarts Command' });
                return interaction.reply({ embeds: [spellEmbed] });
            } else if (subCategory === 'avada_kedavra') {
                const spellEmbed = new EmbedBuilder()
                    .setTitle('Hurtful Spell: Avada Kedavra')
                    .setColor(0xFF0000)
                    .setDescription('Avada Kedavra is one of the three Unforgivable Curses. It causes instant death to the victim, and there is no known counter-curse.')
                    .setTimestamp()
                    .setFooter({ text: '/hogwarts Command' });
                return interaction.reply({ embeds: [spellEmbed] });
            }
        } else if (category === 'harry_potter_quotes') {
            if (subCategory === 'wizzard harry') {
                const quoteEmbed = new EmbedBuilder()
                    .setTitle('Your a Wizzard Harry!')
                    .setColor(0x00FF00)
                    .setDescription(
                        `[Hagrid]\nYou're a wizard, Harry.\n\n` +
                        `[Harry]\nI'm a... WHAT?!\n\n` +
                        `[Hagrid]\nHarry, you're a wizard.\n\n` +
                        `[Harry]\nI'm a what?!\n\n` +
                        `[Hagrid]\nA wizard, Harry.\n\n` +
                        `[Harry]\nI'm a WIZARD?!\n\n` +
                        `[Hagrid]\nYes, Harry, you're a wizard.\n\n` +
                        `[Harry]\nBut I'm just Harry.\n\n` +
                        `[Hagrid]\nWell, "Just Harry", you're a wizard.`
                    )
                    .setTimestamp()
                    .setFooter({ text: '/hogwarts Command' });
                return interaction.reply({ embeds: [quoteEmbed] });
            } else if (subCategory === 'inspirational_quotes') {
                const inspirationalQuoteEmbed = new EmbedBuilder()
                    .setTitle('Inspirational Quotes')
                    .setColor(0x00FF00)
                    .setDescription(
                        `"It does not do to dwell on dreams and forget to live, remember that." - Albus Dumbledore\n\n` +
                        `"Happiness can be found even in the darkest of times, if one only remembers to turn on the light." - Albus Dumbledore`
                    )
                    .setTimestamp()
                    .setFooter({ text: '/hogwarts Command' });
                return interaction.reply({ embeds: [inspirationalQuoteEmbed] });
            }
        } else {
            // Handle unexpected category or sub_category
            return interaction.reply({
                content: 'Invalid category or sub-category. Please select a valid option.',
                ephemeral: true
            });
        }
    },
};
