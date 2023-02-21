// const http = require("https");
const axios = require('axios');
const fs = require('fs');
require("dotenv").config();

const API_KEY = process.env["WEB_SCRAPING_API_KEY"] || "YOUR_API_KEY";
const TEST_MODE = true;


class Page {
	constructor(page) {
		this.page = page.title;
	}
}

async function scrapPage(page_url, extract_rules) {

	console.log('scrapPage#page_url', page_url);
	console.log('scrapPage#extract_rules', extract_rules);

	const page_url_encoded = encodeURI(page_url);
	const extract_rules_encoded = encodeURI(JSON.stringify(extract_rules));

	const hostname = 'https://api.webscrapingapi.com';

	const options = {
		"method": "GET",
		"hostname": "api.webscrapingapi.com",
		"port": null,
		"path": `/v1?url=${page_url_encoded}&api_key=${API_KEY}&device=desktop&proxy_type=datacenter&render_js=0&extract_rules=${extract_rules_encoded}`,
		"headers": {}
	};
	console.log('options.path', options.path)

	const res = await axios.get(hostname + options.path);
	console.log('scrapPage#res', res.data);
	return res.data;
};

async function scrapHNs(pages) {
	// console.log('pages', pages);
	let i = 0;
	for(chunk of pages) {
		const { name, links } = chunk;
		const data = [];
		let p = '';
		extract_rules = {
			"title": {
				"selector": "h1",
				"output": {
					"p": {
						"selector": "p",
						"output": "text"
					}
				},
			}
		}
		// await scrapPage(links[0], extract_rules);
		p = await scrapPage(links[0], extract_rules);
		// console.log('p', p);
		i++;
		if(i> 0) break;
	}
};


if(TEST_MODE) {
	const json = JSON.parse(fs.readFileSync('scrap.json', 'utf8'));
	scrapHNs(json.title);
} else if(!TEST_MODE) {
	const extract_rules = [
		{
			"title": {
				"selector": ".titleline",
				"output": {
					"name": {
						"selector": "a",
						"output": "text"
					},
					"links": {
						"selector": "a",
						"output": "@href",
						"all": "1"
					}
				},
				"all": "1"
			}
		}
	]
	hn_url = 'https://news.ycombinator.com/';
	scrapPage(hn_url, extract_rules);
}