class ThreadComponent extends React.Component {
  render() {
    return (
      <div className="tActualReply">
        <div className="tActualReplyUsername">
          {this.props.username}
        </div>
        <div className="tActualReplyBody">
          {this.props.body}
        </div>
      </div>
    );
  }
}


export default ThreadComponent;
