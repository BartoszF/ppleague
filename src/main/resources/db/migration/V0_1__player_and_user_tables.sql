create TABLE IF NOT EXISTS user
(
  ID       serial PRIMARY KEY,
  username VARCHAR(120)            NOT NULL UNIQUE,
  password text,
  email    VARCHAR_IGNORECASE(200) NOT NULL UNIQUE,
  active boolean DEFAULT false
);

create TABLE IF NOT EXISTS player
(
  ID         serial PRIMARY KEY,
  user_id    integer references user (ID),
  rating     double,
  deviation  double,
  volatility double,
);