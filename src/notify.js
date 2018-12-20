const telegram = require('./telegram/telegram');
const TwitchApi = require('./twitch/api');

const twitchApi = new TwitchApi();

function checkData(data, discord) {
  if (data) {
    console.log(`NOTIFY:: ${data[0].user_name} Stream Starting`);
    notify(data[0], discord);
  } else if (!data) {
    console.log('NOTIFY:: Stream Offline');
  }
}

async function notify(data, discord) {
  try {
    const image = data.thumbnail_url.replace(/{width}/, '600').replace(/{height}/, '400');
    const game = await twitchApi.getGames({
      id: data.game_id,
    });
    const info = {
      image,
      userName: data.user_name,
      title: data.title,
      game: game[0].name,
      viewerCount: data.viewer_count,
    };
    telegram.streamNotify(info);
    discord.streamNotify(info);
  } catch (error) {
    throw error;
  }
}

module.exports = checkData;
