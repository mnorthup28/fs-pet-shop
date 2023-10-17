import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());
const port = 8000;

app.get("/", (req, res) => {
  res.send("goodbye!");
});

app.get("/pets", (req, res) => {
  fs.readFile("../pets.json", "utf-8", function (err, text) {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
      return;
    }
    res.json(JSON.parse(text));
  });
});

app.get("/pets/:id", (req, res) => {
  fs.readFile("../pets.json", "utf-8", (err, text) => {
    const pets = JSON.parse(text);
    const petId = req.params.id;
    const petIndex = Number.parseInt(petId);
    const petJSON = JSON.stringify(pets[petIndex]);

    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
      return;
    }
    // make sure ID is in the range of pets array, and that it is
    // a number.
    if (petIndex < 0 || petIndex >= pets.length || Number.isNaN(petIndex)) {
      return res.sendStatus(404);
    }

    res.send(petJSON);
  });
});

// endpoint to create a new pet
// POST request

app.post("/pets", (req, res) => {
  console.log("req.body", req.body);
  const age = Number.parseInt(req.body.age);
  const kind = req.body.kind;
  const name = req.body.name;
  // validate data from requet object body
  if (!kind || !name || Number.isNaN(age)) {
    return res.sendStatus(404);
  }
  // create a new pet object
  const newPet = { age: age, kind: kind, name: name };
  console.log(newPet);
  fs.readFile("../pets.json", "utf-8", function (err, text) {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
      return;
    }
    const pets = JSON.parse(text);
    pets.push(newPet);
    fs.writeFile("../pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
        return;
      }
      res.statusCode = 201;
      res.send(newPet);
    });
  });
  // add to pets.json
  // read in pets.json
  res.end();
});

app.listen(port, () => {
  console.log("example app listening to port 8000");
});
