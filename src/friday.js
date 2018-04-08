// Import the discord.js module
const Discord = require('discord.js'),
      config  = require('./data/config.json'),
      characterList = require('./data/characters.json'),
      typeList = require('./data/types.json'),
      gacha = require('./data/gacha.json'),
      fs = require('fs')

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// Create an instance of a Discord Client
const bot = new Discord.Client({disableEveryone: true})
bot.commands = new Discord.Collection()

fs.readdir("./cmds", (err, files) => {
  if(err) console.error(err)
  let jsfiles = files.filter(f => f.split(".").pop() === "js")
  if(jsfiles.length <= 0){
    console.log("No commands to load")
    return;
  }
  console.log(`Load ${jsfiles.length} commands!`)

  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`)
    console.log(`${i + 1}: ${f} loaded!`)
    // bot.commands.set(props.help.name, props)
    props.help.aliases.forEach((name) => {
      bot.commands.set(name, props)
    })
  })
})

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
bot.on('ready', () => {
  console.log('I am ready!')
})

// Create an event listener for messages
bot.on('message', async message => {
  // if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === 'dm') return;
  // if(!isregistered(message.guild)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let cmd = bot.commands.get(command)
  if(cmd) cmd.run(bot, message, args)

  // switch (command) {
  //   case "type" :
  //   case "t" :
  //     if(!isAllowed(message)) return;
  //     let [type, arg] = args;
  //     if(arg !== undefined) arg = arg.toLowerCase()
  //     if(type != undefined) {
  //       type = type.toLowerCase()
  //       if(typeList[type] === undefined){
  //         message.channel.send('Please enter valid type');
  //         break;
  //       }
  //       if(arg === undefined) {
  //         const embed = embedType(typeList[type])
  //         message.channel.send({embed})   
  //         break;
  //       } else 
  //       if(typeList[type][arg] == undefined){
  //         message.channel.send('Please enter valid argument {adv | weak}');
  //         break;
  //       }
  //       else {
  //         let typeMod = typeList[type][arg]
  //         const embed = embedType(typeList[typeMod])
  //         message.channel.send({embed})         
  //       }
  //     }
  //   break;
  //   case "c" :
  //   case "char" :
  //   case "character" :
  //     if(!isAllowed(message)) return;
  //     let char = args.join('').toLowerCase()
  //     let character = getCharacter(char)
  //     if(character !== undefined){
  //       const embed = embedCharacter(character)
  //       message.channel.send({embed})
  //     }
  //     else {
  //       message.channel.send(`${args.join(' ')} is not a valid character`)
  //     }
  //   break;
  //   case "g" :
  //   case "gacha" :
  //     if(!isAllowed(message)) return;
  //     let category = args.join('').toLowerCase()
  //     let cat = Object.keys(gacha)
  //     if(category === '' || category === 'all'){
  //       return message.channel.send(`These are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
  //     }
  //     if(cat.indexOf(category) > -1) {
  //       const embed = embedGacha(gacha[category])
  //       return message.channel.send({embed})        
  //     }
  //     return message.channel.send(`Invalid Category\nThese are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
  //   break;
  //   case 'l':
  //   case 'link':
  //   case 'links':
  //     if(!isAllowed(message)) return;
  //     let [linkArg, url] = args;
  //     let urlName = args.slice(2).join(' ')
  //     if(linkArg === undefined) {
  //       const embed = embedLinks()
  //       return message.channel.send({embed})
  //     } 
  //     if(!isAdmin(message,message.member.id)){
  //       return message.channel.send('Only Mods can add or modify links')
  //     }
  //     switch(linkArg){
  //       case 'add':
  //         if(url === undefined || !ValidURL(url)) return message.channel.send('Not a valid url')
  //         if(urlName == '') return message.channel.send('Please add url name')
  //         config.links.push({'name':urlName,'url':url})
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${urlName} has now been added to link ${config.links.length}`)
  //       break;
  //       case 'remove':
  //         if(url === undefined) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         let num = parseInt(url)
  //         if(num < 1 || num > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         let deletedLink = config.links[num - 1].name
  //         config.links.splice(num - 1,1)
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${deletedLink} has now been removed`)
  //       break;
  //       case 'change': //FORGIVE ME FOR THE HACKY CODE I'M ABOUT TO DO url = num and urlName is url I'M SORRY
  //         if(url === undefined) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         let number = parseInt(url)
  //         if(number < 1 || number > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         if(urlName == '' || !ValidURL(urlName)) return message.channel.send('please add valid url')
  //         config.links[number - 1].url = urlName
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${config.links[number - 1].name} now points to ${config.links[number - 1].url}`)
  //       break;
  //       case 'swap':
  //         if(url === undefined) return message.channel.send(`Please add 2 link numbers between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         let num1 = parseInt(url)
  //         let num2 = parseInt(urlName)
  //         if(num1 < 1 || num1 > config.links.length || num2 < 1 || num2 > config.links.length) return message.channel.send(`Please add link number between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         swapArrayElements(config.links, num1 - 1, num2 - 1)
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${config.links[num2 -1].name} and ${config.links[num1 -1].name} have now switched places`)
  //       break;
  //       case 'move':
  //         if(url === undefined) return message.channel.send(`Please add 2 link numbers between 1 - ${config.links.length > 25 ? `25` : `${config.links.length}`}`)
  //         let number1 = parseInt(url)
  //         let number2 = parseInt(urlName)          
  //         let tempLink = config.links[number1 -1]
  //         config.links.splice(number1 - 1, 1)
  //         config.links.splice(number2 -1 , 0, tempLink)
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${config.links[number2 -1].name} is now link number ${number2}`)
  //       break;
  //     }   

  //   break;
  //   case 'a':
  //   case 'admin':
  //     if(!isAdmin(message,message.member.id)) return message.channel.send('You are not a mod.');
  //     let [adminArg, user] = args;
  //     let toAdmin = message.mentions.users.first() || message.guild.members.get(user)
  //     if(adminArg === undefined) return;
  //     switch(adminArg){
  //       case 'add':
  //         if(!toAdmin) return message.channel.send("You did not not specify a user.")    
  //         if(isAdmin(message,toAdmin.id || toAdmin.user.id)) return message.channel.send("User is already Admin.")
  //         config.server[message.guild.id].admin.push((toAdmin.id || toAdmin.user.id))
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${(toAdmin.username || toAdmin.user.username)} can now use bot admin commands.`)
  //       break;
  //       case 'remove':
  //         if(!toAdmin) return message.channel.send("You did not not specify a user.")
  //         if(!isAdmin(message,toAdmin.id || toAdmin.user.id)) return message.channel.send("User is not an Admin.")
  //         if((toAdmin.id || toAdmin.user.id) === message.guild.ownerID) return message.channel.send("You cannot remove the owner")
  //         let index = config.server[message.guild.id].admin.indexOf(toAdmin.id || toAdmin.user.id)
  //         config.server[message.guild.id].admin.splice(index, 1)
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         return message.channel.send(`${(toAdmin.username || toAdmin.user.username)} can no longer use bot admin commands.`)
  //       break;
  //       case 'toggle':
  //         let channelName = message.channel.id;
  //         let roomNumber = config.server[message.guild.id].rooms.indexOf(channelName);
  //         if(roomNumber === -1) {
  //           message.channel.send(`I am now monitoring ${message.channel.name}`)
  //           config.server[message.guild.id].rooms.push(channelName)
  //         }
  //         else {
  //           message.channel.send(`I am no longer keeping track of ${message.channel.name}`)
  //           let index = config.server[message.guild.id].rooms.indexOf(channelName)
  //           config.server[message.guild.id].rooms.splice(index, 1)
  //         }
  //         writeToFile(config, `${__dirname}/data/config.json`)
  //         break;
  //       break;
  //     }

  //   break;
  // }
});

// function getCharacter(prompt) {
//   for (var character in characterList){
//     let found = characterList[character].nickname.indexOf(prompt)
//     if(found > -1){
//       return characterList[character]
//     }
//   }
//   return undefined
// }

// function getCharactersByType(type){
//   let characters = ''
//   for (let character in characterList){
//     if(characterList[character].type == type && characterList[character].class !== "Boss"){
//       characters = characters.concat(character + ', ')
//     }
//   }
//   return characters.substring(0, characters.length - 2)
// }

// function embedCharacter(character){
//   const embed = new Discord.RichEmbed()
//     .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
//   if(character.type !== undefined) embed.setColor(typeList[character.type.toLowerCase()].color)
//   if(character.title !== undefined) embed.setTitle(character.title)
//   if(character.aliases !== undefined) embed.setDescription(`**Aliases**: ${character.aliases}\n`)
//   if(character.thumbnail !== undefined) embed.setThumbnail(`${character.thumbnail}`)
//   if(character.type !== undefined && character.class !== undefined) embed.addField(`Type`, `${character.type} ${character.class}\n`)
//   if(character.location !== undefined) embed.addField(`Hero Shard Location`, `${character.location}\n\n`)
//   if(character.basicName !== undefined) embed.addField(`${character.basicName}`, `${character.basicDesc}\n`)
//   if(character.specialName !== undefined) embed.addField(`${character.specialName}`, `${character.specialDesc}\n`)
//   if(character.ultimate1Name !== undefined) embed.addField(`${character.ultimate1Name}`, `${character.ultimate1Desc}\n`)
//   if(character.passiveName !== undefined) embed.addField(`${character.passiveName}`, `${character.passiveDesc}\n`)
//   if(character.ultimate2Name !== undefined) embed.addField(`${character.ultimate2Name}`, `${character.ultimate2Desc}\n`)
//   return(embed)
// }

// function embedType(type){
//   let characters = getCharactersByType(type.title)
//   const embed = new Discord.RichEmbed()
//     .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
//     .setColor(type.color)
//     .setTitle(type.title)
//     .setDescription(`${type.description}`)
//     .setThumbnail(`${type.image}`)
//     .addField(`Characters`, `${characters}`)
//   return(embed)
// }

// function embedLinks(){
//   const embed = new Discord.RichEmbed()
//     .setTitle('Important Links')
//   if(config.links.length > 0){
//     for (let i = 0; i < config.links.length && i < 25; i++) {
//       embed.addField(`${i+1}. ${config.links[i].name}`, config.links[i].url) 
//     }
//   }
//   else {
//     embed.setDescription(`There are no links`)
//   }
//   return embed
// }

// function embedGacha(type){
//   const embed = new Discord.RichEmbed()
//     .setAuthor('S.H.I.E.L.D. intel','https://i.imgur.com/JLIGMuA.png')
//     .setColor(type.color)
//     .setThumbnail(type.image)
//     .setTitle(`These are the minimum percentage odds for prizes in the current ${type.category} Time Capsules`)

//   if(type.heroes.length > 0) {
//     let shardText = 'You can earn shards for the following characters in different amounts shown below:'
//     embed.addField(shardText,type.heroes.join(', '))  
//   }
//   if(Object.keys(type.prizes).length !== 0 && type.prizes.constructor === Object){
//     let dropRate = Object.keys(type.prizes)
//     for (let i = 0; i < dropRate.length && i < 24; i++) {
//       embed.addField(dropRate[i], type.prizes[dropRate[i]]) 
//     }
//   }
//   return embed
// }

// function isAdmin(message, ID) { 
//   return (config.server[message.guild.id].admin.indexOf(ID) > -1)
// }

// function writeToFile(element, location){
//   let json = JSON.stringify(element,null, 2)
//   fs.writeFile(location, json, 'utf8', (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//   });
// }

// function inAllowedChannel(message){
//   return (config.server[message.guild.id].rooms.length === 0 || config.server[message.guild.id].rooms.indexOf(message.channel.id) !== -1)
// }

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

// function isAllowed(message){
//   if (inAllowedChannel(message) || (isAdmin(message,message.member.id))) return true;
//   return false;
// }

// function ValidURL(str) {
//   // var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//   // '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
//   // '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//   // '(\\:\\d+)?'+ // port
//   // '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
//   // '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
//   // '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//   // return pattern.test(str);
//   return true;
// }

// var swapArrayElements = function(arr, indexA, indexB) {
//   var temp = arr[indexA]
//   arr[indexA] = arr[indexB]
//   arr[indexB] = temp
// };

// // Log our bot in
bot.login(token)