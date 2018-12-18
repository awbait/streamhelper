const request = require('request-promise');
const eventemitter = require('eventemitter3');
const util = require('util');

const URL = 'https://api.twitch.tv/helix';

class WebHook {
  constructor(config) {
    eventemitter.call(this);
    this.config = config;
  }

  async topicUserFollowsSubscribe(fromId, toId) {
    try {
      let topic = `${URL}/users/follows?first=1`;
      if (fromId) {
        topic += `&from_id=${fromId}`;
      } else if (toId) {
        topic += `&to_id=${toId}`;
      }
      return await this.subscribe(topic, 'follows');
    } catch (error) {
      throw error;
    }
  }

  async topicStreamUpDownSubscribe(streamUserId) {
    try {
      const topic = `${URL}/streams?user_id=${streamUserId}`;
      return await this.subscribe(topic, 'streams', streamUserId);
    } catch (error) {
      throw error;
    }
  }

  async subscribe(topic, eventName, streamerId) {
    try {
      console.log(`TWITCH-WEBHOOK:: Подписка на WebHook с темой: ${topic}`);
      await request({
        url: 'https://api.twitch.tv/helix/webhooks/hub',
        method: 'POST',
        headers: {
          'Client-ID': this.config.clientId,
          'Content-Type': 'application/json',
        },
        form: {
          'hub.callback': `${this.config.callbackUrl}/webhook?type=${eventName}&stream_id=${streamerId}`,
          'hub.mode': 'subscribe',
          'hub.topic': topic,
          'hub.lease_seconds': '600',
        },
        json: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleRequest(method, headers, qs, body) {
    console.log('TWITCH-WEBHOOK:: Обработка нового запроса Webhook');
    if (!method) throw new Error('TWITCH-WEBHOOK:: Отсутствует параметр: method');
    if (!headers) throw new Error('TWITCH-WEBHOOK:: Отсутствует параметр: headers');
    if (!qs) throw new Error('TWITCH-WEBHOOK:: Отсутствует параметр: qs');

    if (method.toUpperCase() === 'GET') {
      return this.handleGetRequest.call(this, qs);
    }
    if (method.toUpperCase() === 'POST') {
      return this.handlePostRequest.call(this, headers, body, qs);
    } else {
      throw new Error(`TWITCH-WEBHOOK:: Неверный метод: ${method}`);
    }
  }

  handleGetRequest(qs) {
    this.result = null;
    if (qs['hub.mode'] === 'denied') {
      console.log(`TWITCH-WEBHOOK:: Подписка отклонена. Причина: ${qs['hub.reason']}`);
      this.result = {
        status: 200,
      };
    } else if (!qs['hub.challenge']) {
      console.log('TWITCH-WEBHOOK:: Отсутствует параметр: hub.challenge');
      this.result = {
        status: 410,
      };
    } else {
      console.log(`TWITCH-WEBHOOK:: Обработка hub.mode: ${qs['hub.mode']} получение запроса. Отправка hub.challenge.`);
      this.result = {
        status: 200,
        data: qs['hub.challenge'],
      };
    }
    return this.result;
  }

  handlePostRequest(headers, body, qs) {
    if (!body) throw new Error('TWITCH-WEBHOOK:: Отсутствует параметр: body');
    this.emit(qs.type, body.data, qs.stream_id);
    return {
      status: 200,
    };
  }
}

util.inherits(WebHook, eventemitter);
module.exports = WebHook;
