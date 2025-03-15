const path = require('path');
const fs = require('fs');

const consoleUtils = require('../utils/console');

const red = consoleUtils.RED;
const green = consoleUtils.GREEN;
const reset = consoleUtils.RESET;

module.exports = {
	name: 'get-them',
	desc: 'logs everyone in the current guild to a file',
	exec: async (data, _) => {
		const everyone = await data.message.guild.members.fetch();
		if (everyone.size <= 1) {
			console.warn(`${red}[GET THEM] there is no one${reset}`);
			return;
		}

		const users = everyone.map(user => ({
			userId: user.user.id,
			userName: user.user.username,
			displayName: user.displayName,
			joinedAt: user.joinedAt ? user.joinedAt.toISOString() : null
		}));

		console.log(`[GET THEM] logging ${users.length} users`);

		const guild = data.message.guild;
		const name = guild.name.replace(/[<>:"/\\|?*]/g, '-');

		const output = path.join(__dirname, '../../output/get-them', `${name} - ${guild.id}`);
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

		const file = path.join(output, 'gt-' + time + '.json');
		fs.writeFile(file, JSON.stringify(users, null, '	'), (err) => {
			if (err) {
				console.warn(`${red}[GET THEM] failed to write file - ${err}${reset}`);
				return;
			}

			console.log(`${green}[GET THEM] successfully written file - ${file}${reset}`);
		});
	}
};