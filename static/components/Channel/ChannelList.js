import ChannelListFeed from './ChannelListFeed.js';


class ChannelList extends React.Component {
  render() {
    if (this.props.renderList) {
      return (
        <div className="hChannelsList">
          <ChannelListFeed
            activeChannels={this.props.activeChannels}
            updateChannel={(channelId) => this.props.updateChannel(channelId)}
            closeThread={() => this.props.closeThread()}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}


export default ChannelList;
