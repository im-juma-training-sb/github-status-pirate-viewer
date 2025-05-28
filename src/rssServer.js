// A Node Express based server App that utilizes the rssReader class 
// and its methods to serve RSS feeds to the client.
// The client is the status.ejs file in this directory.

// The server is a simple Express server that listens on port 3000.
// The server has a single route, '/status' which renders and serves 
// the 'status.ejs' page using EJS (Embedded JavaScript).

// import the required modules
const express = require("express");
const path = require("path");
const RSSReader = require("./rssReader");

// Create the express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// GitHub status RSS feed URL
const GITHUB_STATUS_FEED = "https://www.githubstatus.com/history.rss";

// Define routes
app.get("/", (req, res) => {
	// Ahoy matey! Redirect to the status page
	res.redirect("/status");
});

app.get("/status", async (req, res) => {
	try {
		// Arr, let's fetch the treasured status from the GitHub seas!
		const reader = new RSSReader(GITHUB_STATUS_FEED);
		const feedData = await reader.read();
		
		// Render the status page with the feed data
		res.render("status", { 
			title: "GitHub Status Feed - Pirate's View", 
			feedData: feedData 
		});
	} catch (error) {
		// Blimey! We've hit rough waters!
		console.error(`Ye be havin' an error: ${error.message}`);
		res.status(500).send(`
			<h1>Arrrgh! We've hit rough waters!</h1>
			<p>Failed to fetch the GitHub status: ${error.message}</p>
			<p>Try again later, or check if ye internet connection be workin'!</p>
		`);
	}
});

// Custom 404 page
app.use((req, res) => {
	// When sailors be lost at sea!
	res.status(404).send(`
		<h1>404 - Ye be lost at sea, matey!</h1>
		<p>The treasure ye be seeking doesn't exist on this here ship!</p>
		<a href="/status">Return to safe harbor</a>
	`);
});

// Start the server
app.listen(PORT, () => {
	// Avast ye! The server be startin'!
	console.log(`Ahoy! Yer server has set sail on port ${PORT}! Visit http://localhost:${PORT}/status to see the bounty!`);
});
