const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

const token = '645093024:AAG2ivgrZZ0AUjpzwXTuA1hhqlyABTBzMXA';

const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: '178.62.127.186',
      socksPort: '8444',
      // If authorization is needed:
      // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
      // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
    },
  },
});

function streamNotify(data) {
  bot.sendPhoto('-1001385600343', `${data.image}?${new Date()}`, {
    caption: `*${data.userName}* запустил стрим!\n${data.title}\n\nИграет в: *${data.game}*\nЗрителей: *${data.viewerCount}*`,
    parse_mode: 'markdown',
  });
}
module.exports = { streamNotify };
