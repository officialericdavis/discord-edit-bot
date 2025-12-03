import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands from /commands folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
        const module = await import(filePath);
        const command = module.default;

        if (!command || !command.data) {
            console.error(`❌ Skipped ${file} — missing export default or .data`);
            continue;
        }

        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);

    } catch (err) {
        console.error(`❌ Failed to load ${file}:`, err);
    }
}

// Deploy via REST API
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
    console.log(`\n🚀 Deploying ${commands.length} slash commands…`);

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );

    console.log('✅ Slash commands registered successfully.\n');
} catch (error) {
    console.error('❌ Error registering commands:', error);
}
