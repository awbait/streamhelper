const request = require('request-promise');
require('dotenv').config({ path: '../'})

let live = 'off';

async function getLiveStatus (streamer) {
    try {
        let response = await request({
            url: 'https://api.twitch.tv/helix/streams',
            method: 'GET',
            headers: {
                'Client-ID': 'j0qoasqdy4umo8v7o0g7h23sru85c4'
            },
            qs: {
                user_login: streamer
            },
            json: true
        })
        if (response.data[0]) {
            if (live !== 'on') {
                console.log('stream online');
                live = 'on';
            }
        } else if (!response.data[0]) {
            console.log('stream ofline');
        }
    } catch (error) {
        throw error;
    }
}
function initLiveStream(streamer) {
    setTimeout(() => {
        getLiveStatus(streamer);
    }, 5000);

    setInterval(() => {
        getLiveStatus(streamer);
    }, 10000)
}
function status () {
    return live;
}
module.exports = {
    initLiveStream,
    status
};