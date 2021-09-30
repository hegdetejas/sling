import Unread from './Unread.js';


class ChannelListComponent extends React.Component {
  goToChannel(id) {
    console.log(id);
    this.props.closeThread();
    this.props.updateChannel(id);
  }

  render() {
    return (
      <div className="hChannelComponent" onClick={() => this.goToChannel(this.props.id)}>
        <div className="hChannelName">
          # {this.props.name}
        </div>
        <Unread
          unread={this.props.unread}
        />
      </div>
    );
  }
}


export default ChannelListComponent;
