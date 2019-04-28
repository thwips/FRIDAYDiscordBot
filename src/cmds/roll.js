const gf = require('../globalfunctions.js'),
      fs = require('fs')

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let string = args.join('').toLowerCase();
  let diceArgs = string.split('d');
  if (diceArgs.length != 2)
  {
    message.channel.send('Not a valid argument. Needs to be in format: #d#');
    return;
  }
  let diceAmount = parseInt(diceArgs[0]);
  let diceSize = parseInt(diceArgs[1]);
  if (isNaN(diceAmount) || Number.isInteger(diceAmount) == false || isNaN(diceSize) || Number.isInteger(diceSize) == false)
  {
    message.channel.send('Not a valid argument. Needs to be in format: #d#');
    return;
  }
  if (diceAmount > 10)
  {
    message.channel.send('I only have 10 dice :(');
    return;
  }
  else if(diceAmount < 1)
  {
    message.channel.send('You need positive dice amounts')
    return;
  }
  if (diceSize < 2)
  {
    message.channel.send('Needs to have 2 or more faces');
    return;
  }
  else if (diceSize > 20)
  {
    message.channel.send('Dice too big');
    return;
  }
  let diceRolls = [];
  let total = 0;
  for (let i = 0; i < diceAmount; i++)
  {
    roll = Math.floor(Math.random() * diceSize) + 1;
    total += roll;
    diceRolls.push(roll);
  }
  if (diceAmount == 1)
  {  
    message.channel.sent('Rolled a ' + total);
  }
  else
  {
    message.channel.send('Total: ' + total);
    message.channel.send('Each roll was ' + diceRolls.join(', '));
  }

}

module.exports.help = {
  name: "roll",
  aliases: [
    "roll"
  ],
  ignore: [
  "429222755745923073"
  ]
}