class SendReply extends React.Component {
  render() {
    return (
      <div className="hSendButton" onClick={() => this.props.sendReply()}>
        <i className="bi bi-cursor-fill hGreen"></i>
      </div>
    );
  }
}


export default SendReply;
