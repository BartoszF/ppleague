create TABLE IF NOT EXISTS event
(
  ID            serial PRIMARY KEY,
  name          varchar(200),
  description   text,
  creator       integer references users (ID),
  type          integer,
  target_id     integer,
  is_public     boolean,
  creation_date timestamp,
  end_date      timestamp
);

create TABLE IF NOT EXISTS event_participant
(
  ID    serial PRIMARY KEY,
  user_id  integer references users (ID),
  event integer references event (ID)
);

create TABLE IF NOT EXISTS event_message
(
  ID      serial PRIMARY KEY,
  event   integer references event (ID),
  title   varchar(150),
  message text,
  date    timestamp
);

create TABLE IF NOT EXISTS event_group
(
  ID    serial PRIMARY KEY,
  event integer references event (ID),
  name  varchar(50)
);

create TABLE IF NOT EXISTS event_group_participant
(
  ID          serial PRIMARY KEY,
  event_group integer references event_group (ID),
  player      integer references player (ID)
);

create TABLE IF NOT EXISTS event_matches
(
  ID             SERIAL PRIMARY KEY,
  event          INTEGER REFERENCES event (ID),
  player_a       INTEGER REFERENCES player (ID),
  player_b       INTEGER REFERENCES player (ID),
  player_a_score INTEGER NOT NULL,
  player_b_score INTEGER NOT NULL,
  date           TIMESTAMP
)

