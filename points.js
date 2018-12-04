const request = require("request");
const db = require('./db');

let chatters;

function getChatters() {
  var options = {
    method: 'GET',
    url: 'https://tmi.twitch.tv/group/user/dicik_/chatters',
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    chatters = body.chatters.viewers;
    check();
  });

}
setInterval (() => {
  getChatters()
}, 60000);


async function check() {
  for (key in chatters) {
    await db.getUserPoints(chatters[key]).then( async (data) => {
      if(data) {
        await db.addUserPoints(chatters[key]).then(async () => {
          console.log(`Данные обновлены ${chatters[key]}`);
        })
      } else {
        await db.createUserPoints(chatters[key], 1).then( async () => {
          console.log(`Пользователь ${chatters[key]} добавлен.`);
        })
      }
    });
  }
}