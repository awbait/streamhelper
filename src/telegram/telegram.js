const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

const token = '645093024:AAG2ivgrZZ0AUjpzwXTuA1hhqlyABTBzMXA';

const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: '178.128.244.112',
      socksPort: '1080',
      // If authorization is needed:
      // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
      // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
    },
  },
});

function tNotify(data) {
  bot.sendPhoto('-1001385600343', `${data.image}?${new Date()}`, {
    caption: `${data.userName} сейчас стримит ${data.game} \n${data.title}\n\nЗрителей: ${data.viewerCount}`,
  });
}
module.exports = { tNotify };
