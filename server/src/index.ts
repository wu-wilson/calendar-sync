// Imports
import express, { Request, Response } from "express";
import cors from "cors";
import { json as bodyParser } from "body-parser";
import mysql2 from "mysql2";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

// Set up Server
const app = express();
app.use(cors());
app.use(bodyParser());

const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: [`${process.env.DOMAIN}`],
  },
});

// Declare type ToDoItem
type ToDoItem = {
  id: string;
  input: string;
  created_on: string;
  completed: number;
  day_id: string;
  user_id: string;
};

// After connection is established...
io.on("connection", (socket: Socket) => {
  // Join a room
  socket.on("join room", (user_id: string) => {
    socket.join(user_id);
  });
  socket.on(
    "input change",
    (user_id: string, input: string, selectedDate: string) => {
      socket.to(user_id).emit("input change received", input, selectedDate);
    }
  );
  socket.on("item submitted", (todo: ToDoItem) => {
    socket.to(todo.user_id).emit("item submitted received", todo);
  });
  socket.on("item completed", (todo: ToDoItem) => {
    socket.to(todo.user_id).emit("item completed received", todo);
  });
  socket.on("item deleted", (todo: ToDoItem) => {
    socket.to(todo.user_id).emit("item deleted received", todo);
  });
});

// Create database connection
const database = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

// HTTP GET request- get the count of the number of items in each day
app.get("/count/:user_id", (req: Request, res: Response) => {
  const GET_COUNT_QUERY = `SELECT COUNT(*) as count_total, SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as count_completed, day_id FROM todo_items WHERE user_id = ? GROUP BY day_id ORDER BY day_id;`;
  database.query(GET_COUNT_QUERY, [req.params.user_id], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// Get the todo items from a specified day for a specified user
app.get("/data/:user_id/:selectedDay", (req: Request, res: Response) => {
  const SELECT_ITEMS_QUERY = `SELECT * FROM todo_items WHERE day_id = ? AND user_id = ? ORDER BY created_on DESC`;
  database.query(
    SELECT_ITEMS_QUERY,
    [req.params.selectedDay, req.params.user_id],
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(result);
      }
    }
  );
});

// HTTP POST requests
// Insert a todo item
app.post("/insert", (req: Request, res: Response) => {
  const INSERT_ITEM_QUERY = `INSERT INTO todo_items (id, input, created_on, completed, day_id, user_id) VALUES ("${req.body.id}", "${req.body.input}", "${req.body.created_on}", "${req.body.completed}", "${req.body.day_id}", "${req.body.user_id}" )`;
  database.query(INSERT_ITEM_QUERY, (err) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("Item added.");
    }
  });
});

// Enter a new user
app.post("/new/user", (req: Request, res: Response) => {
  const INSERT_USER_QUERY = `INSERT INTO users (user_id, created_on) VALUES ("${req.body.user_id}", "${req.body.created_on}")`;
  database.query(INSERT_USER_QUERY, (err) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send("User added.");
    }
  });
});

// HTTP PUT request - updates the completed value of a todo item
app.put("/update/:id/", (req: Request, res: Response) => {
  const UPDATE_COMPLETE_QUERY = `UPDATE todo_items SET completed = ${req.body.completed} WHERE id = ?`;
  database.query(UPDATE_COMPLETE_QUERY, [req.params.id], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// HTTP DELETE request - deletes a todo item from the database
app.delete("/delete/:id", (req: Request, res: Response) => {
  const DELETE_ITEM_QUERY = `DELETE FROM todo_items WHERE id = ?`;
  database.query(DELETE_ITEM_QUERY, [req.params.id], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(result);
    }
  });
});

// Listen on port 4000
http.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
