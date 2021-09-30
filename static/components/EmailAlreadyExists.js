class EmailAlreadyExists extends React.Component {
  render() {
    if (this.props.alreadyExists) {
      return (
        <p className="hAlreadyExistsText">This Email already exists. Please try a different one.</p>
      );
    } else {
      return null;
    }
  }
}


export default EmailAlreadyExists;
