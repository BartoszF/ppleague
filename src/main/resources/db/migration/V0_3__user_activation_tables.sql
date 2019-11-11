create TABLE IF NOT EXISTS user_activation (
    ID serial PRIMARY KEY,
    activation_key varchar(255) NOT NULL UNIQUE,
    user_id integer REFERENCES users(id),
    date timestamp
);