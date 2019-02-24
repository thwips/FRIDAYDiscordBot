const gf = require('../globalfunctions.js'),
      fs = require('fs')

let gameRoles = ['FE:H', 'MFF', 'ACPC'];

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  let serverRoles = message.guild.roles.filter(role => colorRoles.includes(role.name));
  if (serverRoles.size < 1)
  {
    return;
  }

  let str = args.join(' ').trim();
  if (args.join('') == 'show')
  {
    message.channel.send('Role options: ' + serverRoles.array().join(', '));
    return;
  }

  let roles = gameRoles.filter(role =>
  {
    return role.name.toLowerCase().startsWith(str.toLowerCase());
  });

  if (roles.size > 1)
  {
    message.channel.send('Inputted role not specific enough. Not assign role.\nRoles found: ' + roles.array().join(', '));
    return;
  }
  else if (roles.size == 0)
  {
    message.channel.send('Cannot find role starting with ' + str)
    return;
  }
  let role = roles.first();

  try
  {
    let add = message.member.roles.has(role);

    if (add)
    {
      await message.member.removeRole(role);
      message.channel.send(`You no longer have the role ${role}!`);
    }
    else
    {
      await message.member.addRole(role);
      message.channel.send(`You now have the role ${role}!`);
    }
  }
  catch (e)
  {
    message.channel.send(`Operation failed! ${e.message}`);
  }
}

module.exports.help = {
  name: "role",
  aliases: [
    "role",
    "r"
  ],
  ignore: [
  "429222755745923073"
  ]
}