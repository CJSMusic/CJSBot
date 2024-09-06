require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { registerCommands, handleInteraction, handleMemberJoin } = require('./events/welcome'); // Import functions from welcome.js

// Create a new client instance with intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Initialize command collection
client.commands = new Collection();

// Load commands from the commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if (command.data && typeof command.data.toJSON === 'function') {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`Command ${file} does not have valid data.`);
        }
    }
}

// Register slash commands with the Discord API
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

// Load event handlers from the events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            // Ensure the interaction is not already replied or deferred
            if (!interaction.replied && !interaction.deferred) {
                await command.execute(interaction, client);
            } else {
                console.error('Interaction has already been acknowledged.');
            }
        } catch (error) {
            console.error('Error executing command:', error);

            // Ensure a single response to the interaction
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
            }
        }
    } else {
        // Handle the custom interaction for the welcome command
        await handleInteraction(interaction);
    }
});

// Handle new member joins
client.on(Events.GuildMemberAdd, async member => {
    await handleMemberJoin(member);
});

// Register commands with Discord
client.once(Events.ClientReady, async () => {
    await registerCommands(client);
    console.log('CJSBot is ready!');
});

// Log in to Discord with your app's token
client.login(process.env.TOKEN)
    .then(() => console.log('CJSBot Logged in successfully.'))
    .catch(console.error);
