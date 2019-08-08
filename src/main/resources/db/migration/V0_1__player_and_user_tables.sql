CREATE TABLE users
(
  ID       serial PRIMARY KEY,
  username VARCHAR(120)            NOT NULL UNIQUE,
  password text,
  email    VARCHAR_IGNORECASE(200) NOT NULL UNIQUE
);

CREATE TABLE player
(
  ID         serial PRIMARY KEY,
  user_id    integer references users (ID),
  rating     double,
  deviation  double,
  volatility double,
);