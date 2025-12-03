import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('paid')
        .setDescription('Notify that payments were sent')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Payment date (ex: 12/01)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const date = interaction.options.getString('date');

        await interaction.reply({
            content: `💸 **Payments Sent**  
All payouts for **${date}** have been delivered.`,
            ephemeral: false
        });
    }
};
