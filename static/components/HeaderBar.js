import ProfilePopup from './ProfilePopup.js';


class HeaderBar extends React.Component {
  goHome() {
    this.props.updateRenderMessage('false');
    this.props.updateChannel(null);
    this.props.closeThread();
  }

  updateProfile() {
    document.getElementById("profileNav").style.height = "100%";
  }

  render() {
    return (
      <div className="hHeaderBar">
        <div className="hBrandName" onClick={() => this.goHome()}>
          Sling.
        </div>
        <div className="hUsernameButtonDiv">
          <button className="hUsernameButton" onClick={() => this.updateProfile()}>
            <p className="hUsername">
              {this.props.username}
            </p>
          </button>
        </div>
        <ProfilePopup
          logoutHandler={() => this.props.logoutHandler()}
          loginHandler={(userToken, username) => this.props.loginHandler(userToken, username)}
        />
      </div>
    )
  }
}


export default HeaderBar;
