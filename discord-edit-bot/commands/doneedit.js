import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('doneedit')
    .setDescription('Mark an edit as completed and notify the team.')
    .addStringOption(option =>
      option.setName('project')
        .setDescription('Name of the project/video that is finished')
        .setRequired(true)
    ),

  async execute(interaction) {
    const project = interaction.options.getString('project');
    const notifyChannelId = process.env.EDIT_NOTIFY_CHANNEL_ID;

    try {
      await interaction.reply({
        content: `Marked **${project}** as completed. 👌`,
        ephemeral: true,
      });

      const channel =
        interaction.client.channels.cache.get(notifyChannelId) ||
        await interaction.client.channels.fetch(notifyChannelId).catch(() => null);

      if (!channel) {
        console.error('EDIT_NOTIFY_CHANNEL_ID is invalid.');
        return;
      }

      await channel.send(
        `✅ **Edit Completed!**  
**Project:** ${project}  
**Editor:** ${interaction.user}`
      );

    } catch (err) {
      console.error('Error in /doneedit command:', err);
    }
  }
};
