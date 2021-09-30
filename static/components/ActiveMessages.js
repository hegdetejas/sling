import MessagesMain from './MessagesMain.js';
import MessageBox from './MessageBox.js';
import SendMessage from './SendMessage.js';
import DeleteButton from './DeleteButton.js';


class ActiveMessages extends React.Component {
  sendMessage() {
    var message = document.getElementById('message').value;
    if (message != '') {
      var data = {
        'userToken': localStorage.getItem('userToken'),
        'message': message,
        'channelId': this.props.channelId
      };
      fetch("/api/sendMessage", {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data)
      }).then((response) => {
        if (response.status == 200) {
          return response.json().then((json) => {
            document.getElementById('message').value = '';
          });
        } else {
          this.props.logoutHandler();
        }
      })
    }
  }

  render() {
    return (
      <div>
        <div className="hMessagesHeader">
          <div>
            # {this.props.channelName}
          </div>
          <div>
            Created By: {this.props.creatorUsername}
          </div>
          <DeleteButton
            creatorToken={this.props.creatorToken}
            channelId={this.props.channelId}
            logoutHandler={() => this.props.logoutHandler()}
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            updateChannelBeingDeleted={(bool) => this.props.updateChannelBeingDeleted(bool)}
          />
        </div>
        <hr />
        <div className="hMessagesMain">
          <MessagesMain
            messages={this.props.messages}
            openThread={(chatId, messageId) => this.props.openThread(chatId, messageId)}
          />
        </div>
        <div className="hMessagesBox">
          <MessageBox
            channelName={this.props.channelName}
            sendMessage={() => this.sendMessage()}
          />
          <SendMessage
            channelId={this.props.channelId}
            sendMessage={() => this.sendMessage()}
          />
        </div>
      </div>
    );
  }
}


export default ActiveMessages;
