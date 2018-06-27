// Import the discord.js module
const Discord = require('discord.js'),
      config  = require('./config/config.json'),
      fs = require('fs')

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// Create an instance of a Discord Client
const bot = new Discord.Client({disableEveryone: true})
bot.commands = new Discord.Collection()

fs.readdir("./cmds", (err, files) => {
  if(err) console.error(err)
  let jsfiles = files.filter(f => f.split(".").pop() === "js")
  if(jsfiles.length <= 0){
    console.log("No commands to load")
    return;
  }

  console.log(`Load ${jsfiles.length} commands!`)

  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`)
    console.log(`${i + 1}: ${f} loaded!`)
    // bot.commands.set(props.help.name, props)
    props.help.aliases.forEach((name) => {
      bot.commands.set(name, props)
    })
  })
})

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
bot.on('ready', () => {
  console.log('I am ready!')
})

// Create an event listener for messages
bot.on('message', async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === 'dm') return;
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let cmd = bot.commands.get(command)
  if(cmd) cmd.run(bot, message, args)
});

// // Log our bot in
bot.login(token)