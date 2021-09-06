const Discord = require('discord.js'),
      { servers }  = require('./config/config.json'),
      fs = require('fs')

module.exports.isAdmin = (guildId, memberId) => {
  return (servers[guildId].admins.indexOf(memberId) > -1)
}

module.exports.inAllowedChannel = (interaction) => {
  return ((servers[interaction.guildId].rooms.length === 0 ||                         //bot is open to all channels
          servers[interaction.guildId].rooms.indexOf(interaction.channelId) !== -1))   //command in bot allowed channels
}


module.exports.isAllowed = (interaction) => {
  return (module.exports.inAllowedChannel(interaction) ||
        (module.exports.isAdmin(interaction.guildId, interaction.member.id)))
}