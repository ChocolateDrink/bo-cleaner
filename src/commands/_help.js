module.exports = {
	name: 'help',
	desc: 'shows all commands and thier descriptions',
	exec: (data, _) => {
		const commands = data.bot.commands;

		let message = '```\n';
		commands.forEach(cmd => {
			message += `${cmd.name} - ${cmd.desc}\n`;
		});

		message += '```';
		data.message.reply(message);
	}
};