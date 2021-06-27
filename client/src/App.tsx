// Imports
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import UserPage from "./Pages/UserPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles.css";

const App = () => {
  return (
    <div className="Container">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/About">
            <AboutPage />
          </Route>
          <Route exact path="/Contact">
            <ContactPage />
          </Route>
          <Route exact path="/user/:user_id">
            <UserPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
