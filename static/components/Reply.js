class Reply extends React.Component {
  render() {
    if (this.props.replies === 0) {
      return (
        <div className="hReply" onClick={() => this.props.openThread()}>
          <p className="hReplyText">Reply</p>
        </div>
      );
    } else if (this.props.replies === 1) {
      return (
        <div className="hReply" onClick={() => this.props.openThread()}>
          <p className="hReplyText">1 Reply</p>
        </div>
      );
    } else {
      return (
        <div className="hReply" onClick={() => this.props.openThread()}>
          <p className="hReplyText">{this.props.replies} Replies</p>
        </div>
      );
    }
  }
}


export default Reply;
