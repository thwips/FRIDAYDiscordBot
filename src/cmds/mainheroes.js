module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;
  return message.channel.send({
    file: 'https://i.imgur.com/g62DGoi.png'
  })
}

module.exports.help = {
  name: "main",
  aliases: [
    "mainheroes",
    "main",
    "m"
  ],
  ignore: [
  "429222755745923073"
  ]
}