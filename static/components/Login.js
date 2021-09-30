class Login extends React.Component {
  executeLogin() {
    if (!document.getElementById('email').validity.valid ||
        !document.getElementById('password').validity.valid) {

      alert("Invalid email address format and/or field(s) were left blank.");

    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      var data = {'email': email, 'password': password};

      let loginHeaders = new Headers();
      loginHeaders.append('Accept', 'application/json');
      loginHeaders.append('Content-Type', 'application/json');
      const initLogin = {
        method: 'POST',
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      let request = fetch("/api/login", initLogin);

      request.then((response) => {
        if (response.status === 404) {
          alert("Woah... That's weird. Please try again!")
        } else if (response.status === 401) {
          alert("Invalid Email/Password. Please try again!");
        } else {
          return response.json().then((json) => {
            var userToken = json['userToken'];
            var username = json['username'];
            this.props.loginHandler(userToken, username);
          })
        }
      })
    }
  }

  render() {
    return (
      <div className="loginForm">
        <div className="email">
          <label htmlFor="email">Email: </label>
          <input id="email" type="email" name="email" required></input>
        </div>
        <div className="password">
          <label htmlFor="password">Password: </label>
          <input id="password" type="password" name="password" required></input>
        </div>
        <button className="executeButton" onClick={() => this.executeLogin()}>Login</button>
      </div>
    )
  }
}


export default Login;
