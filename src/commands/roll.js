const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function rollDice(interaction) {
  const diceAmount = interaction.options.getInteger('diceamount');
  const diceSize = interaction.options.getInteger('dicesize');
  if (diceAmount > 10)
  {
    await interaction.reply({ content: 'I only have 10 dice :(', ephemeral: true });
    return;
  }
  else if(diceAmount < 1)
  {
    await interaction.reply({ content: 'You need positive dice amounts', ephemeral: true })
    return;
  }
  if (diceSize < 2)
  {
    await interaction.reply({ content: 'Needs to have 2 or more faces', ephemeral: true });
    return;
  }
  else if (diceSize > 420)
  {
    await interaction.reply({ content: 'Dice too big', ephemeral: true });
    return;
  }
  let diceRolls = [];
  let total = 0;
  for (let i = 0; i < diceAmount; i++)
  {
    roll = Math.floor(Math.random() * diceSize) + 1;
    total += roll;
    diceRolls.push(roll);
  }
  const messageEmbed = new MessageEmbed()
    .setTitle(`Dice result: ${total}`)
    .setDescription(`Each roll was ${diceRolls.join(', ')}`)
  await interaction.reply({ embeds : [messageEmbed] })
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll Dice!')
    .addIntegerOption(option =>
      option.setName('diceamount')
        .setDescription('Amount of dice to roll')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('dicesize')
        .setDescription('Type of dice to roll')
        .setRequired(true)),
  async reply(interaction) {
    await rollDice(interaction);
  },
  async click(interaction) {
    //unused
  }
}