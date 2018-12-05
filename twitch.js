require('dotenv').config()
const tmi = require('tmi.js');
const db = require('./db');

let options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_BOT_PASSWORD
	},
	channels: ['awbait']
};

let client = new tmi.client(options);
client.connect();

client.on('connected', (address, port) => {
	client.action('awbait', 'Ваш помошник подключился!')
})

client.on('chat', (channel, user, message, self) => {
	if (self) return;

	switch (message) {
		case '!reg':
			db.getUserByTID(user['user-id']).then((data) => {
				if(data) {
					say(`${user['display-name']} вы уже зарегестрированы в системе.`);
				} else { 
					console.log('Создать пользователя');
					db.createUserByTID(user).then(() => {
						say(`${user['display-name']} вы успешно зарегестрированы в системе.`);
					})
				}
			});
			break;
		case '!points':
			let points;
			db.getUserByTID(user['user-id']).then((data) => {
				points = data.amount;
				say(`${user['display-name']} у вас на счету ${points} поинтов.`)
			});
			break;
		default:
			break;
	}
})

function say(text) {
	client.say('awbait', text);
}