class ReplyBox extends React.Component {
  textListener = (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      this.props.sendReply();
      event.preventDefault();
    }
  }

  render() {
    return (
      <div>
        <input
          className="hInputBar"
          name="comment"
          id="reply"
          placeholder={'Reply...'}
          onKeyPress={this.textListener}
        />
      </div>
    );
  }
}


export default ReplyBox;
