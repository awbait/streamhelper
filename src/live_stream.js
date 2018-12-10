const request = require('request-promise');

let live = 'off';

async function getLiveStatus(streamer) {
  try {
    const response = await request({
      url: 'https://api.twitch.tv/helix/streams',
      method: 'GET',
      headers: {
        'Client-ID': 'j0qoasqdy4umo8v7o0g7h23sru85c4',
      },
      qs: {
        user_login: streamer,
      },
      json: true,
    });
    if (response.data[0]) {
      if (live !== 'on') {
        console.log('stream online');
        live = 'on';
      }
    } else if (!response.data[0]) {
      live = 'off';
    }
  } catch (error) {
    throw error;
  }
}

function initLiveStream(streamer) {
  setTimeout(() => {
    getLiveStatus(streamer);
  }, 6000);

  setInterval(() => {
    getLiveStatus(streamer);
  }, 60000);
}

function status() {
  return live;
}
module.exports = {
  initLiveStream,
  status,
};
