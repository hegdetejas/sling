class Unread extends React.Component {
  render() {
    if (this.props.unread !== 0) {
      return (
        <div className="hUnread">
          <span className="badge rounded-pill bg-danger">
            {this.props.unread}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }
}


export default Unread;
