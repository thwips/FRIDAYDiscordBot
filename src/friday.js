// Import the discord.js module
const Discord = require('discord.js'),
      config  = require('./config.json'),
      characterList = require('./characters.json'),
      typeList = require('./types.json')
// const 

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  switch (command) {
    case "type" :
    case "t" :
      let [type, arg] = args;
      if(arg !== undefined) arg = arg.toLowerCase()
      if(type != undefined) {
        type = type.toLowerCase()
        if(typeList[type] === undefined){
          message.channel.send('Please enter valid type');
          break;
        }
        if(arg === undefined) {
          const embed = embedType(typeList[type])
          message.channel.send({embed})   
          break;
        } else 
        if(typeList[type][arg] == undefined){
          message.channel.send('Please enter valid argument {adv | weak}');
          break;
        }
        else {
          let typeMod = typeList[type][arg]
          const embed = embedType(typeList[typeMod])
          message.channel.send({embed})         
        }
      }
    break;
    case "c" :
    case "char" :
    case "character" :
      let char = args.join('').toLowerCase()
      let character = getCharacter(char)
      if(character !== undefined){
        const embed = embedCharacter(character)
        message.channel.send({embed})
      }
      else {
        message.channel.send(`${char} is not a valid character`)
      }
    break;
  }
});

function getCharacter(prompt) {
  for (var character in characterList){
    let found = characterList[character].nickname.indexOf(prompt)
    if(found > -1){
      return characterList[character]
    }
  }
  return undefined
}

function getCharactersByType(type){
  let characters = ''
  for (var character in characterList){
    if(characterList[character].type == type){
      characters = characters.concat(character + ', ')
    }
  }
  return characters.substring(0, characters.length - 2)
}

function embedCharacter(character){
  const embed = new Discord.RichEmbed()
    .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
    .setColor(typeList[character.type.toLowerCase()].color)
    .setTitle(character.title)
    .setDescription(`**Aliases**: ${character.aliases}\n`)
    .setThumbnail(`${character.thumbnail}`)
    .addField(`Type`, `${character.type} ${character.class}\n`)
    .addField(`Hero Shard Location`, `${character.location}\n\n`)
    .addField(`${character.atk1Name}`, `${character.atk1Desc}\n`)
    .addField(`${character.atk2Name}`, `${character.atk2Desc}\n`)
    .addField(`${character.atk3Name}`, `${character.atk3Desc}\n`)
    .addField(`${character.atk4Name}`, `${character.atk4Desc}\n`)
    .addField(`${character.atk5Name}`, `${character.atk5Desc}\n`)
  return(embed)
}

function embedType(type){
  let characters = getCharactersByType(type.title)
  const embed = new Discord.RichEmbed()
    .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
    .setColor(type.color)
    .setTitle(type.title)
    .setDescription(`${type.description}`)
    .setThumbnail(`${type.image}`)
    .addField(`Characters`, `${characters}`)
  return(embed)
}


// Log our bot in
client.login(token);