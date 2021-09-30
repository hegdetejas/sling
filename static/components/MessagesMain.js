import MessageComponent from './MessageComponent.js';


class MessagesMain extends React.Component {
  render() {
    const messagesList = this.props.messages.map((item) =>
      <MessageComponent
        key={"message_" + item.id}
        body={item.message_body}
        username={item.username}
        replies={item.number_of_replies}
        urls={item.urls}
        openThread={() => this.props.openThread(item.channel_id, item.id)}
      />
    );

    return (
      <div>
        {messagesList}
      </div>
    );
  }
}


export default MessagesMain;
