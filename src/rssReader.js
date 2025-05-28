// A javascript class to read RSS feeds parse the data and return it to the client.
// The class 
// 1. takes a URL as an argument in the constructor
// 2. fetches the RSS feed data from the provided URL with the method 'fetchFeed()'
// 3. parses the raw XML data into JSON, with the node.js package 'xml2js' in the method 'parseFeed()'
//   3.1. maps the parsed data to the required format: pubDate, title, link and description
// 4. returns the parsed data from the RSS feed with the method 'read()'

// import the required modules
const https = require('https');
const xml2js = require('xml2js');

// RSSReader class - Ye mighty feed collector for all ye scallywags!
class RSSReader {
	constructor(url) {
		// Arr, store the treasure map URL!
		this.url = url;
		this.parsedData = null;
	}

	// Fetch the RSS feed from the URL
	async fetchFeed() {
		// Avast ye! We be fetchin' the booty from the high seas of the internet!
		return new Promise((resolve, reject) => {
			https.get(this.url, (response) => {
				// Check if we got a good response from the server
				if (response.statusCode < 200 || response.statusCode >= 300) {
					reject(new Error(`Blimey! Failed to get data: ${response.statusCode}`));
					return;
				}

				// Collect the data chunks
				const chunks = [];
				response.on("data", (chunk) => {
					chunks.push(chunk);
				});

				// When all data is received, resolve the promise
				response.on("end", () => {
					const data = Buffer.concat(chunks).toString();
					resolve(data);
				});
			}).on("error", (err) => {
				// Handle errors
				reject(new Error(`Shiver me timbers! Error fetchin' feed: ${err.message}`));
			});
		});
	}

	// Parse the XML feed into JSON
	async parseFeed(rawData) {
		// Yarr! Let's decode this mysterious scroll!
		try {
			const parser = new xml2js.Parser({ explicitArray: false });
			const result = await new Promise((resolve, reject) => {
				parser.parseString(rawData, (err, result) => {
					if (err) reject(err);
					else resolve(result);
				});
			});

			// Check if we have items and map them to our required format
			if (result && result.rss && result.rss.channel) {
				const items = Array.isArray(result.rss.channel.item) 
					? result.rss.channel.item 
					: [result.rss.channel.item];

				// Map the RSS items to our format
				this.parsedData = items.map(item => {
					return {
						pubDate: item.pubDate || 'No date available, ye scurvy dog!',
						title: item.title || 'Untitled treasure',
						link: item.link || '#',
						description: item.description || 'No description for this bounty!'
					};
				});

				return this.parsedData;
			} else {
				throw new Error("Blast it all! No items found in the feed!");
			}
		} catch (error) {
			throw new Error(`Arr, failed to parse feed: ${error.message}`);
		}
	}

	// Read the RSS feed
	async read() {
		// Gather the treasures from the seven seas!
		try {
			const rawData = await this.fetchFeed();
			return await this.parseFeed(rawData);
		} catch (error) {
			throw new Error(`Failed to read RSS feed: ${error.message}`);
		}
	}
}

module.exports = RSSReader;
