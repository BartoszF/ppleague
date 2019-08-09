create TABLE IF NOT EXISTS match
(
  ID             SERIAL PRIMARY KEY,
  player_a       INTEGER REFERENCES player (ID),
  player_b       INTEGER REFERENCES player (ID),
  player_a_score INTEGER NOT NULL,
  player_b_score INTEGER NOT NULL,
  date           TIMESTAMP
);