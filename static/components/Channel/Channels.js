import CreatePopup from './CreatePopup.js';
import ChannelList from './ChannelList.js';


class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChannels: Array(),
      renderList: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.getChannelsLoop();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async getChannelsLoop() {
    let channels = await this.getChannels()
    setTimeout(() => {
      if (this.mounted) {
        this.getChannelsLoop()
      } else {
        return;
      }
    }, 300);
    this.displayChannels(this.state.activeChannels);
  }

  getChannels() {
    var data = {'userToken': localStorage.getItem('userToken')};
    fetch("/api/getChannels", {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.status == 200) {
        return response.json().then((json) => {
          if (this.mounted) {
            this.setState({activeChannels: json['data']});
          }
        });
      } else {
        throw "Failed to fetch posts"
      }
    })
    .catch((e) => console.log(e));
  }

  displayChannels(activeChannels) {
    if (this.mounted) {
      try {
        if (activeChannels.length === 0) {
          this.setState({renderList: false})
        } else {
          this.setState({renderList: true})
        }
      } catch(e) {
        console.log(e);
      }
    }
  }

  createChannel() {
    document.getElementById("createNav").style.height = "100%";
  }

  render() {
    if (this.state.activeChannels.length === 0) {
      return (
        <div className="hChannels">
          <div className="hChannelsHeader">
            <h1 className="hChannelsTitle">Channels</h1>
            <i  onClick={() => this.createChannel()} className="bi bi-plus-square hAddButton"></i>
          </div>
          <div className="hChannelsMainNoContent">
            <ChannelList
              renderList={this.state.renderList}
              activeChannels={this.state.activeChannels}
              closeThread={() => this.props.closeThread()}
            />
            <CreatePopup />
          </div>
        </div>
      )
    } else {
      return (
        <div className="hChannels">
          <div className="hChannelsHeader">
            <h1 className="hChannelsTitle">Channels</h1>
            <i  onClick={() => this.createChannel()} className="bi bi-plus-square hAddButton"></i>
          </div>
          <div className="hChannelsMain">
            <ChannelList
              renderList={this.state.renderList}
              activeChannels={this.state.activeChannels}
              updateChannel={(channelId) => this.props.updateChannel(channelId)}
              closeThread={() => this.props.closeThread()}
            />
            <CreatePopup />
          </div>
        </div>
      )
    }
  }
}


export default Channels;
