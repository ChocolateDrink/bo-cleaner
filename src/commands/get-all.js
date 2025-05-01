const path = require('path');
const fs = require('fs');

const ignores = require('../../config/ignore.json');
const consoleUtils = require('../utils/console');

const red = consoleUtils.RED;
const green = consoleUtils.GREEN;
const yellow = consoleUtils.YELLOW;
const reset = consoleUtils.RESET;

module.exports = {
	name: 'get-all',
	desc: 'logs everyone in every guild',
	exec: async (data, _) => {
		const guilds = data.bot.guilds.cache;
		if (guilds.size === 0) {
			console.warn(`${red}[GET ALL] there are no guilds${reset}`);
			return;
		}

		const allGuilds = [];

		for (const guild of guilds.values()) {
			if (ignores.servers.includes(guild.id)) {
				console.log(`${yellow}[GET ALL] skipping ignored guild "${guild.name}"${reset}`);
				continue;
			}

			const members = await guild.members.fetch();
			if (members.size <= 1) {
				console.warn(`${red}[GET ALL] there is no one in guild "${guild.name}"${reset}`);
				continue;
			}

			const users = members.filter(user => !ignores.people.includes(user.user.id)).map(user => ({
				userId: user.user.id,
				userName: user.user.username,
				displayName: user.displayName,
				joinedAt: user.joinedAt ? user.joinedAt.toISOString() : null
			}));

			allGuilds.push({
				serverId: guild.id,
				serverName: guild.name,
				userData: users
			});

			console.log(`[GET ALL] logging ${users.length} users from guild "${guild.name}"`);
		}

		if (allGuilds.length === 0) {
			console.warn(`${red}[GET ALL] no one in all guilds${reset}`);
			return;
		}

		const output = path.join(__dirname, '../../output/get-all');
		if (!fs.existsSync(output)) {
			fs.mkdirSync(output, { recursive: true });
		}

		const now = new Date();
		const time = now.getFullYear() + '-' +
			(now.getMonth() + 1).toString().padStart(2, '0') + '-' +
			(now.getDate()).toString().padStart(2, '0') + '_' +
			(now.getHours()).toString().padStart(2, '0') + '-' +
			(now.getMinutes()).toString().padStart(2, '0') + '-' +
			(now.getSeconds()).toString().padStart(2, '0');

		const file = path.join(output, 'ga-' + time + '.json');
		fs.writeFile(file, JSON.stringify(allGuilds, null, '	'), (err) => {
			if (err) {
				console.warn(`${red}[GET ALL] failed to write file - ${err}${reset}`);
				return;
			}

			console.log(`${green}[GET ALL] successfully written file - ${file}${reset}`);
		});
	}
};