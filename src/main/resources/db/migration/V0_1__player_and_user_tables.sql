create TABLE IF NOT EXISTS users
(
  ID       serial PRIMARY KEY,
  username VARCHAR(120)            NOT NULL UNIQUE,
  password text,
  email    VARCHAR(200) NOT NULL UNIQUE,
  active boolean DEFAULT false
);

create TABLE IF NOT EXISTS player
(
  ID         serial PRIMARY KEY,
  user_id    integer references users (ID),
  rating     double precision,
  deviation  double precision,
  volatility double precision
);