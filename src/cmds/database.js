const gf = require('../globalfunctions.js'),
      typeList = require('../data/types.json'),
      fs = require('fs')
let   characterList = require('../data/characters.json'),
      gachaList = require('../data/gacha.json'),
      config = require('../config/config.json')

const characterFields = ["title", "aliases", "skin", "thumbnail", "type", "class", "location", "basicName", 
                         "basicDesc", "specialName", "specialDesc", "ultimate1Name", "ultimate1Desc", "passiveName",
                         "passiveDesc", "ultimate2Name", "ultimate2Desc"]

const gachaFields = ["time","color","image"]

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
    return Edit(message, args)
  }
  else if(command === 'add'){
    return Add(message, args)

  }
  else if(command === 'remove'){
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
    else if(characterField !== 'addnickname' && characterField !== 'removenickname' && characterField !== 'addskin' && characterField !== 'removeskin') {
      return message.channel.send('Not a valid character field')
    }
    if(characterField === 'addnickname'){
      const description = args.shift()
      const nick = description.split(' ').join('').toLowerCase()
      let nicknameCheck = gf.getCharacter(nick)
      if(nicknameCheck !== undefined) return message.channel.send(`${nicknameCheck.title} already has the nickname ${description}`)
      characterList[character].nickname.push(nick)
      message.channel.send(`You can now retrieve ${character} with ${nick}`)
    }
    else if(characterField === 'removenickname'){
      const description = args.shift()
      const nick = description.split(' ').join('').toLowerCase()
      const nickIndex = characterList[character].nickname.indexOf(nick)
      if(nickIndex === -1) return message.channel.send(`${character} does not have a nickname of '${description}'`)
      characterList[character].nickname.splice(nickIndex, 1)
      message.channel.send(`You can no longer retrieve ${character} with ${nick}`)
    }
    else if(characterField === 'addskin'){
      const skinName = args.shift()
      if(characterList[character].skins !== undefined && characterList[character].skins[skinName] !== undefined) return message.channel.send(`${character} already has the skin "${skinName}"`)
      skinText = args.shift()
      characterList[character].skins[skinName] = skinText
      message.channel.send(`${character} now has a skin "${skinName}"`)
    }
    else if(characterField === 'removeskin'){
      const skinName = args.shift()
      if(characterList[character].skins[skinName] === undefined) return message.channel.send(`${character} doesn't have the skin "${skinName}"`)
      delete characterList[character].skins[skinName]
      message.channel.send(`${character} no longer has the skin ${skinName}`)
    }
    else{
      const description = args.shift()
      characterList[character][characterField] = description
    }

    gf.writeToFile(characterList, `./data/characters.json`)
    const embed = gf.embedCharacter(characterList[character])
    return message.channel.send({embed})  
}

function editGacha(message, args){
  const capsule = args.shift().toLowerCase()
  if(gachaList[capsule] === undefined) return message.channel.send(`${capsule} capsule not in the database`)
  let gachaField = args.shift().toLowerCase()
  const gachaFieldIndex = gachaFields.findIndex(field => gachaField.toLowerCase() === field.toLowerCase())
  if(gachaFieldIndex >  -1){
    gachaField = gachaFields[charFieldIndex]
  }
  else if(gachaField !== 'addprize' && gachaField !== 'removeprize' && gachaField !== 'editprize' && gachaField !== 'editheroes') {
    return message.channel.send('Not a valid gacha field')
  }
  if(characterField === 'addprize'){
    const droprate = parseFloat(args.shift())
    if(gachaList[capsule].prize[droprate] !== undefined) return message.channel.send(`${capsule} already has the drop rate ${droprate}%`)
    const drops = {droprate : args.join(' ')}
    gachaList[capsule].prizes.push(drops)
    message.channel.send(`${capsule} now has:\n\`${drops}\`\nwith a drop rate of ${droprate}%`)
  }
  else if(characterField === 'removeprize'){
    const droprate = args.shift()
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
  const type = args.shift().toLowerCase()
  if(gachaList[type] !== undefined) return message.channel.send(`${type} already exists in Gacha List`)
  gachaList[type] = createGacha(type)
  gf.writeToFile(gachaList, `./data/gacha.json`)
  const embed = gf.embedGacha(gachaList[type])
  return message.channel.send({embed})  
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
    let type = args.shift().toLowerCase()
    if (gachaList[type] === undefined) return message.channel.send(`${type} capsule  doesn't exist`)
    delete gachaList[type]
    gf.writeToFile(gachaList, `./data/gacha.json`)
    return message.channel.send(`${type} is no longer in the database`)
}

function createCharacter(name){
  let character = {
    "title": "",
    "aliases": "",
    "nickname": [
      name.split(' ').join('')
    ],
    "thumbnail": "https://i.imgur.com/sLUUa52.png",
    "skins": {},
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

function createGacha(name){
  let gacha = {
    "category" : name,
    "time" : "",
    "color" : "0x000000",
    "image" : "https://i.imgur.com/xPA7gZm.png",
    "heroes" : [],
    "prizes" : {
    }
  }
  return gacha
}

droprate.sort()