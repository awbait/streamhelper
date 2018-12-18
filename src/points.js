const request = require('request-promise');
const db = require('./db');
const live = require('./live_stream');

const blacklist = ['awbait'];
const streamer = process.env.TWITCH_CHANNEL;

function initPoints() {
  live.initLiveStream(streamer);
  setInterval(() => {
    if (live.status() !== 'on') return;
    getChatters();
  }, 120000);
}

function getChatters() {
  const options = {
    method: 'GET',
    url: `https://tmi.twitch.tv/group/user/${streamer}/chatters`,
    json: true,
  };

  let chatters;

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    chatters = body.chatters.viewers.concat(body.chatters.moderators);
    check(chatters);
    console.log(chatters);
  });
}

function check(chatters) {
  Object.keys(chatters).forEach(async (key) => {
    if (blacklist.includes(chatters[key])) return;
    await db.getUserByTU(chatters[key]).then(async (data) => {
      if (data) {
        await db.addUserPoints(data.id).then(() => {
          console.log(`Данные обновлены ${chatters[key]}`);
        });
      } else {
        const user = await getUsers({
          login: chatters[key],
        });
        await db.createUserByTID(user[0].login, user[0].id);
        console.log(`Пользователь ${chatters[key]} добавлен.`);
      }
    });
  });
}
async function _performGetRequest(url, qs) {
  try {
    const response = await request({
      url,
      method: 'GET',
      headers: {
        Authorization: 'Bearer m34gekadods38wxg14f7g64lt0dlz7',
      },
      qs,
      json: true,
    });

    if (!response || !response.data) {
      return [];
    }
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getUsers(options) {
  try {
    return await _performGetRequest.call(this,
      'https://api.twitch.tv/helix/users',
      options);
  } catch (error) {
    throw error;
  }
}
module.exports = initPoints;
