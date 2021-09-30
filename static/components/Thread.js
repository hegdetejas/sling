import ThreadOriginalMessage from './ThreadOriginalMessage.js';
import ThreadReplies from './ThreadReplies.js';
import ReplyBox from './ReplyBox.js';
import SendReply from './SendReply.js';


class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threadOriginalMessage: null,
      threadReplies: Array()
    }
  }

  sendReply() {
    var reply = document.getElementById('reply').value;
    if (reply != '') {
      var data = {
        'userToken': localStorage.getItem('userToken'),
        'messageId': this.state.threadOriginalMessage.message_id,
        'replyBody': reply
      };
      fetch("/api/sendReply", {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data)
      }).then((response) => {
        if (response.status == 200) {
          return response.json().then((json) => {
            document.getElementById('reply').value = '';
          })
        } else {
          this.props.logoutHandler();
        }
      })
    }
  }

  componentDidMount() {
    var pathArray = window.location.pathname.split('/');
    var chatId = pathArray[2];
    var messageId = pathArray[4];
    this.mounted = true;
    this.getRepliesAsync(chatId, messageId)
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async getRepliesAsync(chatId, messageId) {
    var pathArray = window.location.pathname.split('/');
    var chatId = pathArray[2];
    var messageId = pathArray[4];
    let replies = await this.getReplies(chatId, messageId);
    setTimeout(() => {
      if (this.mounted) {
        this.getRepliesAsync(chatId, messageId);
      }
    }, 300);
  }

  getReplies(chatId, messageId) {
    var data = {
      'userToken': localStorage.getItem('userToken'),
      'chatId': chatId,
      'messageId': messageId
    }
    fetch("/api/getReplies", {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.status === 200) {
        return response.json().then((json) => {
          this.setState({threadReplies: json['data']});
          this.setState({threadOriginalMessage: json['original_message']})
        })
      } else {
        // Unauthorized Client
        this.props.logoutHandler();
      }
    })
  }

  render() {
    return (
      <div className="tThread">
        <div className="tThreadHeader">
          <div className="tThreadTitle">
            Thread
          </div>
          <div className="tClosebtn" onClick={() => this.props.closeThread()}>
            &times;
          </div>
        </div>
        <hr className="tThreadHR"/>
        <ThreadOriginalMessage threadOriginalMessage={this.state.threadOriginalMessage} />
        <hr className="tThreadSecondHR"/>
        <ThreadReplies threadReplies={this.state.threadReplies} />
        <div className="tReplyBox">
          <ReplyBox sendReply={() => this.sendReply()} />
          <SendReply sendReply={() => this.sendReply()} />
        </div>
      </div>
    )
  }
}


export default Thread;
