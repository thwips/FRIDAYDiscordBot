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
      message.channel.send('Please enter valid type');
      return;
    }
    if(arg === undefined) {
      const embed = gf.embedType(typeList[type])
      message.channel.send({embed})   
      return;
    } else 
    if(typeList[type][arg] == undefined){
      message.channel.send('Please enter valid argument {adv | weak}');
      return;
    }
    else {
      let typeMod = typeList[type][arg]
      const embed = gf.embedType(typeList[typeMod])
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