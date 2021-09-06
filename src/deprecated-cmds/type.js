const gf = require('../globalfunctions.js'),
      typeList = require('../data/types.json'),
      fs = require('fs')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let [type, arg] = args;
  if(arg !== undefined) arg = arg.toLowerCase()
  if(type != undefined) {
    type = type.toLowerCase()
    if(typeList[type] === undefined){
      return message.channel.send('Please enter valid type')
    }
    if(arg === undefined) {
      const embed = gf.embedType(typeList[type], null)
      return message.channel.send({embed})
    }
    else if(arg === 'attacker' || arg === 'support' || arg === 'tank'){
      arg = arg.charAt(0).toUpperCase() + arg.substr(1);
      const embed = gf.embedType(typeList[type], arg)
      return message.channel.send({embed})
    }
    else if(typeList[type][arg] == undefined){
      message.channel.send('Please enter valid argument {adv | weak | attacker | support | tank}');
      return;
    }
    else {
      let typeMod = typeList[type][arg]
      const embed = gf.embedType(typeList[typeMod], null)
      message.channel.send({embed})         
    }
  }
}

module.exports.help = {
  name: "type",
  aliases: [
    "type",
    "t"
  ],
  ignore: [
  ]
}