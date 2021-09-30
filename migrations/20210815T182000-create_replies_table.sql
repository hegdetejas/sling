create table replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT,
  reply_body VARCHAR(8000),
  user_token VARCHAR(60)
);