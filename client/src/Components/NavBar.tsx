// Imports
import { Link, useHistory } from "react-router-dom";
import "../styles.css";

const NavBar = () => {
  const history = useHistory();

  // Redirect the user to the homepage
  const directHome = () => {
    history.push("/");
  };

  return (
    <div className="NBContainer">
      <div className="NBTop">
        <div onClick={directHome} className="NBToHome">
          CALENDAR SYNC
        </div>
      </div>
      <div className="NBBottom">
        <div className="NavItemsContainer">
          <Link to="/About" className="NavItem">
            About
          </Link>
          <Link to="/Contact" className="NavItem">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
