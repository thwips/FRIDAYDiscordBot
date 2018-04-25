const gf = require('../globalfunctions.js'),
      fs = require('fs')
let   gacha = require('../data/gacha.json'),
      config = require('../config/config.json')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  if(args[0] === undefined) {
    const embed = gf.embedLinks()
    return message.channel.send({embed})
  } 
  if(!gf.isAdmin(message.guild.id,message.member.id)){
    return message.channel.send('Only Mods can add or modify links')
  }

  let [linkArg] = args;

  if(linkArg == 'add'){
    let url = args[1]
    let urlName = args.slice(2).join(' ')
    if(url === undefined) return message.channel.send('Not a valid url')
    if(urlName == '') return message.channel.send('Please add url name')
    config.links.push({'name':urlName,'url':url})
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${urlName} has now been added to link ${config.links.length}`)    
  }
  else if(linkArg == 'remove'){
    if(args[1] === undefined) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let num = parseInt(args[1])
    if(num < 1 || num > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let deletedLink = config.links[num - 1].name
    config.links.splice(num - 1, 1)
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${deletedLink} has now been removed`)
  }
  else if(linkArg == 'change'){
    if(args[1] === undefined) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let num = parseInt(args[1])
    let url = args[2]
    if(num < 1 || num > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    if(url == '') return message.channel.send('please add valid url')
    config.links[num - 1].url = url
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${config.links[num - 1].name} now points to ${config.links[num - 1].url}`)
  }
  else if(linkArg == 'rename'){
    if(args[1] === undefined) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let num = parseInt(args[1])
    let urlName = args.slice(2).join(' ')
    if(num < 1 || num > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    if(urlName == '') return message.channel.send('please add valid url name')
    let old = config.links[num - 1].name
    config.links[num - 1].name = urlName
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${old} is now ${config.links[num - 1].name}`)
  }
  else if(linkArg == 'swap'){
    if(args[1] === undefined || args[2] === undefined) return message.channel.send(`Please add 2 link numbers between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let num1 = parseInt(args[1])
    let num2 = parseInt(args[2])
    if(num1 < 1 || num1 > config.links.length || num2 < 1 || num2 > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    gf.swapArrayElements(config.links, num1 - 1, num2 - 1)
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${config.links[num2 -1].name} and ${config.links[num1 -1].name} have now switched places`)
  }
  else if(linkArg == 'move'){
    if(args[1] === undefined || args[2] === undefined) return message.channel.send(`Please add 2 link numbers between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let num1 = parseInt(args[1])
    let num2 = parseInt(args[2])
    if(num1 < 1 || num1 > config.links.length || num2 < 1 || num2 > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
    let temp = config.links[num1 - 1]
    config.links.splice(num1 - 1, 1)
    config.links.splice(num2 -1 , 0, temp)
    gf.writeToFile(config, `./config/config.json`)
    return message.channel.send(`${config.links[num2 -1].name} is now link number ${num2}`)
  }
}

module.exports.help = {
  name: "links",
  aliases: [
    "links",
    "link",
    "l"
  ],
  ignore: [
  ]
}