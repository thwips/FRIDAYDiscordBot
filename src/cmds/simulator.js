const gf = require('../globalfunctions.js'),
      gacha = require('../data/simulator.json'),
      typeList = require('../data/types.json'),
      fs = require('fs')

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
      if(amount < 0 || amount > 1000) return message.channel.send('Please enter a number between 1-1000')
      let prizes = {}
      for(let i = 0; i < amount;i++){
        let prize = getPrize(gacha[category])
        let amount = 0
        if(isNaN(Number(prize[0]))) amount = 1
        else amount = Number(prize.shift())
        prize = prize.join(' ')
        if(prize.substr(prize.length - 1) !== 's'){
          prize += 's'
        }
        if (prize in prizes) prizes[prize] += amount
        else prizes[prize] = amount
      }
      const ordered = {};
      Object.keys(prizes).sort().forEach(function(key) {
        ordered[key] = prizes[key]
      })
      prizes = ordered
      string = ''
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

// var heroes = ["Black Panther", "Black Widow", "Bucky Barnes", "Captain America", "Enchantress", "Falcon", "Hawkeye", "Hulk", "Iron Man", "J.O.C.A.S.T.A", "Loki", "Mockingbird", "Maria Hill", "Ms. Marvel", "Phil Coulson", "Quake", "Red Hulk", "Spider-Woman", "Thor", "Tigra", "Valkyrie", "Vision", "War Machine", "Wasp", "Wiccan", "Winter Soldier","Rick Jones","Skaar"]
// var nums = {3:26,5:26,8:26,10:26,30:28};  //number of heroes in each tier; used for odds
// var probs = [0.35,0.25,0.2,0.15,0.05];

// var Tier = function(value, heroes) {  //handle each tier 3/5/8/10/30 as separate object
//   this.value = value;
//   this.heroes = heroes;
//   }

// function generateTiers(nums) {
//   var i, tiers = [];
//   for (i in nums) {
//     Logger.log(i);
//     tiers.push(new Tier(i,nums[i]));
//   }
//   return tiers;
// }
  
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