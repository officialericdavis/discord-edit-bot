import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('paid')
    .setDescription('Notify that payouts were sent.')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('Date of the payment (e.g., 12/01/2025)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const date = interaction.options.getString('date');
    const notifyChannelId = process.env.PAYMENT_NOTIFY_CHANNEL_ID;

    try {
      await interaction.reply({
        content: `Payments for **${date}** have been marked as sent. 💸`,
        ephemeral: true,
      });

      const channel =
        interaction.client.channels.cache.get(notifyChannelId) ||
        await interaction.client.channels.fetch(notifyChannelId).catch(() => null);

      if (!channel) {
        console.error('PAYMENT_NOTIFY_CHANNEL_ID is invalid.');
        return;
      }

      await channel.send(
        `💸 **Payments Sent**  
All payouts for **${date}** have been delivered.  
Updated by: ${interaction.user}`
      );

    } catch (err) {
      console.error('Error in /paid command:', err);
    }
  }
};
