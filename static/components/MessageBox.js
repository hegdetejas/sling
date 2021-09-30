class MessageBox extends React.Component {
  textListener = (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      this.props.sendMessage();
      event.preventDefault();
    }
  }

  render() {
    return (
      <div>
        <input
          className="hInputBar"
          name="comment"
          id="message"
          placeholder={'Send to #' + this.props.channelName}
          onKeyPress={this.textListener}
        />
      </div>
    );
  }
}


export default MessageBox;
