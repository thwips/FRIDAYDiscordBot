const gf = require('../globalfunctions.js'),
      gacha = require('../data/simulator.json'),
      typeList = require('../data/types.json'),
      fs = require('fs')

const max = 1000

module.exports.run = async (bot,message,args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let category = args[0]
  let cat = Object.keys(gacha)
  if(category === undefined){
    return message.channel.send(`These are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
  }
  if(cat.indexOf(category) > -1) {
    let amount = parseInt(args[1])
    if(!isNaN(amount)){
      let check = ''
      if(args[2] !== undefined){
        if (!isNaN(Number(args[2]))) check = args.slice(3).join(' ')
        else check = args.slice(2).join(' ')
      }
      if(amount < 0 || amount > max) return message.channel.send(`Please enter a number between 1-${max}`)
      let prizes = {}
      for(let i = 0; i < amount;i++){
        let prize = getPrize(gacha[category])
        let amount = 0
        if(isNaN(Number(prize[0]))) amount = 1
        else amount = Number(prize.shift())
        prize = prize.join(' ')
        if(args[2] === undefined || check.toLowerCase() == prize.toLowerCase()){
          if(prize.substr(prize.length - 1) !== 's'){
            prize += 's'
          }
          if (prize in prizes) prizes[prize] += amount
          else prizes[prize] = amount
        }
      }
      const ordered = {};
      Object.keys(prizes).sort().forEach(function(key) {
        ordered[key] = prizes[key]
      })
      prizes = ordered
      let string = ''
      for(key in prizes){
        string += `${prizes[key]} ${key}, `
      }
      return message.channel.send(`Here are the total drops:\n${string}`)
    }
    else{
      let prize = getPrize(gacha[category])
      let amount = prize.shift() 
      let descriptor = prize.pop()
      prize = prize.join(' ')
      let character = gf.getCharacter(prize)
      return message.channel.send(`You got: ${amount} ${prize} ${descriptor}`)    
    }
    // if(character !== undefined){ 
    // }
    // else{      
    // }
    // const embed = gf.embedGacha(gacha[category])
    // return message.channel.send({embed})      
  }
  return message.channel.send(`Invalid Category\nThese are all the current Time Capsule categories:\n\`${cat.join(', ')}\``)
}

module.exports.help = {
  name: "simulation",
  aliases: [
    "simulation",
    "simulator",
    "sim",
    "s"
  ],
  ignore : [
    "416432474193657867" //arena-of-war
  ]
}
  
function weightedRand(probs,sizes) {    //selects tier (3,5,8,10,30) by weighted probability
  var i, sum = 0, r = Math.random();
  for (i in probs) {
    sum += (probs[i])/100 * sizes[i]
    if (r <= sum) {
      return probs[i]
    }
  }
  return probs[probs.length - 1]
}

function uniformRand (array){   //selects random hero from tier with equal probability
  return array[Math.floor(Math.random() * array.length)];
}

function getPrize(capsule){
    let sizes = []
    for(i in capsule){
      sizes.push(capsule[i].length)
    }
    let dRate = Object.keys(capsule).map(Number)
    let prizePool = String(weightedRand(dRate,sizes))
    return uniformRand(capsule[prizePool]).split(' ')
}