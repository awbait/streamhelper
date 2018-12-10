const discords = require('./src/discord-s');
const twitch = require('./src/twitch');
const points = require('./src/points');
require('dotenv').config();

twitch();
points();
discords();
