class Signup extends React.Component {
  executeSignup() {
    if (!document.getElementById('emailSignup').validity.valid ||
        !document.getElementById('passwordSignup').validity.valid ||
        !document.getElementById('usernameSignup').validity.valid) {

      alert("Invalid email address format and/or field(s) were left blank.");

    } else {
      var email = document.getElementById('emailSignup').value;
      var password = document.getElementById('passwordSignup').value;
      var username = document.getElementById('usernameSignup').value;

      var data = {'username': username, 'password': password, 'email': email};

      let signupHeaders = new Headers();
      signupHeaders.append('Accept', 'application/json');
      signupHeaders.append('Content-Type', 'application/json');
      const initSignup = {
        method: 'POST',
        headers: signupHeaders,
        body: JSON.stringify(data),
      };

      let request = fetch("/api/signup", initSignup);

      request.then((response) => {
        if (response.status === 409) {
          alert("Email already in use. Please try a different email.")
        } else {
          return response.json().then((json) => {
            var userToken = json['userToken'];
            this.props.loginHandler(userToken, username);
          })
        }
      })
    }
  }

  render() {
    return (
      <div className="signupForm">
        <div className="email">
          <label htmlFor="email">Email: </label>
          <input id="emailSignup" type="email" name="email" required></input>
        </div>
        <div className="username">
          <label htmlFor="username">Username: </label>
          <input id="usernameSignup" type="text" name="username" required></input>
        </div>
        <div className="password">
          <label htmlFor="password">Password: </label>
          <input id="passwordSignup" type="password" name="password" required></input>
        </div>
        <button className="executeButton" onClick={() => this.executeSignup()}>Signup</button>
      </div>
    )
  }
}


export default Signup;
