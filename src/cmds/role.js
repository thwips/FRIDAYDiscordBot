const gf = require('../globalfunctions.js'),
      fs = require('fs')

let gameRoles = ['FE:H', 'MFF', 'ACPC', 'PROM', 'APEX'];

module.exports.run = async (bot, message, args) => {
  if(!gf.isAllowed(message, module.exports.help.ignore)) return;



  message.guild.roles.fetch()
    .then(async serverRoles => {
      serverRoles = serverRoles.cache.filter(role => gameRoles.includes(role.name));
      if (serverRoles.size < 1)
      {
        return;
      }

      let str = args.join(' ').trim();
      if (args.join('') == 'show')
      {
        message.channel.send('Role options: ' + expandRoles(serverRoles));
        return;
      }

      let roles = serverRoles.filter(role =>
      {
        return role.name.toLowerCase().startsWith(str.toLowerCase());
      });

      if (roles.size > 1)
      {
        message.channel.send('Inputted role not specific enough. Not assign role.\nRoles found: ' + expandRoles(roles));
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
        let add = message.member.roles.cache.has(role.id);

        if (add)
        {
          message.member.roles.remove(role)
            .then(message.channel.send(`You no longer have the role ${role.name}!`))
        }
        else
        {
          message.member.roles.add(role)
           .then(message.channel.send(`You now have the role ${role.name}!`))
        }
      }
      catch (e)
      {
        message.channel.send(`Operation failed! ${e.message}`);
      }
    })
    .catch(console.error);
}

function expandRoles(serverRoles) {
  let roles = [];
  serverRoles.array().forEach(role => {
    roles.push(role.name);
  })
  return roles.join(', ')
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

