from flask import Flask, render_template, request, jsonify
from functools import wraps

import uuid
import bcrypt
import configparser
import mysql.connector

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

config = configparser.ConfigParser()
config.read('secrets.cfg')
DB_NAME = 'slingmessaging'
DB_USERNAME = config['secrets']['DB_USERNAME']
DB_PASSWORD = config['secrets']['DB_PASSWORD']
PEPPER = config['secrets']['PEPPER']

@app.route('/')
@app.route('/home')
@app.route('/login')
@app.route('/chat/<int:chat_id>')
@app.route('/chat/<int:chat_id>/message/<int:message_id>')
def index(chat_id=None, message_id=None):
  return app.send_static_file('index.html')



# API ROUTES
@app.route('/api/signup', methods=['POST'])
def signup():
  response = request.get_json()
  username = response['username']
  email = response['email']
  password = (response['password'] + PEPPER).encode('utf-8')
  user_token = str(uuid.uuid1())

  hashed = bcrypt.hashpw(password, bcrypt.gensalt())

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  query = "INSERT into users (email, username, password, user_token) VALUES (%s, %s, %s, %s)"

  try:
    cursor.execute(query, (email, username, hashed, user_token))
    connection.commit()
    # 200 - Success
    return {'userToken': user_token}, 200
  except Exception as e:
    print(e)
    # 409 - Conflicting Resources
    return {}, 409


@app.route('/api/login', methods=['POST'])
def login():
  response = request.get_json()
  email = response['email']
  password = (response['password'] + PEPPER).encode('utf-8')

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  query = "SELECT password, username, user_token FROM users WHERE email=%s"

  try:
    cursor.execute(query, (email,))
    sql_response = cursor.fetchall()
    hashed = (sql_response[0][0]).encode('utf-8')
    username = sql_response[0][1]
    user_token = sql_response[0][2]

    if bcrypt.checkpw(password, hashed):
      # 200 - Success
      return {'userToken': user_token, 'username': username}, 200
    else:
      # 401 - Unauthorized Client
      return {}, 401
  except TypeError as e:
    print(e)
    # 401 - Unauthorized Client
    return {}, 401
  except IndexError as e:
    print(e)
    # 401 - Unauthorized Client
    return {}, 401
  except Exception as e:
    print(e)
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/createChannel", methods=['POST'])
def create_channel():
  response = request.get_json()
  user_token = response['userToken']
  channel_name = response['channelName']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  get_channel_number_query = "SELECT next_channel FROM config"
  query = "INSERT INTO channels (id, name, creator_token) VALUES (%s, %s, %s)"
  update_channel_query = "UPDATE config SET next_channel=%s"

  try:
    cursor.execute(get_channel_number_query)
    connection.commit()
    sql_response = cursor.fetchall()

    next_channel = sql_response[0][0]

    cursor.execute(query, (int(next_channel), channel_name, user_token))
    connection.commit()

    next_channel = int(next_channel) + 1
    cursor.execute(update_channel_query, (next_channel,))
    connection.commit()

  except Exception as e:
    print(e)
    # 409 - Conflicting Resources
    return {}, 409

  return {}, 200


@app.route("/api/getChannels", methods=['POST'])
def get_channels():
  response = request.get_json()
  user_token = response['userToken']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  query = "SELECT * FROM channels"
  get_max_channel_query = "SELECT id FROM channels ORDER BY id"
  get_last_message_query = "SELECT last_message_id FROM channel_user_map WHERE channel_id=%s AND user_token=%s"
  get_unread_query = "SELECT id FROM messages WHERE channel_id=%s ORDER BY id"

  try:
    cursor.execute(query)
    connection.commit()
    sql_response = cursor.fetchall()
    data = []

    for i in range(len(sql_response)):
      row = {
        'id': sql_response[i][0],
        'name': sql_response[i][1],
        'creator': sql_response[i][2]
      }
      data.append(row)

    cursor.execute(get_max_channel_query)
    connection.commit()
    channel_sql_response = cursor.fetchall()
    num_rows = len(channel_sql_response)

    unread = []
    
    for j in range(num_rows):
      channel_id = channel_sql_response[j][0]
      cursor.execute(get_last_message_query, (channel_id, user_token))
      connection.commit()
      sql_response = cursor.fetchall()
      if len(sql_response) == 0:
        last_message_id = -1
      else:
        last_message_id = sql_response[0][0]

      cursor.execute(get_unread_query, (channel_id,))
      connection.commit()
      sql_response = cursor.fetchall()

      if last_message_id == -1:
        unread_j = len(sql_response)
      else:
        for k in range(len(sql_response)):
          if sql_response[k][0] == last_message_id:
            unread_j = len(sql_response) - (k + 1)

      unread.append(unread_j)

    for l in range(len(data)):
      data[l]['unread'] = unread[l]

    return {'data': data}, 200

  except Exception as e:
    print(e)
    # 401 - Unauthorized Client
    return {}, 401


@app.route("/api/getUser", methods=['POST'])
def get_user():
  response = request.get_json()
  channel_id = response['channelId']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  get_creator_token_query = "SELECT creator_token FROM channels WHERE id=%s"
  get_user_query = "SELECT username FROM users WHERE user_token=%s"

  try:
    cursor.execute(get_creator_token_query, (channel_id,))
    connection.commit()
    sql_response = cursor.fetchall()

    user_token = sql_response[0][0]

    cursor.execute(get_user_query, (user_token,))
    connection.commit()
    sql_response = cursor.fetchall()

    username = sql_response[0][0]

    return {'data': username}, 200
  except Exception as e:
    print(e)
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/getMessages", methods=['POST'])
def get_messages():
  response = request.get_json()
  user_token = response['userToken']
  chat_id = response['chatId']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  query = "SELECT id, channel_id, message_body, user_token FROM messages WHERE channel_id=%s"
  authenticate_query = "SELECT username FROM users WHERE user_token=%s"
  channel_query = "SELECT name, creator_token FROM channels WHERE id=%s"
  check_to_update_query = "SELECT last_message_id FROM channel_user_map WHERE user_token=%s AND channel_id=%s"
  update_last_message_id_query = "UPDATE channel_user_map SET last_message_id=%s WHERE user_token=%s AND channel_id=%s"
  username_query = "SELECT username FROM users WHERE user_token=%s"
  reply_query = "SELECT id FROM replies WHERE message_id=%s"
  last_read_query = "INSERT INTO channel_user_map (channel_id, user_token, last_message_id) VALUES (%s, %s, %s)"

  try:
    cursor.execute(authenticate_query, (user_token,))
    connection.commit()
    authenticate_user_response = cursor.fetchall()
    if len(authenticate_user_response) == 0:
      # 401 - Unauthorized Client
      return {}, 401
    cursor.execute(query, (chat_id,))
    connection.commit()
    sql_response = cursor.fetchall()

    cursor.execute(channel_query, (chat_id,))
    connection.commit()
    creator_sql_response = cursor.fetchall()

    if len(creator_sql_response) == 0:
      return {}, 404
    else:
      channel_name = creator_sql_response[0][0]
      creator_token = creator_sql_response[0][1]
      cursor.execute(username_query, (creator_token,))
      connection.commit()
      username_sql_response = cursor.fetchall()
      if len(username_sql_response) == 0:
        return {}, 404
      else:
        creator_username = username_sql_response[0][0]

    data = []
    max_message_id = -1

    for i in range(len(sql_response)):
      if sql_response[i][0] > max_message_id:
        max_message_id = sql_response[i][0]
      cursor.execute(username_query, (sql_response[i][3],))
      connection.commit()
      username_sql_response = cursor.fetchall()
      if len(sql_response) == 0:
        return {}, 404
      else:
        username = username_sql_response[0][0]

      cursor.execute(reply_query, (sql_response[i][0],))
      connection.commit()
      reply_sql_response = cursor.fetchall()
      number_of_replies = len(reply_sql_response)
      message_body = sql_response[i][2]
      crafted_message_body = ''
      crafted_message = ''
      start_index_http = 0
      start_index_https = 0
      url_array = []
      try:
        while start_index_http < len(message_body):
          http_index = message_body.index('http://', start_index_http)
          for j in range(http_index, len(message_body)):
            if message_body[j] == ' ' or j == len(message_body) - 1:
              http_end = j + 1
              break
          if j == len(message_body) - 1:
            substring_url = message_body[http_index:http_end + 1]
            crafted_message_body += message_body[start_index_http:http_index]
            crafted_message_body += message_body[http_end + 1:len(message_body)]
          else:
            substring_url = message_body[http_index:http_end]
            crafted_message_body += message_body[start_index_http:http_index]
          url_array.append(substring_url.strip())
          start_index_http = http_end
      except ValueError as e:
        crafted_message_body += message_body[start_index_http:]

      try:
        while start_index_https < len(crafted_message_body):
          https_index = crafted_message_body.index('https://', start_index_https)
          for k in range(https_index, len(crafted_message_body)):
            if crafted_message_body[k] == ' ' or k == len(crafted_message_body) - 1:
              https_end = k + 1
              break
          if k == len(crafted_message_body) - 1:
            https_substring_url = crafted_message_body[https_index:https_end + 1]
            crafted_message += crafted_message_body[start_index_https:https_index]
            crafted_message += crafted_message_body[https_end + 1:len(crafted_message_body)]
          else:
            https_substring_url = crafted_message_body[https_index:https_end]
            crafted_message += crafted_message_body[start_index_https:https_index]
          url_array.append(https_substring_url.strip())
          start_index_https = https_end
      except ValueError as e:
        crafted_message += crafted_message_body[start_index_https:]

      row = {
        'id': sql_response[i][0],
        'channel_id': sql_response[i][1],
        'message_body': crafted_message,
        'username': username,
        'urls': url_array,
        'number_of_replies': number_of_replies
      }
      data.append(row)
    
    if max_message_id != -1:
      cursor.execute(check_to_update_query, (user_token, chat_id))
      connection.commit()
      check_to_update_sql = cursor.fetchall()
      if len(check_to_update_sql) == 0:
        cursor.execute(last_read_query, (chat_id, user_token, max_message_id))
        connection.commit()
      else:
        cursor.execute(update_last_message_id_query, (max_message_id, user_token, chat_id))
        connection.commit()

    return {'data': data, 'creatorUsername': creator_username, 'creatorToken': creator_token, 'channelName': channel_name}, 200
  except Exception as e:
    print(e)
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/sendMessage", methods=['POST'])
def send_message():
  response = request.get_json()
  user_token = response['userToken']
  message = response['message']
  channel_id = response['channelId']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  authenticate_user_query = "SELECT username FROM users WHERE user_token=%s"
  query = "INSERT INTO messages (channel_id, message_body, user_token) VALUES (%s, %s, %s)"

  try:
    cursor.execute(authenticate_user_query, (user_token,))
    connection.commit()
    authenticate_user_response = cursor.fetchall()

    if len(authenticate_user_response) == 0:
      # 401 - Unauthorized Client
      return {}, 401
    else:
      cursor.execute(query, (channel_id, message, user_token))
      connection.commit()
      return {}, 200
  except Exception as e:
    print(e)
    # 401 - Unauthorized Client
    return {}, 401


@app.route("/api/getReplies", methods=['POST'])
def get_replies():
  response = request.get_json()
  user_token = response['userToken']
  channel_id = response['chatId']
  message_id = response['messageId']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  authenticate_query = "SELECT username FROM users WHERE user_token=%s"
  message_query = "SELECT user_token, message_body FROM messages WHERE id=%s"
  query = "SELECT reply_body, user_token, id FROM replies WHERE message_id=%s ORDER BY id DESC"

  replies = []

  try:
    # Authenticate user
    cursor.execute(authenticate_query, (user_token,))
    connection.commit()
    username_sql_response = cursor.fetchall()
    if len(username_sql_response) == 0:
      # 401 - Unauthorized Client
      return {}, 401
    username = username_sql_response[0][0]

    # Get message
    cursor.execute(message_query, (message_id,))
    connection.commit()
    message_sql_response = cursor.fetchall()
    # Message with id not found
    if len(message_sql_response) == 0:
      # 404 - Resource Not Found
      return {}, 404
    
    user_token = message_sql_response[0][0]

    cursor.execute(authenticate_query, (user_token,))
    connection.commit()
    username_sql_response = cursor.fetchall()
    username = username_sql_response[0][0]
    message_body = message_sql_response[0][1]

    original_message = {
      'message_id': message_id,
      'username': username,
      'message_body': message_body
    }

    cursor.execute(query, (message_id,))
    connection.commit()
    sql_response = cursor.fetchall()
    if len(sql_response) != 0:
      for i in range(len(sql_response)):
        user_token = sql_response[i][1]
        cursor.execute(authenticate_query, (user_token,))
        connection.commit()
        username_reply_sql_response = cursor.fetchall()
        reply_username = username_reply_sql_response[0][0]
        row = {
          'reply_username': reply_username,
          'reply_body': sql_response[i][0],
          'id': sql_response[i][2]
        }

        replies.append(row)

    return {'data': replies, 'original_message': original_message}, 200
  except Exception as e:
    print(e)
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/sendReply", methods=['POST'])
def send_reply():
  response = request.get_json()
  user_token = response['userToken']
  message_id = response['messageId']
  reply_body = response['replyBody']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  authenticate_query = "SELECT username FROM users WHERE user_token=%s"
  query = "INSERT INTO replies (message_id, reply_body, user_token) VALUES (%s, %s, %s)"

  try:
    cursor.execute(authenticate_query, (user_token,))
    connection.commit()
    authenticate_sql_response = cursor.fetchall()
    if len(authenticate_sql_response) == 0:
      # 401 - Unauthorized Client
      return {}, 401

    cursor.execute(query, (message_id, reply_body, user_token))
    connection.commit()
    return {}, 200
  except:
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/validateChannel", methods=['POST'])
def validate_channel():
  response = request.get_json()
  channel_id = response['chatId']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  query = "SELECT * FROM channels WHERE id=%s"

  try:
    cursor.execute(query, (channel_id,))
    connection.commit()
    validate_sql_response = cursor.fetchall()
    if len(validate_sql_response) == 0:
      # 404 - Resource Not Found
      return {}, 404
    else:
      # 200 - Success
      return {}, 200
  except:
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/deleteChannel", methods=['POST'])
def delete_channel():
  response = request.get_json()
  channel_id = response['channelId']
  user_token = response['userToken']

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  authenticate_query = "SELECT id FROM channels WHERE creator_token=%s"
  query = "DELETE FROM channels WHERE id=%s"

  try:
    cursor.execute(authenticate_query, (user_token,))
    connection.commit()
    authenticate_sql_response = cursor.fetchall()
    if len(authenticate_sql_response) == 0:
      # 401 - Unauthorized Client
      return {}, 401
    else:
      created_channels = []
      for i in range(len(authenticate_sql_response)):
        created_channels.append(int(authenticate_sql_response[i][0]))

      if int(channel_id) in created_channels:
        cursor.execute(query, (channel_id,))
        connection.commit()

        # 200 - Success
        return {}, 200
      else:
        # 401 - Unauthorized Client
        return {}, 401
  except:
    # 404 - Resource Not Found
    return {}, 404


@app.route("/api/updateUser", methods=['POST'])
def update_user():
  response = request.get_json()
  user_token = response['userToken']
  username = response['username']
  email = response['email']
  password = (response['password'] + PEPPER).encode('utf-8')

  hashed = bcrypt.hashpw(password, bcrypt.gensalt())

  connection = mysql.connector.connect(user=DB_USERNAME, database=DB_NAME, password=DB_PASSWORD)
  cursor = connection.cursor(buffered=True)

  get_current_user_query = "SELECT email, username, password FROM users WHERE user_token=%s"
  update_user_query = "UPDATE users SET email=%s, username=%s, password=%s WHERE user_token=%s"

  try:
    cursor.execute(get_current_user_query, (user_token,))
    connection.commit()
    current_user_sql_response = cursor.fetchall()
    if len(current_user_sql_response) == 0:
      return {}, 401

    cursor.execute(update_user_query, (email, username, hashed, user_token))
    connection.commit()
    return {'userToken': user_token}, 200
  except Exception as e:
    print(e)
    # 409 - Conflicting Resources
    return {}, 409
    




# ------------------------------------------------- DRIVER CODE -------------------------------------------------
if __name__ == '__main__':
  app.run(debug = True, host = '0.0.0.0')