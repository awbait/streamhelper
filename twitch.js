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
	if (self) return; // Не читать мои сообщения

	switch (message) {
		case '!reg':
			db.getUserByTID(user['user-id']).then((data) => {
				if(data) {
					say(`${user['display-name']} вы уже зарегестрированы в системе.`);
				} else { 
					db.createNewUserByTID(user).then(() => {
						say(`${user['display-name']} вы успешно зарегестрированы в системе.`);
					})
				}
			});
			break;
		case '!points':
			let points;
			db.getUserByTID(user['user-id']).then((data) => { // сделать проверку зарегистрирован ли пользователь
				points = data.coins;
				say(`${user['display-name']} у вас на счету ${points} монет.`)
			});
			break;
		default:
			break;
	}

})


function say(text) {
	client.say('awbait', text);
}
/*
client.on('chat', (channel, user, message, self) => { // TODO: Добавить проверку на фоллоу канала
    if (message === '!reg') {
		sendModuleMsg(process, 'db', 'reg-check', user);
    } else if (message === '!coins') {
		sendModuleMsg(process, 'bd', 'get-coins', user)
	}
})

process.on('message', (msg) => {
    switch (msg.header) {
        case 'user-exists':
			client.action('awbait', msg.data['display-name'] +' Вы уже зарегистрированы!');
			break;
		case 'user-registered':
			client.action('awbait', msg.data['display-name'] +' Вы успешно зарегистрированы!');
			break;
		case 'user-coins':
			client.action('awbait', msg.data[0]['display-name'] + ' На вашем аккаунте: ' + msg.data[1] + ' бабла.')
			break;
        default:
            break;
    }
});

*/