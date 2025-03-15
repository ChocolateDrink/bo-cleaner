const config = require('../config/config.json');
const consoleUtils = require('./utils/console');

const fileSys = require('fs');
const path = require('path');

const { Client } = require('discord.js-selfbot-v13');
const bot = new Client();
bot.commands = new Map();

const log = (...args) => {
	if (!config.logging.debug) return;
	console.log(args.toString());
}

const files = fileSys
	.readdirSync(path.join(__dirname, 'commands'))
	.filter(file => file.endsWith('.js'));

for (const file of files) {
	const cmd = require('./commands/' + file);
	bot.commands.set(cmd.name, cmd);
}

bot.on('ready', () => {
	console.log('\x1b[38;5;87mready\x1b[0m');
});

bot.on('messageCreate', (message) => {
	const author = message.author;
	if (author.bot && config.logging.common) {
		log('message author is a bot: ' + author);
		return;
	}

	if (!config.whitelisted.includes(author.id)) {
		if (config.logging.common) log('message author is not whitelisted: ' + author);
		return;
	}

	const content = message.content;
	if (!content.startsWith(config.bot.prefix))
		return;

	const args = content.slice(config.bot.prefix.length).trim().split(/\s+/);
	const name = args.shift().toLocaleLowerCase();

	const cmd = bot.commands.get(name);
	if (!cmd) {
		log(`command "${name}" not found`);
		return;
	}

	try {
		log(`command "${name}" executing with ${args.length > 0 ? `args: ${args.join(' ')}` : 'no args'}`);
		cmd.exec({
			bot: bot,
			message: message
		}, args);
	} catch(e) {
		console.warn(`${consoleUtils.RED}error in command "${name}" - ${e}${consoleUtils.RESET}`);
	}
});

bot.login(config.bot.token);