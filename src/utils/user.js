const getUsernameFromId = async (id, token) => {
	const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
		method: 'GET',
		headers: {
			'Authorization': token,
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok)
		return 'failed to get|failed to get';

	const data = await response.json();
	return `${data.username}|${data.global_name}`;
};

export {
	getUsernameFromId
};