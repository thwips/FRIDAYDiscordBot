const gf = require('../globalfunctions.js'),
      typeList = require('../data/types.json'),
      config = require('../config/config.json'),
      fs = require('fs')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;
  if(!gf.isAdmin(message.guild.id,message.member.id)) return message.channel.send('You are not a mod.');

  let adminArg = args[0];  
  if(adminArg === undefined) return;

  if(adminArg === 'add') {
    let user = args[1];
    let toAdmin = message.mentions.users.first() || message.guild.members.get(user)
    if(!toAdmin) return message.channel.send("You did not not specify a user.")

    if(gf.isAdmin(message.guild.id, message,toAdmin.id || toAdmin.user.id)) return message.channel.send("User is already Admin.")
    config.server[message.guild.id].admin.push((toAdmin.id || toAdmin.user.id))
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${(toAdmin.username || toAdmin.user.username)} can now use bot admin commands.`)
  }
  else if(adminArg === 'remove') {
    let user = args[1];
    let toAdmin = message.mentions.users.first() || message.guild.members.get(user)

    if(!toAdmin) return message.channel.send("You did not not specify a user.")
    if(!gf.isAdmin(message.guild.id, message,toAdmin.id || toAdmin.user.id)) return message.channel.send("User is not an Admin.")
    if((toAdmin.id || toAdmin.user.id) === message.guild.ownerID) return message.channel.send("You cannot remove the owner")
    let index = config.server[message.guild.id].admin.indexOf(toAdmin.id || toAdmin.user.id)
    config.server[message.guild.id].admin.splice(index, 1)
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${(toAdmin.username || toAdmin.user.username)} can no longer use bot admin commands.`)
  }
  else if(adminArg === 'toggle') {
    let channelName = message.channel.id;
    let roomNumber = config.server[message.guild.id].rooms.indexOf(channelName);
    if(roomNumber === -1) {
      message.channel.send(`I am now monitoring ${message.channel.name}`)
      config.server[message.guild.id].rooms.push(channelName)
    }
    else {
      message.channel.send(`I am no longer keeping track of ${message.channel.name}`)
      let index = config.server[message.guild.id].rooms.indexOf(channelName)
      config.server[message.guild.id].rooms.splice(index, 1)
    }
    gf.writeToFile(config, `./config/config.json`)

  }
}

module.exports.help = {
  name: "admin",
  aliases: [
    "admin",
    "a"
  ],
  ignore: [
  ]
}