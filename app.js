const discords = require('./src/discord/discord-s');
const discordr = require('./src/discord/discord-r');
const twitch = require('./src/twitch');
const points = require('./src/points');
require('dotenv').config();

twitch();
points();
discords();
discordr();
