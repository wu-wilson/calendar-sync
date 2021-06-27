// Imports
import axios from "axios";
import { Moment } from "moment";
import type { ToDoItem } from "./ToDoList";
import type { counts } from "../Calendar/BuildHashtable";
import { Socket } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const ToDo = ({
  todo,
  todos,
  setTodos,
  selectedDate,
  table,
  setTable,
  socket,
}: {
  todo: ToDoItem;
  todos: ToDoItem[];
  setTodos: (todos: ToDoItem[]) => void;
  selectedDate: Moment;
  table: { [key: string]: counts };
  setTable: (table: { [key: string]: counts }) => void;
  socket: Socket;
}) => {
  // Deletes todo item from database and todos array
  const handleDelete = async (id: string) => {
    // Emit "item deleted" event
    socket.emit("item deleted", todo);
    // Delete item from database
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/delete/${id}`)
      .catch(console.error);
    // Update todos array
    const temp = [...todos];
    const index = temp.indexOf(todo);
    if (index > -1) {
      temp.splice(index, 1);
    }
    setTodos(temp);
    // Update hashtable
    const tempTable = { ...table };
    const day_id = selectedDate.format("YYYY-MM-DD");
    const tempData = tempTable[day_id];
    if (tempData) {
      if (todo.completed === 1) {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: tempData.count_total - 1,
          count_completed: (parseInt(tempData.count_completed) - 1).toString(),
        };
      } else {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: tempData.count_total - 1,
          count_completed: tempData.count_completed,
        };
      }
      setTable(tempTable);
    }
  };

  // Updates todo.complete value
  const handleComplete = async (id: string) => {
    // Store new completed value
    const completed = todo.completed === 1 ? 0 : 1;
    // Update item in database
    await axios
      .put(`${process.env.REACT_APP_API_URL}/update/${id}`, {
        completed: completed,
      })
      .catch(console.error);
    // Update todos array
    const temp = [...todos];
    const index = temp.indexOf(todo);
    temp[index].completed = completed;
    setTodos(temp);
    // Update hashtable
    const tempTable = { ...table };
    const day_id = selectedDate.format("YYYY-MM-DD");
    const tempData = tempTable[day_id];
    if (tempData) {
      if (completed === 1) {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: tempData.count_total,
          count_completed: (parseInt(tempData.count_completed) + 1).toString(),
        };
      } else {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: tempData.count_total,
          count_completed: (parseInt(tempData.count_completed) - 1).toString(),
        };
      }
      setTable(tempTable);
    }
    // Emit "item completed" event
    socket.emit("item completed", todo);
  };

  return (
    <div className="TDContainer">
      <li className={`${todo.completed === 1 ? "TDItemComplete" : null}`}>
        {todo.input}
      </li>
      <div className="TDBtnContainer">
        <button className="TDBtn" onClick={() => handleDelete(todo.id)}>
          X
        </button>
        <button className="TDBtn" onClick={() => handleComplete(todo.id)}>
          ✓
        </button>
      </div>
    </div>
  );
};

export default ToDo;
