const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  const rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!rUser) return message.channel.send('Couldnt find user.');
  const reason = args.join(' ').slice(22);

  const reportEmbed = new Discord.RichEmbed()
    .setDescription('Reports')
    .setColor('#15f153')
    .addField('Reported User', `${rUser} with ID: ${rUser.id}`)
    .addField('Reported By', `${message.author} with ID: ${message.author.id}`)
    .addField('channel', message.channel)
    .addField('Time', message.createdAt)
    .addField('Reason', reason);

  const reportschannel = message.guild.channels.find(x => x.name === 'admin');
  if (!reportschannel) return message.channel.send('Couldnt find reports channel.');

  message.delete().catch((O_o) => {});
  reportschannel.send(reportEmbed);
  return undefined;
};

module.exports.help = {
  name: 'report',
};
