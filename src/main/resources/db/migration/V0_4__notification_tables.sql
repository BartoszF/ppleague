create TABLE IF NOT EXISTS notification
(
  ID         serial PRIMARY KEY,
  actor_id    integer references user (ID),
  notifier_id integer references user (ID),
  event_type integer,
  event_target_id integer,
  seen boolean,
  date timestamp
);