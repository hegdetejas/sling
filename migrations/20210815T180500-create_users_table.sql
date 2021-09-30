create table users (
  email VARCHAR(40) PRIMARY KEY,
  username VARCHAR(40),
  password VARCHAR(60),
  user_token VARCHAR(60)
);

CREATE INDEX user_token_index ON users (user_token);