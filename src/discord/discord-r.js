const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir('./src/discord/commands', (err, files) => {
  if (err) return console.error(err);

  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    console.log(file);
    let props = require(`./commands/${file}`);

    console.log(`Загрузка команды ${file}`);
    client.commands.set(props.help.name, props);
  });
});

function initDiscordR() {
  console.log('DISCORD-R:: Module running');
  client.login(process.env.DISCORD_R_TOKEN);
}

function streamNotify(data) {
  const guild = client.guilds.get(process.env.DISCORD_GUILD_ID);
  const channel = guild.channels.find('name', 'test-bot');
  const notifyEmbed = new Discord.RichEmbed()
    .setDescription(data.title)
    .setImage(data.image)
    .setColor('#4286f4')
    .addField('Играет в', data.game, true)
    .addField('Зрителей', data.viewerCount, true);
  channel.send(`${guild.defaultRole} **${data.userName}** запустил стрим!`, notifyEmbed);
}

client.on('ready', () => {
  console.log(`DISCORD-R:: Logged in as ${client.user.tag}!`);
  client.user.setActivity('StreamHelper', {
    type: 'PLAYING',
  });
});

client.on('message', async (message) => {
  console.log(message.content);
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  const prefix = process.env.DISCORD_PREFIX;
  const messageArray = message.content.split(' ');
  const cmd = messageArray[0];
  const args = messageArray.slice(1);

  const commandFile = client.commands.get(cmd.slice(prefix.length));
  if (commandFile) commandFile.run(client, message, args);

  // if (cmd === `${prefix}kick`) {
  //   const kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  //   if (!kUser) message.channel.send('Не могу найти пользователя!');
  //   const kReason = args.join(' ').slice(22);
  //   if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('У вас нет прав.');
  //   if (kUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Этот пользователь не может быть кикнут!');

  //   const kickEmbed = new Discord.RichEmbed()
  //     .setDescription('Kick')
  //     .setColor('#e56b00')
  //     .addField('Kicked User', `${kUser} with ID ${kUser.id}`)
  //     .addField('Kicked By', `<@${message.author.id}> with ID ${message.author.id}`)
  //     .addField('Kicked In', message.channel)
  //     .addField('Time', message.createdAt)
  //     .addField('Reason', kReason);

  //   const kickChannel = message.guild.channels.find('name', 'admin');
  //   if (!kickChannel) return message.channel.send('Не могу найти test-bot канал.');

  //   message.guild.member(kUser).kick(kReason);
  //   kickChannel.send(kickEmbed);

  //   return;
  // }

  // if (cmd === `${prefix}ban`) {
  //   const bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  //   if (!bUser) message.channel.send('Не могу найти пользователя!');
  //   const bReason = args.join(' ').slice(22);
  //   if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('У вас нет прав.');
  //   if (bUser.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Этот пользователь не может быть забанен!');

  //   const banEmbed = new Discord.RichEmbed()
  //     .setDescription('Ban')
  //     .setColor('#bc0000')
  //     .addField('Banned User', `${bUser} with ID ${bUser.id}`)
  //     .addField('Banned By', `<@${message.author.id}> with ID ${message.author.id}`)
  //     .addField('Banned In', message.channel)
  //     .addField('Time', message.createdAt)
  //     .addField('Reason', bReason);

  //   const banChannel = message.guild.channels.find('name', 'admin');
  //   if (!banChannel) return message.channel.send('Не могу найти test-bot канал.');

  //   message.guild.member(bUser).ban(bReason);
  //   banChannel.send(banEmbed);

  //   return;
  // }
  // if (cmd === `${prefix}report`) {
  //   const rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  //   if (!rUser) return message.channel.send('Couldnt find user.');
  //   const reason = args.join(' ').slice(22);

  //   const reportEmbed = new Discord.RichEmbed()
  //     .setDescription('Reports')
  //     .setColor('#15f153')
  //     .addField('Reported User', `${rUser} with ID: ${rUser.id}`)
  //     .addField('Reported By', `${message.author} with ID: ${message.author.id}`)
  //     .addField('channel', message.channel)
  //     .addField('Time', message.createdAt)
  //     .addField('Reason', reason);

  //   const reportschannel = message.guild.channels.find('name', 'admin');
  //   if (!reportschannel) return message.channel.send('Couldnt find reports channel.');

  //   message.delete().catch((O_o) => {});
  //   reportschannel.send(reportEmbed);
  //   return;
  // }

  // if (cmd === `${prefix}serverinfo`) {
  //   const sicon = message.guild.iconURL;
  //   const serverembed = new Discord.RichEmbed()
  //     .setDescription('Server Information')
  //     .setColor('#15f153')
  //     .setThumbnail(sicon)
  //     .addField('Server Name', message.guild.name)
  //     .addField('Created On', message.guild.createdAt)
  //     .addField('You Joined', message.member.joinedAt)
  //     .addField('Total Membes', message.guild.memberCount);

  //   return message.channel.send(serverembed);
  // }

  // if (cmd === `${prefix}botinfo`) {
  //   const bicon = client.user.displayAvatarURL;
  //   const botembed = new Discord.RichEmbed()
  //     .setDescription('Bot Information')
  //     .setColor('#15f153')
  //     .setThumbnail(bicon)
  //     .addField('Bot Name', client.user.username)
  //     .addField('Created On', client.user.createdAt);

  //   return message.channel.send(botembed);
  // }
});

module.exports = {
  initDiscordR,
  streamNotify,
};
