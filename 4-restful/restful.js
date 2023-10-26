import express from "express";
import fs from "fs/promises";
import pg from "pg";

let client = new pg.Client({
  database: "petshop",
});

try {
  await client.connect();
  console.log("Database connected");
} catch (err) {
  console.error(err);
}

const port = 8000;

const app = express();
// enable middleware for receiving JSON request body
app.use(express.json());
// logging middleware
app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Goodbye");
});

app.get("/pets", (req, res) => {
  client
    .query(`SELECT * FROM pets`)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.get("/pets/:id", (req, res) => {
  const petId = Number.parseInt(req.params.id);
  client
    .query(`SELECT name, age, kind FROM pets WHERE id = $1`, [petId])
    .then((data) => {
      if (data.rows.length == 0) {
        res.sendStatus(404);
      }
      res.json(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// endpoint to create a new pet
app.post("/pets", (req, res) => {
  // console.log("req.body", req.body);
  const age = Number.parseInt(req.body.age); // make sure its a number
  const { kind, name } = req.body;
  // validate data from request body
  if (!kind || !name || Number.isNaN(age) || null) {
    return res.sendStatus(400);
  }
  // create a new pet object
  const newPet = { age, name, kind };
  console.log("newPet", newPet);
  // insert new row to pets table in DB
  client
    .query(
      `INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *`,
      [name, kind, age]
    )
    .then((data) => {
      console.log(data.rows);
      res.send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// endpoint to update a pet
app.patch("/pets/:id", (req, res) => {
  const petId = Number.parseInt(req.params.id);
  const age = Number.parseInt(req.body.age); // make sure its a number
  const { kind, name } = req.body;
  // execute UPDATE SQL
  client
    .query(
      `UPDATE pets SET name = COALESCE ($1, name), kind = COALESCE ($2, kind), age = COALESCE ($3, age) WHERE id=$4 RETURNING *`,
      [name, kind, age, petId]
    )
    .then((data) => {
      if (data.rows.length == 0) {
        res.sendStatus(404);
      }
      console.log("updated pet: ", data.rows[0]);
      res.send(data.rows[0]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.delete("/pets/:id", (req, res) => {
  const petId = Number.parseInt(req.params.id);
  client
    .query(`DELETE FROM pets WHERE id = $1 RETURNING *`, [petId])
    .then((data) => {
      if (data.rows[0] !== undefined) {
        res.json(data.rows[0]);
        res.status(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
