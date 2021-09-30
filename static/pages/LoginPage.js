import Login from '../components/Login.js';
import Signup from '../components/Signup.js';


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    if (!localStorage.getItem('whichLogin')) {
      var display = 'default';
    } else {
      var display = localStorage.getItem('whichLogin');
    }
    this.state = {
      whichLogin: display,
      loginCondition: true
    }
  }

  componentDidMount() {
    history.pushState({}, "Login", "/login");
    var userToken = localStorage.getItem('userToken');
    if (userToken) {
      window.localStorage.removeItem('userToken');
    }
  }

  login() {
    document.getElementById("loginNav").style.height = "100%";
  }

  signup() {
    document.getElementById("signupNav").style.height = "100%";
  }

  closeLogin() {
    document.getElementById("loginNav").style.height = "0%";
  }

  closeSignup() {
    document.getElementById("signupNav").style.height = "0%";
  }

  render() {
    return (
      <div className="loginPage">
        <div className="loginHeader">
          <button
            className="loginButton"
            onClick={() => this.login()}
          >
            <p className="loginText">Login</p>
          </button>
          <button className="signupButton" onClick={() => this.signup()}>
            <p className="loginText">Signup</p>
          </button>
        </div>
        <div className="brandTitle">
          <h1>
            Sling.
          </h1>
        </div>
        <div id="loginNav" className="loginOverlay">
          <button className="closebtn" onClick={() => this.closeLogin()}>
            &times;
          </button>
          <div className="overlayContent">
            <Login loginHandler={(userToken, username) => this.props.loginHandler(userToken, username)} />
          </div>
        </div>
        <div id="signupNav" className="loginOverlay">
          <button className="closebtn" onClick={() => this.closeSignup()}>
            &times;
          </button>
          <div className="overlayContent">
            <Signup loginHandler={(userToken, username) => this.props.loginHandler(userToken, username)} />
          </div>
        </div>
      </div>
    );
  }
}


export default LoginPage;
