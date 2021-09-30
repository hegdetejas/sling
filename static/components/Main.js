import Channels from "./Channel/Channels.js";
import Messages from "./Messages.js";
import Thread from "./Thread.js";


class Main extends React.Component {
  render() {
    if (!this.props.thread) {
      return (
        <div className="hMainGrid">
          <Channels
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            closeThread={() => this.props.closeThread()}
          />
          <Messages
            logoutHandler={() => this.props.logoutHandler()}
            openThread={(chatId, messageId) => this.props.openThread(chatId, messageId)}
            channelId={this.props.channelId}
            renderMessages={this.props.renderMessages}
            updateRenderMessage={(value) => this.props.updateRenderMessage(value)}
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            channelBeingDeleted={this.props.channelBeingDeleted}
            updateChannelBeingDeleted={(bool) => this.props.updateChannelBeingDeleted(bool)}
          />
        </div>
      );
    } else {
      return (
        <div className="hMainGridThread">
          <Channels
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            closeThread={() => this.props.closeThread()}
          />
          <Messages
            logoutHandler={() => this.props.logoutHandler()}
            openThread={(chatId, messageId) => this.props.openThread(chatId, messageId)}
            channelId={this.props.channelId}
            renderMessages={this.props.renderMessages}
            updateRenderMessage={(value) => this.props.updateRenderMessage(value)}
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            channelBeingDeleted={this.props.channelBeingDeleted}
            updateChannelBeingDeleted={(bool) => this.props.updateChannelBeingDeleted(bool)}
          />
          <Thread
            closeThread={() => this.props.closeThread()}
            threadReplies={this.props.threadReplies}
            threadOriginalMessage={this.props.threadOriginalMessage}
            logoutHandler={() => this.props.logoutHandler()}
            channelId={this.props.channelId}
          />
        </div>
      );
    }
  }
}


export default Main;
