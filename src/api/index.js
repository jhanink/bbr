const express = require("express");
const serverless = require("serverless-http");
require('dotenv').config();
const { db } = require('./db');

const app = express();
const port = 3000;

const dev = process.env.NODE_ENV !== "production";

app.use(express.json());

// Public API
//---------------------------


app.get("/updateTables", async (req, res) => {
  console.log('Update Tables')
  const option = req.params.force ? {force: true} : {alter: true}
  await db.updateTables(option);
  res.send("done updating tables")
});

app.get("/seedUser", async (req, res) => {
  console.log('seed User')
  const user = await db.seedUser();
  res.send(user || "no user")
});

app.get("/users", async (req, res) => {
  console.log('Users')
  const users = await db.getUsers();
  res.send(users || "no users")
});

app.get("/users/:id", async (req, res) => {
  await queries.getUserById(req, res);
});

app.get("/users/:email", async (req, res) => {
  await queries.getUserByEmail(req, res);
});

app.get("/games", async (req, res) => {
  await queries.getGames(req, res);
});

app.get("/players", async (req, res) => {
  await queries.getPlayers(req, res);
});

//---------------------------
// DB integration
//---------------------------
const queries = {
  getUsers: async (req, res) => {
    await util.handleRequest(req, res, async (client) => {
      res.send(await client.query("SELECT * from users"));
    })
  },
  getUserById: async (req, res) => {
    await util.handleRequest(req, res, async (client) => {
      const { id } = req.params;
      res.send(await client.query("SELECT * from users where id = $1", [id]));
    })
  },
  getUserByEmail: async (req, res) => {
    await util.handleRequest(req, res, async (client) => {
      const { email } = req.params;
      res.send(await client.query("SELECT * from users where email = $1", [email]));
    })
  },
  getPlayers: async (req, res) => {
    await util.handleRequest(req, res, async (client) => {
      res.send(await client.query("SELECT * from players"));
    })
  },
  getGames: async (req, res) => {
    await util.handleRequest(req, res, async (client) => {
      res.send(await client.query("SELECT * from games"));
    })
  }
}

//---------------------------
// Utilities
//--------------------------

const util = {
  handleRequest: async (req, res, handler) => {
    const client = new Client(DATABASE_URL);
    try {
      await client.connect();
      await handler(client);
    } catch (err) {
      console.error("error handling request:", err);
      res.status(500).send("Internal server error");
    } finally {
      await client.end();
    }
  }
}

if (dev) {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

module.exports.handler = serverless(app);
