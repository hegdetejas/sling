import EmailAlreadyExists from "./EmailAlreadyExists.js"


class ProfileDisplayPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyExists: false
    }
  }

  executeUpdate() {
    if (!document.getElementById('emailUpdate').validity.valid ||
        !document.getElementById('passwordUpdate').validity.valid ||
        !document.getElementById('usernameUpdate').validity.valid) {

      alert("Invalid email address format and/or field(s) were left blank.");

    } else {
      var email = document.getElementById('emailUpdate').value;
      var password = document.getElementById('passwordUpdate').value;
      var username = document.getElementById('usernameUpdate').value;

      var data = {
        'userToken': localStorage.getItem('userToken'),
        'username': username,
        'password': password,
        'email': email
      };

      let updateUserHeader = new Headers()
      updateUserHeader.append('Accept', 'application/json');
      updateUserHeader.append('Content-Type', 'application/json');

      const initUpdateUser = {
        method: 'POST',
        headers: updateUserHeader,
        body: JSON.stringify(data),
      }

      let request = fetch("/api/updateUser", initUpdateUser)

      request.then((response) => {
        if (response.status === 409) {
          this.setState({alreadyExists: true});
          setTimeout(() => {
            this.setState({alreadyExists: false});
          }, 4000);
        } else {
          return response.json().then((json) => {
            var userToken = json['userToken'];
            document.getElementById('emailUpdate').value = '';
            document.getElementById('passwordUpdate').value = '';
            document.getElementById('usernameUpdate').value = '';
            this.props.loginHandler(userToken, username);
            document.getElementById("profileNav").style.height = "0%";
          })
        }
      })
    }
  }

  render() {
    return (
      <div>
        <div className="signupForm">
          <div className="email">
            <label htmlFor="email">Email: </label>
            <input id="emailUpdate" type="email" name="email" required></input>
          </div>
          <div className="username">
            <label htmlFor="username">Username: </label>
            <input id="usernameUpdate" type="text" name="username" required></input>
          </div>
          <div className="password">
            <label htmlFor="password">Password: </label>
            <input id="passwordUpdate" type="password" name="password" required></input>
          </div>
          <button className="executeButton" onClick={() => this.executeUpdate()}>Update</button>
        </div>
        <button className="logoutButton" onClick={() => this.props.logoutHandler()}>Logout</button>
        <EmailAlreadyExists alreadyExists={this.state.alreadyExists}/>
      </div>
    );
  }
}


export default ProfileDisplayPopup;
