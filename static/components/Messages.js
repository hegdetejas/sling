import ActiveMessages from './ActiveMessages.js'


class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: Array(),
      channelName: null,
      creatorToken: null,
      creatorUsername: null,
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.getMessagesLoop()
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async getMessagesLoop() {
    if (this.props.channelId && !this.props.channelBeingDeleted) {
      let messages = await this.getMessages()
    }
    setTimeout(() => {
      if (this.mounted) {
        this.getMessagesLoop()
      } else {
        return;
      }
    }, 300);
  }

  getMessages() {
    var data = {'userToken': localStorage.getItem('userToken'), 'chatId': this.props.channelId};
    fetch("/api/getMessages", {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        this.props.logoutHandler();
        throw 'User is not logged in';
      }
    })
    .then((json) => {
      if (this.mounted) {
        var pathname = document.location.pathname;
        if (pathname.startsWith('/chat/')) {
          this.props.updateRenderMessage('true');
          this.setState({
            messages: json['data'],
            creatorToken: json['creatorToken'],
            creatorUsername: json['creatorUsername'],
            channelName: json['channelName'],
          });
        }
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  render() {
    if (this.props.renderMessages === 'loading') {
      return (
        <div className="hMessages">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      );
    } else if (this.props.renderMessages === 'false') {
      return (
        <div className="hMessages">
          <h1 className="hNoChannelSelected">Select a Channel to get started!</h1>
        </div>
      );
    } else {
      return (
        <div>
          <ActiveMessages
            channelName={this.state.channelName}
            logoutHandler={() => this.props.logoutHandler()}
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            channelId={this.props.channelId}
            messages={this.state.messages}
            creatorUsername={this.state.creatorUsername}
            creatorToken={this.state.creatorToken}
            openThread={(chatId, messageId) => this.props.openThread(chatId, messageId)}
            updateChannelBeingDeleted={(bool) => this.props.updateChannelBeingDeleted(bool)}
          />
        </div>
      );
    }
  }
}


export default Messages;
