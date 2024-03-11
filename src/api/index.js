const express = require("express");
const serverless = require("serverless-http");
const { Client } = require('pg');
const { Sequelize, Op, Model, DataTypes }  = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL);


const app = express();
const port = 3000;

const dev = process.env.NODE_ENV !== "production";

app.use(express.json());

if (dev) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })()
}

// Public API
//---------------------------

app.get("/users", async (req, res) => {
  await queries.getUsers(req, res);
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
