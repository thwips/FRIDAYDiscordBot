const gf = require('../globalfunctions.js'),
      fs = require('fs')

let colorRoles = ['Guardians 3000', 'Discord Defenders', 'Thunderbolts Founder', 'Discord Avengers', 'Howling Commandos', 'Pet Avengers', 'Poole Boys', 'Pym Technologies', 'Inhumans', 'S.W.O.R.D.', 'A-Force', 'Secret Warriors'];

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;

  message.guild.roles.fetch()
    .then(serverRoles => {
      serverRoles = serverRoles.cache.filter(role => colorRoles.includes(role.name));
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

      let roles = serverRoles.filter(role =>
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
        message.member.roles.remove(serverRoles)
          .then(async () =>
          {
            await message.member.roles.add(role)
            message.channel.send(`You now have the color ${role}!`);
          })
      }
      catch (e)
      {
        message.channel.send(`Operation failed! ${e.message}`);
      }
    })
    .catch(console.error);
}

module.exports.help = {
  name: "color",
  aliases: [
    "color",
    "c"
  ],
  ignore: [
  "429222755745923073"
  ]
}
