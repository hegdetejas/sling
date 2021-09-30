class DeleteButton extends React.Component {
  askToDelete() {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      this.deleteChannel();
    }
  }

  deleteChannel() {
    var data = {
      'userToken': localStorage.getItem('userToken'),
      'channelId': this.props.channelId
    };

    this.props.updateChannelBeingDeleted(true);
    fetch("/api/deleteChannel", {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.status == 200) {
        return response.json().then((json) => {
          this.props.updateChannel(null);
          setTimeout(() => {
            this.props.updateChannelBeingDeleted(false);
          }, 2000);
        });
      } else {
        this.props.logoutHandler();
      }
    })
    .catch((e) => console.log(e));
  }

  render() {
    if (this.props.creatorToken === localStorage.getItem('userToken')) {
      return (
        <div className="hDeleteButton" onClick={() => this.askToDelete()}>
          <i className="bi bi-trash hRed"></i>
        </div>
      );
    } else {
      return null;
    }
  }
}


export default DeleteButton;
