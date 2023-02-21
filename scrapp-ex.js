const http = require("https");
const fs = require('fs');

const uri = 'https://news.ycombinator.com/';
const encoded = encodeURI(uri);

require("dotenv").config();

API_KEY=process.env["WEB_SCRAPING_API_KEY"] || "YOUR_API_KEY"


async function scrapPages(pages) {
	for(page of pages) {
		const { name, links } = page;
		console.log('name', name[0]);
		console.log('links', links[0]);
		
	}
};



const extract_rules = [
	{
		"title": {
			"selector": ".title",
			"output": "text",
			"all": "1"
		}
	},
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

const extract_rules_encoded = encodeURI(JSON.stringify(extract_rules[1]));

const options = {
  "method": "GET",
  "hostname": "api.webscrapingapi.com",
  "port": null,
  "path": `/v1?url=${encoded}&api_key=${API_KEY}&device=desktop&proxy_type=datacenter&render_js=0&extract_rules=${extract_rules_encoded}`,
  "headers": {}
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
		const string = body.toString();
		const json = JSON.parse(string);
		
		scrapPages(json.title);
  });
});

req.end();
