import Home from "./pages/Home.js";
import LoginPage from "./pages/LoginPage.js";


class App extends React.Component {
  constructor(props) {
    super(props);

    var userToken = localStorage.getItem('userToken');
    if (userToken) {
      var persistedLogIn = true;
      var username = localStorage.getItem('username');
    } else {
      var persistedLogIn = false;
      var username = null;
    }

    this.state = {
      isLoggedIn: persistedLogIn,
      username: username,
      channelId: null,
      messageId: null,
      renderMessages: 'false',
      thread: false,
      channelBeingDeleted: false
    }
  }

  componentDidMount() {
    this.handleState();

    window.addEventListener("popstate", () => {
      this.handleState()
    });
  }

  handleState() {
    var pathArray = window.location.pathname.split('/');
    var pathname = document.location.pathname;
    if (pathname.startsWith('/chat/') && pathname.indexOf('/message/') === -1) {
      this.updateChannel(pathArray[2]);
    } else if (pathname === '' || pathname === '/') {
      this.updateRenderMessage('false');
      this.updateChannel(null);
    } else if (pathname.startsWith('/chat/') && pathname.indexOf('/message/')) {
      this.openThread(pathArray[2], pathArray[4]);
    } else {
      this.handleLogout();
    }
  }

  updateChannelBeingDeleted(bool) {
    this.setState({channelBeingDeleted: bool});
  }

  updateChannel(id) {
    this.setState({channelId: id});
    if (id) {
      this.updateRenderMessage('true');
      history.pushState({}, "chat" + id, "/chat/" + id);
    } else {
      this.updateRenderMessage('false');
      history.pushState({}, "Home", "/");
    }
  }

  updateRenderMessage(value) {
    this.setState({renderMessages: value});
  }

  openThread(chatId, messageId) {
    var pathArray = window.location.pathname.split('/');
    var pathname = document.location.pathname;
    var chatId = pathArray[2]
    this.updateChannel(chatId);
    this.setState({thread: true});
    history.pushState({}, "Thread", "/chat/" + chatId + "/message/" + messageId);
  }

  closeThread() {
    this.setState({thread: false});
    var pathArray = window.location.pathname.split('/');
    var pathname = document.location.pathname;
    var chatId = pathArray[2]
    this.updateChannel(chatId);
  }

  handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    history.pushState({}, 'Login', '/login');
    this.setState({
      isLoggedIn: false,
      username: null,
      channelId: null,
      messageId: null,
      thread: false,
      renderMessages: 'false'
    });
  }

  handleLogin(userToken, username) {
    localStorage.setItem('userToken', userToken);
    localStorage.setItem('username', username);
    this.setState({isLoggedIn: true, username: username});
    history.pushState({}, "Home", "/");
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <Home
          userToken={localStorage.getItem('userToken')}
          username={localStorage.getItem('username')}
          loginHandler={(userToken, username) => this.handleLogin(userToken, username)}
          logoutHandler={() => this.handleLogout()}
          updateChannel={(channelId) => this.updateChannel(channelId)}
          channelId={this.state.channelId}
          updateRenderMessage={(value) => this.updateRenderMessage(value)}
          renderMessages={this.state.renderMessages}
          channelName={this.state.channelName}
          messages={this.state.messages}
          creatorToken={this.state.creatorToken}
          creatorUsername={this.state.creatorUsername}
          thread={this.state.thread}
          openThread={(chatId, messageId) => this.openThread(chatId, messageId)}
          closeThread={() => this.closeThread()}
          threadReplies={this.state.threadReplies}
          threadOriginalMessage={this.state.threadOriginalMessage}
          channelBeingDeleted={this.state.channelBeingDeleted}
          updateChannelBeingDeleted={(bool) => this.updateChannelBeingDeleted(bool)}
        />
      );
    } else {
      return (
        <LoginPage loginHandler={(userToken, username) => this.handleLogin(userToken, username)}/>
      );
    }
  }
}




// --------------------------------------------------------------------------------
ReactDOM.render (
  React.createElement(App),
  document.getElementById('root')
);
