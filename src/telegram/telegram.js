const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

const token = '645093024:AAG2ivgrZZ0AUjpzwXTuA1hhqlyABTBzMXA';

const bot = new TelegramBot(token, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: '78.155.193.236',
      socksPort: '8444',
      // If authorization is needed:
      // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
      // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
    },
  },
});

bot.sendMessage('-1001385600343', 'HELLO');
