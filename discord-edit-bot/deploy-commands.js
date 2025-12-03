import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [];

const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file:///${filePath.replace(/\\/g, '/')}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function main() {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

main();
