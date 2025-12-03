import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('doneedit')
        .setDescription('Mark an edit as finished and notify the channel')
        .addStringOption(option =>
            option.setName('project')
                .setDescription('Name of the video/project that is done')
                .setRequired(true)
        ),
    async execute(interaction) {
        const project = interaction.options.getString('project');

        await interaction.reply({
            content: `✅ **Edit Completed!**  
**Project:** ${project}  
Great job team — this one is wrapped up.`,
            ephemeral: false
        });
    }
};
