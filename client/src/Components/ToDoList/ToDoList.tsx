// Imports
import axios from "axios";
import type { counts } from "../Calendar/BuildHashtable";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import moment, { Moment } from "moment";
import { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { useState, useCallback, FormEvent, useEffect } from "react";
import ToDo from "./ToDo";
import dotenv from "dotenv";

dotenv.config();

// ToDoItem type declaration
export type ToDoItem = {
  id: string;
  input: string;
  created_on: string;
  completed: number;
  day_id: string;
  user_id: string;
};

// Finds first instance of a specified todo item in an array
const findFirstInstance = (arr: ToDoItem[], val: ToDoItem) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === val.id) {
      return i;
    }
  }
  return -1;
};

const ToDoList = ({
  socket,
  selectedDate,
  table,
  setTable,
  user_id,
}: {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  selectedDate: Moment;
  table: { [key: string]: counts };
  setTable: (table: { [key: string]: counts }) => void;
  user_id: string;
}) => {
  // Store the value from InputBar
  const [input, setInput] = useState<string>("");
  // Store the To-Do items in an array
  const [todos, setTodos] = useState<ToDoItem[]>([]);

  // Fetch todo items for a specified day
  const fetchTodos = useCallback(
    async (selectedDay: Moment) =>
      await axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }/data/${user_id}/${selectedDay.format("YYYY-MM-DD")}`
        )
        .then((res) => {
          setTodos(res.data);
        })
        .catch(console.error),
    [user_id]
  );

  // Fetch todo items whenever selected day is switched
  useEffect(() => {
    fetchTodos(selectedDate);
  }, [selectedDate, fetchTodos]);

  // Update InputBar
  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
    socket.emit(
      "input change",
      user_id,
      e.currentTarget.value,
      selectedDate.format("YYYY-MM-DD")
    );
  };

  // Listen for changes in input bar
  useEffect(() => {
    // Clear existing listeners
    socket.off("input change received");
    // Update input
    socket.on(
      "input change received",
      (emittedInput: string, emittedDate: string) => {
        if (selectedDate.format("YYYY-MM-DD") === emittedDate) {
          setInput(emittedInput);
        }
      }
    );
  }, [selectedDate, socket]);

  // Handles when an item is submitted.
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const id = uuid();
      const created_on = moment().format("YYYY-MM-DD HH:mm:ss");
      // Make an entry in the database
      await axios
        .post(`${process.env.REACT_APP_API_URL}/insert`, {
          id: id,
          input: input,
          created_on: created_on,
          completed: 0,
          day_id: selectedDate.format("YYYY-MM-DD"),
          user_id: user_id,
        })
        .catch(console.error);
      // Update todos array
      setTodos([
        {
          id: id,
          input: input,
          created_on: created_on,
          completed: 0,
          day_id: selectedDate.format("YYYY-MM-DD"),
          user_id: user_id,
        },
        ...todos,
      ]);
      // Update hashtable
      const tempTable = { ...table };
      const day_id = selectedDate.format("YYYY-MM-DD");
      const tempData: counts = tempTable[day_id];
      if (tempData) {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: tempData.count_total + 1,
          count_completed: tempData.count_completed,
        };
      } else {
        tempTable[day_id] = {
          day_id: day_id,
          count_total: 1,
          count_completed: "0",
        };
      }
      setTable(tempTable);
      setInput("");
      // Emit "item submitted" event
      socket.emit(
        "item submitted",
        {
          input: input,
          id: id,
          created_on: created_on,
          day_id: selectedDate.format("YYYY-MM-DD"),
          user_id: user_id,
        },
        selectedDate.format("YYYY-MM-DD")
      );
    },
    [input, selectedDate, setTable, socket, table, todos, user_id]
  );

  // Listen for items added
  useEffect(() => {
    // Clear existing listeners
    socket.off("item submitted received");
    // Update listener
    socket.on(
      "item submitted received",
      (todo: {
        input: string;
        id: string;
        created_on: string;
        day_id: string;
        user_id: string;
      }) => {
        // set emittedDate
        const emittedDate = todo.day_id;
        if (selectedDate.format("YYYY-MM-DD") === emittedDate) {
          // Update input
          setInput("");
          // Update todos array
          setTodos([
            {
              id: todo.id,
              input: todo.input,
              created_on: todo.created_on,
              completed: 0,
              day_id: todo.day_id,
              user_id: todo.user_id,
            },
            ...todos,
          ]);
        }
        // Update hashtable
        const tempTable = { ...table };
        const day_id = emittedDate;
        const tempData: counts = tempTable[day_id];
        if (tempData) {
          tempTable[day_id] = {
            day_id: day_id,
            count_total: tempData.count_total + 1,
            count_completed: tempData.count_completed,
          };
        } else {
          tempTable[day_id] = {
            day_id: day_id,
            count_total: 1,
            count_completed: "0",
          };
        }
        setTable(tempTable);
      }
    );
  }, [selectedDate, setTable, socket, table, todos]);

  // Listen for items deleted
  useEffect(() => {
    // Clear existing listeners
    socket.off("item deleted received");
    // Update listener
    socket.on("item deleted received", (todo: ToDoItem) => {
      if (selectedDate.format("YYYY-MM-DD") === todo.day_id) {
        // Update Todos arr
        const temp = [...todos];
        const index = findFirstInstance(temp, todo);
        if (index > -1) {
          temp.splice(index, 1);
        }
        setTodos(temp);
      }
      // Update hashtable
      const tempTable = { ...table };
      const day_id = todo.day_id;
      const tempData = tempTable[day_id];
      if (tempData) {
        if (todo.completed === 1) {
          tempTable[day_id] = {
            day_id: day_id,
            count_total: tempData.count_total - 1,
            count_completed: (
              parseInt(tempData.count_completed) - 1
            ).toString(),
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
    });
  });

  // Listen for items completed
  useEffect(() => {
    // Clear existing listeners
    socket.off("item completed received");
    // Update listener
    socket.on("item completed received", (todo: ToDoItem) => {
      const emittedDate = todo.day_id;
      if (selectedDate.format("YYYY-MM-DD") === emittedDate) {
        // Update Todos arr
        const temp = [...todos];
        const index = findFirstInstance(temp, todo);
        if (index > -1) {
          temp[index].completed = todo.completed;
          setTodos(temp);
        }
        // Update Hashtable
        const tempTable = { ...table };
        const tempData = tempTable[emittedDate];
        if (tempData) {
          if (todo.completed === 1) {
            tempTable[emittedDate] = {
              day_id: emittedDate,
              count_total: tempData.count_total,
              count_completed: (
                parseInt(tempData.count_completed) + 1
              ).toString(),
            };
          } else {
            tempTable[emittedDate] = {
              day_id: emittedDate,
              count_total: tempData.count_total,
              count_completed: (
                parseInt(tempData.count_completed) - 1
              ).toString(),
            };
          }
          setTable(tempTable);
        }
      } else {
        // Update Hashtable
        const tempTable = { ...table };
        const day_id = todo.day_id;
        const tempData = tempTable[day_id];
        if (tempData) {
          if (todo.completed === 1) {
            tempTable[day_id] = {
              day_id: day_id,
              count_total: tempData.count_total,
              count_completed: (
                parseInt(tempData.count_completed) + 1
              ).toString(),
            };
          } else {
            tempTable[day_id] = {
              day_id: day_id,
              count_total: tempData.count_total,
              count_completed: (
                parseInt(tempData.count_completed) - 1
              ).toString(),
            };
          }
          setTable(tempTable);
        }
      }
    });
  }, [selectedDate, setTable, setTodos, socket, table, todos]);

  return (
    <div className="ListContainer">
      <div className="ListTitle">My List</div>
      <form className="ListForm" onSubmit={handleSubmit}>
        <input
          className="ListInput"
          type="text"
          placeholder="Add item here..."
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <input
          className="ListSubmit"
          type="Submit"
          value="Add"
          onChange={handleSubmit}
        />
      </form>
      <div className="ListItems">
        {todos.map((todo) => (
          <ToDo
            todo={todo}
            todos={todos}
            setTodos={setTodos}
            selectedDate={selectedDate}
            table={table}
            setTable={setTable}
            socket={socket}
            key={todo.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
