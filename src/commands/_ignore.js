const path = require('path');
const fs = require('fs');

const userUtils = require('../utils/user');
const consoleUtils = require('../utils/console');

const red = consoleUtils.RED;
const green = consoleUtils.GREEN;
const reset = consoleUtils.RESET;

const ignores = path.join(__dirname, '../../config/ignore.json');

const ignoreServer = (id, data) => {
	const guild = data.message.guild
	const guildId = id || guild.id;

	fs.readFile(ignores, 'utf-8', (err, data) => {
		if (err) {
			console.warn(`${red}[IGNORE] failed to read file - ${err}${reset}`);
			return;
		}

		const ignoreList = JSON.parse(data);
		if (ignoreList.servers.includes(guildId)) {
			console.warn(`${red}[IGNORE] guild already ignored${reset}`);
			return;
		}

		ignoreList.servers.push(guildId);
		console.log(`[IGNORE] adding "${guild.name}" to server ignore list`);

		fs.writeFile(ignores, JSON.stringify(ignoreList, null, '	'), (err) => {
			if (err) {
				console.warn(`${red}[IGNORE] failed to write file - ${err}${reset}`);
				return;
			}

			console.log(`${green}[IGNORE] successfully written file - ${ignores}${reset}`);
		});
	});
};

const ignoreUser = (id, data) => {
	if (!id) {
		data.message.reply('provide a user id');
		return;
	}

	const token = data.bot.token;

	fs.readFile(ignores, 'utf-8', async (err, data) => {
		if (err) {
			console.warn(`${red}[IGNORE] failed to read file - ${err}${reset}`);
			return;
		}

		const ignoreList = JSON.parse(data);
		if (ignoreList.people.includes(id)) {
			console.warn(`${red}[IGNORE] user already ignored${reset}`);
			return;
		}

		const userData = await userUtils.getUsernameFromId(id, token);
		const [userName, displayName] = userData.split('|', 2);

		ignoreList.people.push(id);
		console.log(`[IGNORE] adding "${userName} (${displayName})" to people ignore list`);

		fs.writeFile(ignores, JSON.stringify(ignoreList, null, '	'), (err) => {
			if (err) {
				console.warn(`${red}[IGNORE] failed to write file - ${err}${reset}`);
				return;
			}

			console.log(`${green}[IGNORE] successfully written file - ${ignores}${reset}`);
		});
	});
};

module.exports = {
	name: 'ignore',
	desc: 'adds a server or user to the ignore list',
	exec: (data, args) => {
		if (args.length < 1) {
			data.message.reply('this command requires at least 1 arguments');
			return;
		}

		const what = args[0];
		if (what === 'server' || what === 'guild') {
			ignoreServer(args[1], data);
		} else if (what === 'user' || what === 'person') {
			ignoreUser(args[1], data);
		} else {
			data.message.reply('first argument is invalid, use server/guild or user/person');
		}
	}
};