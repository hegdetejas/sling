import ChannelListComponent from './ChannelListComponent';


class ChannelListFeed extends React.Component {
  render() {
    const channelsList = this.props.activeChannels.map((item) =>
      <ChannelListComponent
        key={"channel_" + item.id}
        name={item.name}
        creator={item.creator}
        id={item.id}
        unread={item.unread}
        updateChannel={() => this.props.updateChannel(item.id)}
        closeThread={() => this.props.closeThread()}
      />
    );

    return (
      <div className="hChannelsListFeed">
        {channelsList}
      </div>
    );
  }
}


export default ChannelListFeed;
