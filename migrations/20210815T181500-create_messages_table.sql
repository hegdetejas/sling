create table messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel_id INT,
  message_body VARCHAR(8000),
  user_token VARCHAR(60)
);