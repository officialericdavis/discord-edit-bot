import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Load commands from /commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const { default: command } = await import(pathToFileURL(filePath).href);

    if (!command || !command.data || !command.execute) {
        console.error(`❌ Invalid command file: ${file}`);
        continue;
    }

    client.commands.set(command.data.name, command);
}

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Slash command interaction handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ Command not found: ${interaction.commandName}`);
        return interaction.reply({
            content: 'Command not registered on the bot.',
            flags: 64 // ephemeral replacement
        });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error executing this command!',
            flags: 64
        });
    }
});

client.login(process.env.TOKEN);
