const { Sequelize, Op, Model, DataTypes }  = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL);

/**
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(10) NULL,
    nickname VARCHAR(100) NULL,
    address1 VARCHAR(100) NULL,
    address2 VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    zip VARCHAR(100) NULL,
    phone VARCHAR(100) NULL,
    email VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id ASC),
    UNIQUE INDEX users_email_key (email ASC),
    UNIQUE INDEX users_user_name_key (user_name ASC)
 */
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  suffix: {
    type: DataTypes.STRING
  },
  nickname: {
    type: DataTypes.STRING
  },
  address1: {
    type: DataTypes.STRING
  },
  address2: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  zip: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});

/**
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    tournament_id UUID NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT games_pkey PRIMARY KEY (id ASC),
    CONSTRAINT games_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
    CONSTRAINT games_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
 */

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  tournamentId: {
    type: DataTypes.UUID
  },
  winnerId: {
    type: DataTypes.UUID
  },
  createdBy: {
    type: DataTypes.UUID
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  },
  completedAt: {
    type: DataTypes.DATE
  }
});

/**
    id UUID NOT NULL,
    game_id UUID NULL,
    player_id UUID NULL,
    score INT8 NOT NULL DEFAULT 0:::INT8,
    created_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    CONSTRAINT game_score_pkey PRIMARY KEY (id ASC),
    CONSTRAINT game_score_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
    CONSTRAINT game_score_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id)
 */
const GameScore = sequelize.define('GameScore', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.UUID
  },
  playerId: {
    type: DataTypes.UUID
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});

/**
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_id UUID NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    winner_id UUID NULL,
    CONSTRAINT players_pkey PRIMARY KEY (id ASC),
    CONSTRAINT players_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
    CONSTRAINT players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT players_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.players(id)
 */
const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
});

/**
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    date DATE NULL,
    venue VARCHAR(100) NULL,
    num_game INT8 NULL DEFAULT 1:::INT8,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT now():::TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT tournaments_pkey PRIMARY KEY (id ASC),
    CONSTRAINT tournaments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
    CONSTRAINT check_num_game_num_game CHECK ((num_game > 0:::INT8) AND (num_game < 100:::INT8))
 */
const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE
  },
  venue: {
    type: DataTypes.STRING
  },
  numGames: {
    type: DataTypes.INTEGER
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  },
  completedAt: {
    type: DataTypes.DATE
  }
});

module.exports = { User, Game, GameScore, Player, Tournament }
