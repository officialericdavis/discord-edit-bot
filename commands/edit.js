import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Notify the editors that new content is ready to edit.')
    .addStringOption(option =>
      option.setName('details')
        .setDescription('Optional details about the edit')
        .setRequired(false)
    ),

  async execute(interaction) {
    const details = interaction.options.getString('details') || 'No details provided.';
    const notifyChannelId = process.env.EDIT_NOTIFY_CHANNEL_ID;

    try {
      // Reply to user
      await interaction.reply({
        content: 'Editors have been notified. ✅',
        ephemeral: true,
      });

      // Fetch notification channel
      const channel =
        interaction.client.channels.cache.get(notifyChannelId) ||
        await interaction.client.channels.fetch(notifyChannelId).catch(() => null);

      if (!channel) {
        console.error('EDIT_NOTIFY_CHANNEL_ID is invalid.');
        return;
      }

       await channel.send(
        `📝 **New Content Ready to Edit!**  
**From:** ${interaction.user.username}  
**In:** #${interaction.channel.name}  
**Details:** ${details}`
      );

    } catch (err) {
      console.error('Error in /edit command:', err);
    }
  }
};
