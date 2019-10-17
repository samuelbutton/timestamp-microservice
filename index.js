// adds in http module that ships with Node
const http = require("http");
const fs = require("fs");

const getTimestamp = date => ({
	unix: date.getTime(),
	utc: date.toUTCString()
});


// i think this creates a function that uses two parameters,
//  a request and a response to print and append
// this function will be invoked on each incoming request to the web server
const requestHandler = (req, res) => {
	// because the http module is very basic, it doesn't provide us with a router
	// therefor we have to manually check for the URL to decide what to do for each route
	if (req.url === "/") {
		// readFile asynchronously reads the file provided in the first argument
		// using the provided encoding and executes the provided callback function
		fs.readFile("views/index.html", "utf8", (err, html) => {
			// if error happens while reading the file
			if (err) throw err;
			// need to set the HTTP response code, as well as set a response header
			// to tell the browser what the media type of the returned content is
			// the second header is an object that represents the response headers
			res.writeHead(200, {"Content-Type": "text/html" });
			// signals the end of the server response	
			res.end(html);
		});

	// checks for agreed upon URL
	} else if (req.url.startsWith("/api/timestamp")) {
		// splits in order to parse out the given timstamp
		const dateString = req.url.split("/api/timestamp/")[1];
		let timestamp;

		// no valid date was given
		if (dateString === undefined || dateString.trim() === "") {
			// in that case, returns this moment's timestamp
			timestamp = getTimestamp(new Date());
		} else {
			// if the string is an integer
			const date = !isNaN(dateString)
				// if tru, that parse the integer to a date
				? new Date(parseInt(dateString))
				// otherwise, parse the string to a date
				: new Date(dateString);
			// if the the time resulting from the date is a number
			if (!isNaN(date.getTime())) {
				// then set the object to be returned
				timestamp = getTimestamp(date);
			} else {
				// otherwise set the object as an error object
				timestamp = {
					error: "invalid date"
				};
			}
		}
		// write information, so that the browser know that the process has been succesful
		// write the type of data so that the response body is correctly interpreted as JSON
		res.writeHead(200, {"Content-Type": "application/json"});
		// return the object stringified in JSON format
		res.end(JSON.stringify(timestamp));
	} else {
		fs.readFile("views/404.html", (err, html) => {
			if (err) throw err;

			res.writeHead(404, {"Content-Type": "text/html"});
			res.end(html);
		});
	}
};

// part of Node's http functionality
// initialized with a request handler
const server = http.createServer(requestHandler);

// server listens at the coded port or 4100, the callback function
// passed as the second argument to the listen method will execute when the server
// starts... 
// if there is an error in the process, the listen function prints out the error
// if there isn't there is a log to the console
// start server with node index.js
server.listen(process.env.PORT || 4100, err => {
	if (err) throw err;
	console.log(`Server running on PORT ${server.address().port}`);
});


