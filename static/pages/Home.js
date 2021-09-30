import HeaderBar from '../components/HeaderBar.js';
import Main from '../components/Main.js';


class Home extends React.Component {
  render() {
    return (
      <div>
        <HeaderBar
          username={this.props.username}
          loginHandler={(userToken, username) => this.props.loginHandler(userToken, username)}
          logoutHandler={() => this.props.logoutHandler()}
          updateChannel={(channelId) => this.props.updateChannel(channelId)}
          updateRenderMessage={(value) => this.props.updateRenderMessage(value)}
          closeThread={() => this.props.closeThread()}
        />
        <hr className="hTopBreak" />
        <Main
          logoutHandler={() => this.props.logoutHandler()}
          updateChannel={(channelId) => this.props.updateChannel(channelId)}
          channelId={this.props.channelId}
          renderMessages={this.props.renderMessages}
          updateRenderMessage={(value) => this.props.updateRenderMessage(value)}
          thread={this.props.thread}
          openThread={(chatId, messageId) => this.props.openThread(chatId, messageId)}
          closeThread={() => this.props.closeThread()}
          threadReplies={this.props.threadReplies}
          threadOriginalMessage={this.props.threadOriginalMessage}
          mounted={this.props.mounted}
          channelBeingDeleted={this.props.channelBeingDeleted}
          updateChannelBeingDeleted={(bool) => this.props.updateChannelBeingDeleted(bool)}
        />
      </div>
    )
  }
}


export default Home;
