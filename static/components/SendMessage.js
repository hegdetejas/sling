class SendMessage extends React.Component {
  render() {
    return (
      <div className="hSendButton" onClick={() => this.props.sendMessage()}>
        <i className="bi bi-cursor-fill hGreen"></i>
      </div>
    )
  }
}


export default SendMessage;
