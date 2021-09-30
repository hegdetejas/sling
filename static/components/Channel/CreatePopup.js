import Popup from './Popup.js';


class CreatePopup extends React.Component {
  closeCreate() {
    document.getElementById("createNav").style.height = "0%";
  }

  render() {
    return (
      <div id="createNav" className="hCreateOverlay">
        <button className="closebtn" onClick={() => this.closeCreate()}>
          &times;
        </button>
        <div className="overlayContent">
          <Popup />
        </div>
      </div>
    );
  }
}


export default CreatePopup;
