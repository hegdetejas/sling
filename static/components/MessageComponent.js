import Reply from './Reply.js';
import ImageComponent from './ImageComponent.js'


class MessageComponent extends React.Component {
  render() {
    const imageList = this.props.urls.map((item, id) =>
      <ImageComponent
        key={"image_" + id}
        image={item}
      />
    );
    
    return (
      <div className="hActualMessage">
        <div className="hActualMessageUsername">
          {this.props.username}
        </div>
        <div className="hActualMessageBody">
          {this.props.body}
          {imageList}
        </div>
        <Reply
          openThread={() => this.props.openThread()}
          replies={this.props.replies}
        />
      </div>
    )
  }
}


export default MessageComponent;
