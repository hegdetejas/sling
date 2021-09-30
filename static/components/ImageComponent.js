class ImageComponent extends React.Component {
  render() {
    return (
      <div>
        <img src={this.props.image} height="100" />
      </div>
    );
  }
}


export default ImageComponent;
