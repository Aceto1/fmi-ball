import axios from 'axios';

const authClient = axios.create({
	baseURL: 'http://h2965810.stratoserver.net', 
});

function handleError(error, errorMsg = null) {
	let status = 404
	if(error.response) {
		if (error.response.status === 422 || error.response.status === 401) {
			return error.response;
		} else {
			status = error.response.status;
		}
	}
	return {
		data: {
			errors: {
				value: status,
			},
			message: errorMsg ? errorMsg : 'Unhandled Error',
		},
	};
}

export default {
	async csrf() {
		return authClient
			.get('/sanctum/csrf-cookie')
			.catch((error) => handleError(error));
	},

	async get(url, payload, errorMsg = null) {
		return authClient
			.get('/' + url, payload)
			.catch((error) => handleError(error, errorMsg));
	},

	async post(url, payload, errorMsg = null) {
		let token = await this.csrf();
		if (token.error) return token;
		return authClient
			.post('/' + url, payload)
			.catch((error) => handleError(error, errorMsg));
	},
};