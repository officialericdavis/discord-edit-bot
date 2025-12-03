import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
  Collection
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const { DISCORD_TOKEN } = process.env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Load slash commands
client.commands = new Collection();

const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file:///${filePath.replace(/\\/g, '/')}`);
  client.commands.set(command.default.data.name, command.default);
}

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
  }
});

client.login(DISCORD_TOKEN);
