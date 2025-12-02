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
    // Reply to the user who ran /edit
    await interaction.reply({
      content: 'Got it! I’ve notified the editors that content is ready to edit. ✅',
      ephemeral: true, // only they can see it
    });

    // Find the channel you set in EDIT_NOTIFY_CHANNEL_ID
    const channel =
      interaction.client.channels.cache.get(EDIT_NOTIFY_CHANNEL_ID) ||
      await interaction.client.channels.fetch(EDIT_NOTIFY_CHANNEL_ID).catch(() => null);

    if (!channel) {
      console.error('Notify channel not found. Check EDIT_NOTIFY_CHANNEL_ID in .env');
      return;
    }

    // Message that goes into the edit notification channel
    await channel.send(
      `📝 **Content Ready to Edit!**\n` +
      `From: ${interaction.user} in <#${interaction.channelId}>`
    );

  } catch (error) {
    console.error('Error handling /edit command:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'Something went wrong while notifying editors.',
        ephemeral: true,
      });
    }
  }
});

client.login(DISCORD_TOKEN);


