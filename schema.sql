DROP TABLE IF EXISTS food_drinks;
DROP TABLE IF EXISTS getting_arounds;
DROP TABLE IF EXISTS meeting_peoples;

CREATE TABLE food_drinks (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
description TEXT,
features TEXT,
author VARCHAR(255),
timestamp timestamp default current_timestamp 
);

CREATE TABLE getting_arounds (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
description TEXT,
features TEXT,
author VARCHAR(255),
timestamp timestamp default current_timestamp
);

CREATE TABLE meeting_peoples (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
description TEXT,
features TEXT,
author VARCHAR(255),
timestamp timestamp default current_timestamp
);

