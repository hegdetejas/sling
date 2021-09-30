import ProfileDisplayPopup from './ProfileDisplayPopup.js';


class ProfilePopup extends React.Component {
  closeCreate() {
    document.getElementById("profileNav").style.height = "0%";
  }

  render() {
    return (
      <div id="profileNav" className="hCreateOverlay">
        <button className="closebtn" onClick={() => this.closeCreate()}>
          &times;
        </button>
        <div className="overlayContent">
          <ProfileDisplayPopup
            logoutHandler={() => this.props.logoutHandler()}
            loginHandler={(userToken, username) => this.props.loginHandler(userToken, username)}
          />
        </div>
      </div>
    );
  }
}


export default ProfilePopup;
