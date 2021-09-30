import ThreadComponent from './ThreadComponent.js';


class ThreadReplies extends React.Component {
  render() {
    const repliesList = this.props.threadReplies.map((item) =>
      <ThreadComponent
        key={"reply_" + item.id}
        username={item.reply_username}
        body={item.reply_body}
      />
    );

    if (this.props.threadReplies.length === 0) {
      return (
        <div className="tNoReplies">
        </div>
      )
    } else {
      return (
        <div className="tReplies">
          {repliesList}
        </div>
      )
    }
  }
}


export default ThreadReplies;
