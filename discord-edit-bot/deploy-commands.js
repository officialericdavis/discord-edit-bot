import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Notify editors that content is ready to edit.')
    .toJSON(),
];

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

