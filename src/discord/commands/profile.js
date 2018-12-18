const Discord = require('discord.js');
const db = require('../../db');

module.exports.run = async (bot, message, args) => {
  let user;
  await db.getUserByDID(message.author.id).then((data) => {
    if (data) {
      user = data;
    } else {
      console.log('Пользователь не найден');
    }
  });
  const profileEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setColor('#ff9933')
    .addField('Твич', `${user.t_name}`, true)
    .addField('Поинты', `${user.amount}`, true);
  
  message.channel.send(profileEmbed);
};

module.exports.help = {
  name: 'profile',
};
