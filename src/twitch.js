const tmi = require('tmi.js');
const db = require('./db');

const options = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_PASSWORD,
  },
  channels: [process.env.TWITCH_CHANNEL],
};
const client = new tmi.Client(options);

function initTwitch() {
  console.log('TWITCH:: Module running');
  client.connect();
}

client.on('connected', () => {
  client.action('awbait', 'Ваш помошник подключился!');
});

client.on('message', (channel, user, message, self) => {
  const prefix = '!';

  if (self) return;
  if (!message.startsWith(prefix)) return;

  const args = message.slice(prefix.length).trim().split(' ');

  switch (args[0].toLowerCase()) {
    case 'reg':
      db.getUserByTID(user['user-id']).then((data) => {
        if (data) {
          say(`${user['display-name']} вы уже зарегестрированы в системе.`);
        } else {
          console.log('Создать пользователя');
          db.createUserByTID(user.username, user['user-id']).then(() => {
            say(`${user['display-name']} вы успешно зарегестрированы в системе.`);
          });
        }
      });
      break;
    case 'points':
      db.getUserByTID(user['user-id']).then((data) => {
        const user_points = data.amount;
        say(`${user['display-name']} у вас на счету ${user_points} поинтов.`);
      });
      break;
    default:
      break;
  }
});

function say(text) {
  client.say('awbait', text);
}

module.exports = initTwitch;
