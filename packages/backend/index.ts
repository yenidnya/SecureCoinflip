import express from "express";
import http from "http";
import { Server } from "socket.io";
import { DB } from "./database";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.get("/rooms", (req, res) => {
  res.json(DB.getRooms());
});

app.get("/rooms/:id", (req, res) => {
  console.log("getRoom aga", req.params.id);
  res.json(DB.getRoom(req.params.id));
});

app.post("/createRoom", (req, res) => {
  const room = DB.createRoom(req.body.username);
  io.sockets.emit("roomCreated", room);
  res.status(200).json(room);
});

io.on("connection", (socket) => {
  const username = socket.handshake.query?.user as string;
  DB.createUserIfNotExists(username) &&
    console.log("a user connected", username);
  console.log(io.engine.clientsCount + " users connected");

  socket.on("joinRoom", (roomId: string, userId: string) => {
    const room = DB.getRoom(roomId);
    if (!room.players.includes(userId)) {
      DB.anotherUserJoinedRoom(roomId, userId);
      io.sockets.emit("joinedRoom", roomId, userId);
    }
  });

  socket.on("leaveRoom", (roomId: string, userId: string) => {
    io.sockets.emit("leftRoom", roomId, userId);
    const isRoomRemoved = DB.userLeftRoom(roomId, userId);
    if (isRoomRemoved) {
      io.sockets.emit("roomRemoved", roomId);
    }
  });

  socket.on("requestRandomWords", (roomId: string) => {
    io.sockets.emit("requestRandomWords", roomId);
  });
});

server.listen(3001, () => {
  console.log("listening on 3001");
});
