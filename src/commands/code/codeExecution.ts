// src/commands/code/codeExecution.ts
import { Message, EmbedBuilder } from 'discord.js';
import { executeCode } from '../../utils/codeExecutionService';
import { logger } from '../../utils/logger';

export const handleCodeExecution = async (message: Message) => {
  if (!message.content.startsWith('#code')) return;

  const args = message.content.slice(6).trim().split(/ +/);
  const language = args.shift()?.toLowerCase();
  const code = args.join(' ');

  if (!language || !code) {
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Error')
          .setDescription('Please use the format: #code <language> <code>')
          .addFields({ name: 'Example', value: '#code python print("Hello, World!")' })
      ]
    });
    return;
  }

  try {
    const result = await executeCode(language, code);
    
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Code Execution Result')
      .addFields(
        { name: 'Language', value: language, inline: true },
        { name: 'Status', value: result.status, inline: true },
        { name: 'Output', value: `\`\`\`${language}\n${result.output || 'No output'}\n\`\`\`` }
      );

    if (result.error) {
      embed.addFields({ name: 'Error', value: `\`\`\`\n${result.error}\n\`\`\`` });
    }

    await message.reply({ embeds: [embed] });
  } catch (error) {
    logger.error('Code execution error:', error);
    await message.reply('An error occurred while executing the code.');
  }
};