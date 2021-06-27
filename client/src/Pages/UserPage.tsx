// Imports
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import buildHashtable, { counts } from "../Components/Calendar/BuildHashtable";
import Calendar from "../Components/Calendar/Calendar";
import ToDoList from "../Components/ToDoList/ToDoList";
import { CopyToClipboard } from "react-copy-to-clipboard";
import dotenv from "dotenv";

dotenv.config();

// Create socket
const socket = io(`${process.env.REACT_APP_API_URL}`);

const UserPage = () => {
  // Store the user's id
  const { user_id }: { user_id: string } = useParams();

  // Join the user's room
  useEffect(() => {
    socket.emit("join room", user_id);
  }, [user_id]);

  // Store the selected date in selected
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  // Store number of active items for each day in a hashtable
  const [table, setTable] = useState<{ [key: string]: counts }>({});

  // Set table to a hashtable containing counts on first render
  useEffect(() => {
    buildHashtable(user_id).then((res) => setTable(res));
  }, [user_id]);

  return (
    <div className="UPContainer">
      <div className="UPCalendarBox UPBorder">
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          table={table}
        />
      </div>
      <div className="UPListBox">
        <ToDoList
          socket={socket}
          selectedDate={selectedDate}
          table={table}
          setTable={setTable}
          user_id={user_id}
        />
      </div>
      <div className="UPBlankDiv">
        <CopyToClipboard
          text={`${process.env.REACT_APP_DOMAIN}/user/${user_id}`}
        >
          <button className="UPCopyBtn">Copy Shareable URL</button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default UserPage;
