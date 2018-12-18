const telegram = require('./telegram/telegram');

function checkData(data) {
  if (data) {
    console.log('ON');
    console.log(data[0]);
    notify(data[0]);
  } else if (!data) {
    console.log('OFF');
  }
}

function notify(data) {
  const url = data.thumbnail_url.replace(/{width}/, '500').replace(/{height}/, '500');
  const info = {
    image: url,
    userName: data.user_name,
    title: data.title,
    game: data.game_id,
    viewerCount: data.viewer_count,
  };
  telegram.tNotify(info);
}

module.exports = checkData;
