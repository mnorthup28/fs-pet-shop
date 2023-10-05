import http from "http";
import fs from "fs";

let server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/; // regular expressions to check for /pets/0, pets/1, etc

  if (req.method === "GET" && req.url === "/pets") {
    fs.readFile("../pets.json", "utf-8", function (error, text) {
      // Read pets from pets.json
      // if readFile produces an error, generate status code 500 (internal server error)
      if (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error");
        console.error(err.stack);
        return;
      }

      // parse json to an object (array)
      const pets = JSON.parse(text);

      // Return pets as response
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(pets));
    });
  } else if (req.method === "GET" && petRegExp.test(req.url)) {
    // if readFile produces an error, generate status code 500 (internal server error)
    fs.readFile("../pets.json", "utf8", (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("Internal Server Error");
        return; // stop callback here so Node doesn't try to use petJSON
      }
      // assume no file read error
      const pets = JSON.parse(petsJSON);
      // match the request URL with the pets/... pattern
      const matches = req.url.match(petRegExp);
      // grab the number from the matched URL array
      const petIndex = Number.parseInt(matches[1]);
      // ensure we have a number, and its in range - if not generate status code 404
      if (petIndex < 0 || petIndex >= pets.length || Number.isNaN(petIndex)) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found");
        return; // stop callback before using petIndex
      }

      // use petIndex to get specific pet from pets.json
      console.log("pet index: ", petIndex);
      // Stringify the pet
      const petJSON = JSON.stringify(pets[petIndex]);
      // set response status code
      res.statusCode = 200;
      // set content type and stringified json to response body
      res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(8000);
