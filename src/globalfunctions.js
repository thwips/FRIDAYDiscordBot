const Discord = require('discord.js'),
      config  = require('./config/config.json'),
      characterList = require('./data/characters.json'),
      typeList = require('./data/types.json'),
      gacha = require('./data/gacha.json'),
      fs = require('fs')

module.exports.isAdmin = (guild, ID) => {
  return (config.server[guild].admin.indexOf(ID) > -1)
}

module.exports.inAllowedChannel = (message, ignoredRooms) => {
	return ((config.server[message.guild.id].rooms.length === 0 ||                        //bot is open to all channels
          config.server[message.guild.id].rooms.indexOf(message.channel.id) !== -1) &&  //command in bot allowed channels
          ignoredRooms.indexOf(message.channel.id) === -1)                              //command not in ignored channels
}

module.exports.isAllowed = (message, ignoredRooms) => {
  return (module.exports.inAllowedChannel(message, ignoredRooms) || (module.exports.isAdmin(message.guild.id,message.member.id)))
}

module.exports.getCharactersByType = (type) => {
  let characters = ''
  for (let character in characterList){
    if(characterList[character].type == type && characterList[character].class !== "Boss"){
      characters = characters.concat(character + ', ')
    }
  }
  return characters.substring(0, characters.length - 2)
}

module.exports.embedType = (type) => {
  let characters = module.exports.getCharactersByType(type.title)
  const embed = new Discord.RichEmbed()
    .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
    .setColor(type.color)
    .setTitle(type.title)
    .setDescription(`${type.description}`)
    .setThumbnail(`${type.image}`)
    .addField(`Characters`, `${characters}`)
  return(embed)
}

module.exports.getCharacter = (prompt) => {
  for (var character in characterList){
    let found = characterList[character].nickname.indexOf(prompt)
    if(found > -1){
      return characterList[character]
    }
  }
  return undefined
}

module.exports.embedCharacter = (character) => {
  const embed = new Discord.RichEmbed()
    .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
  if(character.type !== undefined) embed.setColor(typeList[character.type.toLowerCase()].color)
  if(character.title !== undefined) embed.setTitle(character.title)
  if(character.aliases !== undefined) embed.setDescription(`**Aliases**: ${character.aliases}\n`)
  if(character.thumbnail !== undefined) embed.setThumbnail(`${character.thumbnail}`)
  if(character.type !== undefined && character.class !== undefined) embed.addField(`Type`, `${character.type} ${character.class}\n`)
  if(character.location !== undefined) embed.addField(`Hero Shard Location`, `${character.location}\n\n`)
  if(character.basicName !== undefined) embed.addField(`${character.basicName}`, `${character.basicDesc}\n`)
  if(character.specialName !== undefined) embed.addField(`${character.specialName}`, `${character.specialDesc}\n`)
  if(character.ultimate1Name !== undefined) embed.addField(`${character.ultimate1Name}`, `${character.ultimate1Desc}\n`)
  if(character.passiveName !== undefined) embed.addField(`${character.passiveName}`, `${character.passiveDesc}\n`)
  if(character.ultimate2Name !== undefined) embed.addField(`${character.ultimate2Name}`, `${character.ultimate2Desc}\n`)
  return(embed)
}

module.exports.embedGacha = (type) => {
  const embed = new Discord.RichEmbed()
    .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
    .setColor(type.color)
    .setThumbnail(type.image)
    .setTitle(`These are the minimum percentage odds for prizes in the current ${type.category} Capsules`)

  if(type.heroes.length > 0) {
    let shardText = 'You can earn shards for the following characters in different amounts shown below:'
    embed.addField(shardText,type.heroes.join(', '))  
  }
  if(Object.keys(type.prizes).length !== 0 && type.prizes.constructor === Object){
    let dropRate = Object.keys(type.prizes)
    for (let i = 0; i < dropRate.length && i < 24; i++) {
      embed.addField(`${dropRate[i]}%`, type.prizes[dropRate[i]]) 
    }
  }
  return embed
}

module.exports.embedLinks = () => {
  const embed = new Discord.RichEmbed()
    .setTitle('Important Links')
  if(config.links.length > 0){
    for (let i = 0; i < config.links.length && i < 25; i++) {
      embed.addField(`${i+1}. ${config.links[i].name}`, config.links[i].url) 
    }
  }
  else {
    embed.setDescription(`There are no links`)
  }
  return embed
}

module.exports.writeToFile = (element, location) => {
  let json = JSON.stringify(element,null, 2)
  fs.writeFile(location, json, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

module.exports.swapArrayElements = (arr, indexA, indexB) => {
  var temp = arr[indexA]
  arr[indexA] = arr[indexB]
  arr[indexB] = temp
}

// function registerServer(server){
//   if(!(server.id in config.server)){
//     config.server[server.id] = {"rooms": []}
//     config.server[server.id]['admin'] = [server.ownerID]
//     writeToFile(config, `${__dirname}/data/config.json`)
//   }
// }

// function isregistered(server){
//   if(!(server.id in config.server)){
//     registerServer(server)
//     return false
//   }
//   return true;
// }