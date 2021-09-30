import AlreadyExists from "./AlreadyExists.js"


class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyExists: false
    }
  }

  executeCreate() {
    var channelName = document.getElementById('channelName').value;
    if (channelName != "") {
      var userToken = localStorage.getItem('userToken');
      var data = {'userToken': userToken, 'channelName': channelName}

      let createChannelHeader = new Headers()
      createChannelHeader.append('Accept', 'application/json');
      createChannelHeader.append('Content-Type', 'application/json');

      const initCreateChat = {
        method: 'POST',
        headers: createChannelHeader,
        body: JSON.stringify(data),
      }

      let request = fetch("/api/createChannel", initCreateChat)

      request.then((response) => {
        if (response.status === 200) {
          // SUCCESSFUL
          return response.json().then((json) => {
            document.getElementById('channelName').value = '';
            document.getElementById("createNav").style.height = "0%";
            return json;
          })
        } else if (response.status === 409) {
          this.setState({alreadyExists: true});
          setTimeout(() => {
            this.setState({alreadyExists: false});
          }, 4000);
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h1 className="hChannelTitle">Channel Name: </h1>
        <input className="hCreateChannelInput" id="channelName" type="text" name="channelName" required></input>
        <button className="hCreateButton" onClick={() => this.executeCreate()}>Create Channel</button>
        <AlreadyExists alreadyExists={this.state.alreadyExists}/>
      </div>
    );
  }
}


export default Popup;
