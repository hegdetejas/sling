class AlreadyExists extends React.Component {
  render() {
    if (this.props.alreadyExists) {
      return (
        <p className="hAlreadyExistsText">Channel with this name already exists. Please try a different one.</p>
      );
    } else {
      return null;
    }
  }
}


export default AlreadyExists;
