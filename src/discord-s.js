const Discord = require('discord.js');
const db = require('./db');

const client = new Discord.Client();

function initDiscordS() {
  console.log('DISCORD-S:: Module running');
  client.login(process.env.DISCORD_S_TOKEN);
}

function usersCheckConnection() {
  const guild = client.guilds.get(process.env.DISCORD_GUILD_ID);

  guild.members.forEach((member) => {
    if (!member.user.bot && member.user.id !== '388821548573786113') {
      member.user.fetchProfile()
        .then((p) => {
          if (p.connections) {
            p.connections.forEach((connection) => {
              if (connection.type === 'twitch') {
                db.getUserByTID(connection.id).then((data) => {
                  if (data && data.d_id === null) {
                    db.updateUserD(data.id, connection.user.id);
                  }
                });
              }
            });
          }
        })
        .catch(console.error);
    }
  });
}

client.on('ready', () => {
  console.log(`DISCORD-S:: Logged in as ${client.user.tag}!`);
  client.user.setActivity('StreamHelper by awbait', {
    url: 'https://twitch.tv/awbait',
    type: 'STREAMING',
  });

  setInterval(() => {
    usersCheckConnection();
    console.log('DISCORD-S:: Проверка интеграций пользователей завершена.');
  }, 120000);
});

client.on('error', console.error);

module.exports = initDiscordS;
