/**
 * Billiards Battle Royale is a form of the pool game known as 3-strikes or baseball.
 * It is a turn-based game with any number of players.
 * The winner of the game is the last player remaining.
 * A player is eliminated from the game when they have accumulated 3 strikes.
 * The app lets players create and manage tournaments and track scores.
 * It provides a ranked leaderboard with Points and Rewards for the top players.
 */


/**
 * Table USERS
 * Registered users can create and manage
 * tournament and game.
 * NOTE: pluralized because 'user' is a reserved word...
*/
create table users (
    id UUID primary key DEFAULT uuid_generate_v4(),
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    suffix varchar(10),
    nickname varchar(100),
    address1 varchar(100),
    address2 varchar(100),
    city varchar(100),
    state varchar(100),
    zip varchar(100),
    phone varchar(100),
    email varchar(100) UNIQUE NOT NULL,
    user_name varchar(100) UNIQUE NOT NULL,
    password_hash varchar(100) NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

/**
 * A tournament is a series of games
 *
 */
create table tournaments (
  id UUID primary key DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  date date,
  venue varchar(100),
  num_game INT CHECK (num_game > 0 AND num_game < 100) DEFAULT 1,
  created_by UUID references users(id) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

/**
 * A game can be a single game or a series of games
 * belonging to a tournament
 */
create table games (
  id UUID primary key DEFAULT uuid_generate_v4(),
  tournament_id UUID references tournaments(id),
  created_by UUID references users(id) NOT NULL,
  winner_player UUID references players(id),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

/**
 * A player is a participant of a game.
 * A player can be a registered user
 */
create table players (
  id UUID primary key DEFAULT uuid_generate_v4(),
  game_id UUID references games(id) NOT NULL,
  name varchar(100) NOT NULL,
  user_id UUID references users(id),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  winner_id UUID references players(id)
);

create table game_score (
  id UUID primary key DEFAULT uuid_generate_v4(),
  game_id UUID references games(id),
  player_id UUID references players(id),
  score int NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
