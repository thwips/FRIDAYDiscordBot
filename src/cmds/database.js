const gf = require('../globalfunctions.js'),
      typeList = require('../data/types.json'),
      fs = require('fs')
let   characterList = require('../data/characters.json'),
      gachaList = require('../data/gacha.json'),
      config = require('../config/config.json')

const characterFields = ["title", "aliases", "nickname", "thumbnail", "type", "class", "location", "basicName", 
                         "basicDesc", "specialName", "specialDesc", "ultimate1Name", "ultimate1Desc", "passiveName",
                         "passiveDesc", "ultimate2Name", "ultimate2Desc"]


module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;
  if(!gf.isAdmin(message.guild.id,message.member.id)) return;
  if(args.length === 0) return;

  args = args.join(' ').split(' --')
  const command = args.shift().toLowerCase()
  console.log(args)
  
  if(command === 'help'){
    message.channel.send('Help Text')
  }
  else if(command === 'edit'){
    if(args.length !== 4);
    return Edit(message, args)
  }
  else if(command === 'add'){
    if(args.length !== 2) return Add(message,args);
    return Add(message, args)

  }
  else if(command === 'remove'){
    if(args.length !== 2) return;
    return Remove(message, args)
  }
  else if(command === 'get'){
    let charSearch = args[0].toLowerCase()
    if(charSearch === '') return;

    let character = getCharacter(charSearch.split(' ').join('').toLowerCase())
    message.channel.send(`Use --${character} to retrieve ${args[0]}`)
  }
}

module.exports.help = {
  name: "database",
  aliases: [
    "database",
    "db" 
  ],
  ignore: [
  ]
}

function getCharacter(prompt) {
  if(prompt === undefined) return undefined
  for (var character in characterList){
    let found = characterList[character].nickname.indexOf(prompt)
    if(found > -1){
      return character
    }
  }
  return undefined
}

function Edit(message, args){
  const editType = args.shift().toLowerCase()
  if(editType === 'gacha' || editType === 'g') return editGacha(message, args)
  else if (editType === 'character' || editType === 'char' || editType === 'c') editCharacter(message, args)  
}

function editCharacter(message, args){
    const character = args.shift().toLowerCase()
    if(characterList[character] === undefined) return message.channel.send('Character not in the database')
    let characterField = args.shift().toLowerCase()
    const charFieldIndex = characterFields.findIndex(field => characterField.toLowerCase() === field.toLowerCase())
    if(charFieldIndex >  -1){
      characterField = characterFields[charFieldIndex]
    }
    else if(characterField !== 'addnickname' && characterField !== 'removenickname') {
      return message.channel.send('Not a valid character field')
    }
    const description = args.shift()

    if(characterField === 'addnickname'){
      const nick = description.split(' ').join('').toLowerCase()
      let nicknameCheck = gf.getCharacter(nick)
      if(nicknameCheck !== undefined) return message.channel.send(`${nicknameCheck.title} already has the nickname ${description}`)
      characterList[character].nickname.push(nick)
      message.channel.send(`You can now retrieve ${character} with ${nick}`)
    }
    else if(characterField === 'removenickname'){
      const nick = description.split(' ').join('').toLowerCase()
      const nickIndex = characterList[character].nickname.indexOf(nick)
      if(nickIndex === -1) return message.channel.send(`${character} does not have a nickname of '${description}'`)
      characterList[character].nickname.splice(nickIndex, 1)
      message.channel.send(`You can no longer retrieve ${character} with ${nick}`)
    }
    else{
      characterList[character][characterField] = description
    }

    gf.writeToFile(characterList, `./data/characters.json`)
    const embed = gf.embedCharacter(characterList[character])
    return message.channel.send({embed})  
}

function editGacha(message, args){
    return;  
}

function Add(message, args){
  const addType = args.shift().toLowerCase()
  if(addType === 'gacha' || addType === 'g') return addGacha(message, args)
  else if (addType === 'character' || addType === 'char' || addType === 'c') addCharacter(message, args)  
}

function addCharacter(message, args){
    const character = args.shift().toLowerCase()
    if (characterList[character] !== undefined && gf.getCharacter(character.split(' ').join('').toLowerCase()) === undefined) return message.channel.send(`${character} already exists`)
    characterList[character] = createCharacter(character)
    gf.writeToFile(characterList, `./data/characters.json`)
    const embed = gf.embedCharacter(characterList[character])
    return message.channel.send({embed})  
}

function addGacha(message, args){
  return;
}

function Remove(message, args){
  const removeType = args.shift().toLowerCase()
  if(removeType === 'gacha' || removeType === 'g') return removeGacha(message, args)
  else if (removeType === 'character' || removeType === 'char' || removeType === 'c') removeCharacter(message, args)  
}

function removeCharacter(message, args){
    let character = args.shift().toLowerCase()
    if (characterList[character] === undefined) character = gf.getCharacter(character.split(' ').join('').toLowerCase())
    if (character === undefined) return message.channel.send(`${character} doesn't exist`)
    delete characterList[character]
    gf.writeToFile(characterList, `./data/characters.json`)
    return message.channel.send(`${character} is no longer in the database`)
}

function removeGacha(message, args){
  return;
}

function createCharacter(name){
  let character = {
    "title": "",
    "aliases": "",
    "nickname": [
      name.split(' ').join('')
    ],
    "thumbnail": "https://i.imgur.com/sLUUa52.png",
    "type": "",
    "class": "",
    "location": "",
    "basicName": "",
    "basicDesc": "",
    "specialName": "",
    "specialDesc": "",
    "ultimate1Name": "",
    "ultimate1Desc": "",
    "passiveName": "",
    "passiveDesc": "",
    "ultimate2Name": "",
    "ultimate2Desc": ""
  }
  return character
}