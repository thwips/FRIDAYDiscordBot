const gf = require('../globalfunctions.js'),
      characterList = require('../data/characters.json'),
      fs = require('fs')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let charArgs = args.join('').toLowerCase()
  if(charArgs === '') return;

  let character = gf.getCharacter(charArgs)
  if(character !== undefined){
    const embed = gf.embedCharacter(character)
    return message.channel.send({embed})
  }
  else {
    return message.channel.send(`${args.join(' ')} is not a valid character`)
  }
}

module.exports.help = {
  name: "character",
  aliases: [
    "character",
    "char",
    "c"
  ],
  ignore: [
  "429222755745923073"
  ]
}