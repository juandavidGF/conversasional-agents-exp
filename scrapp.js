const http = require("https");
require('dotenv').config();

const options = {
  "method": "GET",
  "hostname": "api.webscrapingapi.com",
  "port": null,
  "path": `/v1?api_key=${process.env.WEB_SCRAPING_API_KEY}&render_js=0&device=desktop&proxy_type=datacenter&url=https%3A%2F%2Fwww.brilliantmonocle.com%2F`,
  "headers": {}
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();