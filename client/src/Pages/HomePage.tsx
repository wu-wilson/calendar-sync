// Imports
import { FormEvent } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";
import moment from "moment";
import NavBar from "../Components/NavBar";
import CalendarImg from "../Images/IMGCalendar";
import ListImg from "../Images/IMGList";
import dotenv from "dotenv";

dotenv.config();

/* Once clicked, generate user page and user id. Then,
redirect the user to their page. */
const HomePage = () => {
  // Set up history
  const history = useHistory();

  // Once clicked, generate unique user id and direct to unique link.
  const handleStart = async (e: FormEvent) => {
    const user_id = uuid();
    await axios
      .post(`${process.env.REACT_APP_API_URL}/new/user`, {
        user_id: user_id,
        created_on: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .catch(console.error);
    history.push(`/user/${user_id}`);
  };

  return (
    <div className="HPContainer">
      <NavBar />
      <div className="HPImgBoxContainer">
        <div className="HPCalendarImgBox">
          <CalendarImg />
        </div>
        <div className="HPListImgBox">
          <ListImg />
        </div>
      </div>
      <div className="HPTxtBtnContainer">
        <div className="HPTxtBtnBox">
          <div className="HPTitle">Stay synced.</div>
          <div className="HPSubtext">
            Assigned a group project? Simplify your scheduling and stay
            organized.
          </div>
          <button className="HPStartBtn" onClick={handleStart}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
