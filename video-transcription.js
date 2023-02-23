const axios = require('axios');
const FormData = require('form-data');

require("dotenv").config();

const apiKey = process.env["API_KEY_ENDPOINT"]
const endpoint = process.env["ENPOINT_VIDEO_2_TEXT"]


const main = async () => {
	const form = new FormData();
	form.append('audio_url', 'https://www.youtube.com/watch?v=_WjUFuW2J0A');
	form.append('language', 'english');
	form.append('language_behaviour', 'automatic single language');
	form.append('output_format', 'json');


	const response = await axios.post(
		endpoint,
			form,
			{
				headers: {
					...form.getHeaders(),
					'accept': 'application/json',
					'x-gladia-key': apiKey,
					'Content-Type': 'multipart/form-data'
				}
			}
	);
	return response;

}

main()
	.then((response) => console.log('response', response.data))
	.catch((e) => console.log('error', e));
