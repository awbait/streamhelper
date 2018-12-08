const request = require('request-promise');
const db = require('./db');

let streamer;

function initPoints(name) {
  streamer = name
  setInterval(() => {
    getChatters();
  }, 60000);
}

function getChatters() {
  let options = {
    method: 'GET',
    url: `https://tmi.twitch.tv/group/user/${streamer}/chatters`, // указать канал
    json: true
  };

  let chatters;

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    chatters = body.chatters.viewers;
    check(chatters);
  });
}
async function check(chatters) {
  for (key in chatters) {
    await db.getUserByTU(chatters[key]).then(async (data) => {
      if (data) {
        await db.addUserPoints(data.id).then(() => {
          console.log(`Данные обновлены ${chatters[key]}`);
        })
      } else {
        let user = await getUsers({
          login: chatters[key]
        });
        await db.createUserByTID(user[0].login, user[0].id);
        console.log(`Пользователь ${chatters[key]} добавлен.`);
      }
    });
  }
}

async function _performGetRequest(url, qs) {
  try {
    var response = await request({
      url: url,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer m34gekadods38wxg14f7g64lt0dlz7'
      },
      qs: qs,
      json: true
    });

    if (!response || !response.data) {
      return [];
    } else {
      return response.data;
    }
  } catch (err) {
    throw err;
  }
}

async function getUsers(options) {
  try {
    return await _performGetRequest.call(this,
      'https://api.twitch.tv/helix/users',
      options
    );
  } catch (error) {
    throw err;
  }
}

module.exports = initPoints;