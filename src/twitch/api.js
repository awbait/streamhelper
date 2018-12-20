const request = require('request-promise');

class TwitchApi {
  async getGames(options) {
    try {
      return await this._performGetRequest.call(this,
        'https://api.twitch.tv/helix/games',
        options);
    } catch (error) {
      throw error;
    }
  }

  async _performGetRequest(url, qs) {
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
}

module.exports = TwitchApi;
