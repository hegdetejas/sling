class ThreadOriginalMessage extends React.Component {
  render() {
    if (!this.props.threadOriginalMessage) {
      return null;
    } else {
      return (
        <div className="tOriginalMessage">
          <div className="hActualMessageUsername">
            {this.props.threadOriginalMessage.username}
          </div>
          <div className="hActualMessageBody">
            {this.props.threadOriginalMessage.message_body}
          </div>
        </div>
      )
    }
  }
}

export default ThreadOriginalMessage;
