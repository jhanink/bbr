require('dotenv').config();
const { Sequelize, Op, Model, DataTypes }  = require('sequelize-cockroachdb');
require('dotenv').config();
const { User, Game, GameScore, Player, Tournament } = require('./models');

const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL, {quoteIdentifiers: false});

const query = async (dbHandler) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return await dbHandler();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

const db = {
  getUsers: async (params) => {
    return query (async () => {
      return await User.findAll(params);
    });
  },
  /**
   *
   * @param {*} option - {force: true} | {alter: true}
   */
  updateTables: async (option = {}) => {
    return query (async () => {
      await User.sync(option);
      await Game.sync(option);
      await GameScore.sync(option);
      await Player.sync(option);
      await Tournament.sync(option);
      if (option.force) {
        return await this.seed();
      }
    });
  },
  seedUser: async () => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      userName: 'johndoe',
      passwordHash: 'password'
    });
    return user;
  },
  seed: async () => {
    const user = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      userName: 'johndoe',
      passwordHash: 'password'
    });

    const game = await Game.create({
      createdBy: user.id
    });

    const player = await Player.create({
      gameId: game.id,
      name: 'John Doe'
    });

    const gameScore = await GameScore.create({
      gameId: game.id,
      playerId: player.id,
      score: 0
    });
  }
}

module.exports = { db };
