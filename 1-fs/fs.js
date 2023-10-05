// const fs = require('fs'); // commonJS
import fs from "fs"; // ES6 module import

// get 3rd subcommand from command line
const command = process.argv[2];
// check if 3rd subcommand is "read"
if (command === "read") {
  // read pets.json
  fs.readFile("../pets.json", "utf-8", function (error, text) {
    // if readFile produces an error, throw is so Node will display the error
    // from the function vs a general syntax error (much more user friendly)
    if (error) {
      throw error; // the error is a hot potato - don't handle it, throw it up the call stack
    }
    // parse json to an object (array)
    const pets = JSON.parse(text);

    // get 4th subcommand from command line
    const petIndex = process.argv[3];
    // if no 4th subcommand is present after "read", display all the pets
    if (process.argv.length < 4) {
      console.log(pets);
      process.exit(1); // stop without error
    }
    // convert from string to integer
    const indexNum = Number.parseInt(petIndex);

    // check if 4th subcommand is a valid int - otherwise give proper instructions for reading
    if (!Number.isInteger(indexNum) || Number.isNaN(indexNum)) {
      console.error(`Usage: node fs.js read INDEX`);
      process.exit(1); // stop with error code 1
    }

    // if INDEX is not in bounds of the pets array, give proper instructions for reading
    if (indexNum < 0 || indexNum >= pets.length) {
      console.error(`Usage: node fs.js read INDEX`);
      process.exit(1); // stop with error code 1
    }

    // use the INDEX to log the correct pet from the json object
    console.log(pets[indexNum]);
  });
} else {
  // 3rd subcommand was not "read" - give all possible subcommands
  console.error("Usage: node fs.js [read | create | update | destroy]");
  process.exit(1);
}
