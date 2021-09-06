const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config/config.json');
const gf = require('./globalfunctions.js');

// Create a new client instance
const client = new Client({ disableEveryone: true, intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => 
{
  if (!gf.isAllowed(interaction)) {
    await interaction.reply({ content: `I'm not allowed to post in here :(`, ephemeral: true });
    return;
  } 
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply({ content: `Something went wrong`, ephemeral: true });
    return;
  }

  if (interaction.isCommand()) {
    try {
        await command.reply(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    try {
        await command.click(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Login to Discord with your client's token
client.login(token);