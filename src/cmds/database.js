const gf = require('../globalfunctions.js'),
      typeList = require('../data/types.json'),
      fs = require('fs')
let   characterList = require('../data/characters.json'),
      gachaList = require('../data/gacha.json'),
      config = require('../config/config.json')

const characterFields = ["title", "aliases", "thumbnail", "type", "class", "location", "basicName", 
                         "basicDesc", "specialName", "specialDesc", "ultimate1Name", "ultimate1Desc", "passiveName",
                         "passiveDesc", "ultimate2Name", "ultimate2Desc"]


module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;
  if(!gf.isAdmin(message.guild.id,message.member.id)) return;
  if(args.length === 0) return;

  args = args.join(' ').split(' --')
  const command = args.shift().toLowerCase()
  
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
    return message.channel.send(`Use --${character} to retrieve ${args[0]}`)
  }
  else {
    return message.channel.send(`No command inputted or don't use -- for your first arg`)
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

function Edit(message, args){
  const editType = args.shift().toLowerCase()
  if(editType === 'gacha' || editType === 'g') {
    return editGacha(message, args)
  }
  else if (editType === 'character' || editType === 'char' || editType === 'c') {
    return editCharacter(message, args)  
  }
  else {
    return message.channel.send('Incorrect edit type')
  }
}

function editCharacter(message, args){
  const character = args.shift().toLowerCase()
  if(character === null) return message.channel.send('must have --character name --character field --field 1 --field 2')
  if(characterList[character] === undefined) return message.channel.send('Character not in the database')
  let characterField = args.shift().toLowerCase()
  if(characterField === null){
    return message.channel.send('Not a valid character field. Valid fields are:\n"title", "aliases", "thumbnail", "type", "class", ' +
                                '"location", "basicName", "basicDesc", "specialName", "specialDesc", "ultimate1Name", "ultimate1Desc", ' +
                                '"passiveName", "passiveDesc", "ultimate2Name", "ultimate2Desc", "addnickname", "removenickname", "addskin" ' +
                                '"removeskin", "moveskin"')
  }
  const charFieldIndex = characterFields.findIndex(field => characterField.toLowerCase() === field.toLowerCase())

  if(charFieldIndex >  -1){
    characterField = characterFields[charFieldIndex]
  }
  else if(characterField !== 'addnickname' && characterField !== 'removenickname' && characterField !== 'addskin' && characterField !== 'removeskin' && characterField !== 'moveskin') {
    return message.channel.send('Not a valid character field. Valid fields are:\n"title", "aliases", "thumbnail", "type", "class", ' +
                                '"location", "basicName", "basicDesc", "specialName", "specialDesc", "ultimate1Name", "ultimate1Desc", ' +
                                '"passiveName", "passiveDesc", "ultimate2Name", "ultimate2Desc", "addnickname", "removenickname", "addskin" ' +
                                '"removeskin", "moveskin"')
  }
  if(characterField === 'addnickname'){
    const nickname = args.shift()
    if(nickname === null) return message.channel.send('No nickname inputted')
    const nick = nickname.split(' ').join('').toLowerCase()
    let nicknameCheck = gf.getCharacter(nick)

    if(nicknameCheck !== undefined) {
      return message.channel.send(`${nicknameCheck.title} already has the nickname ${nickname}`)
    }

    characterList[character].nickname.push(nick)
    message.channel.send(`You can now retrieve ${character} with ${nick}`)
    saveCharacter(message, null)
  }
  else if(characterField === 'removenickname'){
    const nickname = args.shift()
    if(nickname === null) return message.channel.send('No nickname inputted')
    const nick = nickname.split(' ').join('').toLowerCase()
    const nickIndex = characterList[character].nickname.indexOf(nick)
    
    if(nickIndex === -1) {
      return message.channel.send(`${character} does not have a nickname of '${nickname}'`)
    }
    
    characterList[character].nickname.splice(nickIndex, 1)
    message.channel.send(`You can no longer retrieve ${character} with ${nick}`)
    saveCharacter(message, null)
  }
  else if(characterField === 'addskin'){
    const skinName = args.shift()
    if(skinName === null) return message.channel.send('No skin name inputted')

    if(characterList[character].skins !== undefined && characterList[character].skins[skinName] !== undefined) {
      return message.channel.send(`${character} already has the skin "${skinName}"`)
    }

    const skinText = args.shift()
    if(skinName === null) return message.channel.send('No skin description inputted')
    characterList[character].skins[skinName] = skinText
    message.channel.send(`${character} now has a skin "${skinName}"`)
    saveCharacter(message, character)
  }
  else if(characterField === 'removeskin'){
    const skinName = args.shift()
    if(skinName === null) return message.channel.send('No skin name inputted')
    if(characterList[character].skins[skinName] === undefined) return message.channel.send(`${character} doesn't have the skin "${skinName}"`)
    delete characterList[character].skins[skinName]
    message.channel.send(`${character} no longer has the skin ${skinName}`)
    saveCharacter(message, null)
  }
  else if(characterField === 'moveskin')
  {
    const skin1 = args.shift()
    if(skin1 === null) return message.channel.send('no skins inputted')
    const skin2 = args.shift()  
    if(skin2 === null) return message.channel.send('second skin name not inputted')
    
    if(characterList[character].skins[skin1] === null) return message.channel.send(`${character} does not have skin: ${skin1}`)
    if(characterList[character].skins[skin2] === null) return message.channel.send(`${character} does not have skin: ${skin2}`)

    let skinNames = Object.keys(characterList[character].skins)
    let skinDesc = []
    skinNames.forEach(skin => {
      skinDesc.push(characterList[character].skins[skin])
    })
    let skin1Location = skinNames.findIndex(skin =>{
      return skin === skin1
    })
    let skin2Location = skinNames.findIndex(skin =>{
      return skin === skin2
    })
    console.log(skin1Location + ' ' + skin2Location)
    skinNames = array_move(skinNames, skin1Location, skin2Location)
    skinDesc = array_move(skinDesc, skin1Location, skin2Location)

    characterList[character].skins = {}
    for(let i = 0; i < skinNames.length; i++){
      characterList[character].skins[skinNames[i]] = skinDesc[i]
    }    
    saveCharacter(message, character)
  }
  else{
    const description = args.shift()
    if(description === null) return message.channel.send('No description inputted')
    characterList[character][characterField] = description
    saveCharacter(message, character)
  }
}

function saveCharacter(message, character){
  gf.writeToFile(characterList, `./data/characters.json`)
  if(character !== null) {
    const embed = gf.embedCharacter(characterList[character])
    return message.channel.send({embed})
  }
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined)
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
    return arr
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
  if (characterList[character] !== undefined && gf.getCharacter(character.split(' ').join('').toLowerCase()) === undefined) {
    return message.channel.send(`${character} already exists`)
  } 
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
    "skins": {},
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