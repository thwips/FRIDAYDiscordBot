const gf = require('../globalfunctions.js'),
      gacha = require('../data/gacha.json'),
      fs = require('fs')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let category = args.join('').toLowerCase()
  let cat = Object.keys(gacha)
  if(category === '' || category === 'all'){
    return message.channel.send(`These are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
  }
  if(cat.indexOf(category) > -1) {
    const embed = gf.embedGacha(gacha[category])
    return message.channel.send({embed})        
  }
  return message.channel.send(`Invalid Category\nThese are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
}

module.exports.help = {
  name: "gacha",
  aliases: [
    "gacha",
    "g"
  ],
  ignore: [
  ]
}