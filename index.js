import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
} from 'discord.js';

const { DISCORD_TOKEN, EDIT_NOTIFY_CHANNEL_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'edit') return;

  try {
    await interaction.reply({
      content: 'Got it! The editors have been notified. ✅',
      flags: 64 // modern replacement for ephemeral: true
    });

    const channel =
      interaction.client.channels.cache.get(EDIT_NOTIFY_CHANNEL_ID) ||
      await interaction.client.channels.fetch(EDIT_NOTIFY_CHANNEL_ID).catch(() => null);

    if (!channel) {
      console.error('Notify channel not found. Check EDIT_NOTIFY_CHANNEL_ID in .env');
      return;
    }

    await channel.send(
      `📝 **Content Ready to Edit!**\nFrom: ${interaction.user} in <#${interaction.channelId}>`
    );

  } catch (error) {
    console.error('Error handling /edit command:', error);
  }
});

client.login(DISCORD_TOKEN);

