create table channels (
  id INT PRIMARY KEY,
  name VARCHAR(60) UNIQUE,
  creator_token VARCHAR(60)
);