const axios = require('axios');
const fs = require('fs');
const summary = require('./txt-summarization.js');
require("dotenv").config();


const API_KEY = process.env["WEB_SCRAPING_API_KEY"] || "YOUR_API_KEY";
const TEST_MODE = true;

class Page {
	constructor(page) {
		this.page = page.title;
	}
}

async function scrapPage(page_url, extract_rules) {

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

	const res = await axios.get(hostname + options.path);
	// console.log('scrapPage#res', res.data);
	return res.data;
};

async function scrapHNs() {
	// const json = await JSON.parse(fs.readFileSync('scrap.json', 'utf8'));
	const pages = json.title;

	const extract_rules = {
		"p": {
			"selector": "p",
			"output": "text",
		}
	}

	let i = 0;
	let data_pages = [];
	for(chunk of pages) {
		const { name, links } = chunk;
		console.log('scrapHNs#scraping: ', name[0],links[0]);
		try {
			p = await scrapPage(links[0], extract_rules);
		} catch (error) {
			console.log('scrapHNs#ERROR', error);
		}
		p['title'] = name;
		data_pages.push(p);
		// i++;
		// if(i > 20) break;
	}
	// console.log('data_pages', data_pages);
	await fs.writeFileSync('HNs.json', JSON.stringify(data_pages));
};

async function doSummary(data_pages_json) {
	const maxSentenceCount = 3;
	let data = '';
	let summary = [];
	for(page of data_pages_json) {
		//TODO -> delete the compromised pages ...
		data = [`title: ${page.title[0]}. page: `.concat(page.p)]
		console.log(`sumarizing: ${page.title[0]}`)
		const result = await summary.main(data, maxSentenceCount);
		summary.push(result);
	}
	console.log('doSummary#summary', summary);
	// console.log('doSummary#result', result);
}

if(TEST_MODE) {
	// scrapHNs()
	const data_pages_json = JSON.parse(fs.readFileSync('HNs.json', 'utf8'));
	// console.log('data -> concat: ', data);
	//TODO
	// save to DB
	// Perform the summary -> AWS
	// console.log('data -> summary: ', data);
	doSummary(data_pages_json);
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