const express = require('express');
const ngrok = require('ngrok');
const bodyParser = require('body-parser');
const discords = require('./src/discord/discord-s');
const discordr = require('./src/discord/discord-r');
const twitch = require('./src/twitch');
const points = require('./src/points');
const WebHook = require('./src/twitch/webhook');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

ngrok
  .connect(8080)
  .then((externalUrl) => {
    console.log(`SERVER:: Подключен к ngrok на: ${externalUrl}`);
    startServer(externalUrl);
  })
  .catch((error) => {
    throw error;
  });

twitch();
points();
discords();
discordr();

function startServer(externalUrl) {
  const webHook = new WebHook({
    clientId: '6si3to7593qyjeb077vzurge6vf9yg',
    callbackUrl: externalUrl,
  });

  app.get('/webhook', (req, res) => {
    console.log('SERVER:: Получен GET запрос');
    const result = webHook.handleRequest('GET', req.headers, req.query);
    res.status(result.status).send(result.data);
  });
  app.post('/webhook', (req, res) => {
    console.log('SERVER:: Получен POST запрос');
    const result = webHook.handleRequest('POST', req.headers, req.query, req.body);
    res.sendStatus(result.status);
  });

  app.listen(8080, () => console.log('App listening on port '));

  webHook.on('streams', (data) => {
    console.log('Событие сработало.');
    console.log(data);
  });

  webHook.topicStreamUpDownSubscribe('38372702');
}
