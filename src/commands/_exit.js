const consoleUtils = require('../utils/console');

module.exports = {
	name: 'exit',
	desc: 'shuts down the bot',
	exec: (data, _) => {
		data.bot.destroy();
		console.log(`${consoleUtils.RED}[EXIT] bot destroyed${consoleUtils.RESET}`);

		process.exit(1);
	}
};