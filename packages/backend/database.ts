import StormDB from "stormdb";
import { v4 as uuidv4 } from "uuid";

export interface IRoom {
  id: string;
  creator: string;
  players: string[];
  winner: string;
  result: number | undefined;
}

export interface IUser {
  username: string;
  wins: number;
  losses: number;
}

export interface IDatabase {
  rooms: IRoom[];
  users: IUser[];
}

const __defaultSchema: IDatabase = {
  rooms: [],
  users: [],
};

const createDB = () => {
  const engine = new StormDB.localFileEngine("./db.stormdb");
  const DB = new StormDB(engine);
  DB.default(__defaultSchema);
  DB.save();
  return DB;
};

export class Database {
  DB: StormDB;

  constructor() {
    this.DB = createDB();
  }

  getRooms = (): IRoom[] => this.DB.get("rooms").value();

  getUsers = (): IUser[] => this.DB.get("users").value();

  getRoom = (id: string): IRoom => {
    const rooms = this.getRooms();
    const room = rooms.find((room) => room.id === id);
    if (room) return room;
    throw "Room not found";
  };

  setUser = (username: string) => {
    const user: IUser = {
      username,
      wins: 0,
      losses: 0,
    };
    this.DB.get("users").push(user);
    this.DB.save();
    return user;
  };

  getUser = (username: string): IUser => {
    const users: IUser[] = this.DB.get("users").value();
    const user = users.find((user) => user.username === username);
    if (user) {
      return user;
    }
    throw "User not found";
  };

  createUserIfNotExists = (username: string): boolean => {
    try {
      this.getUser(username);
    } catch (e) {
      this.setUser(username);
    } finally {
      return true;
    }
  };

  createRoom = (creator: string) => {
    const room: IRoom = {
      id: uuidv4(),
      creator: creator,
      players: [creator],
      winner: "",
      result: undefined,
    };
    this.DB.get("rooms").push(room);
    this.DB.save();
    return room;
  };

  anotherUserJoinedRoom = (roomId: string, username: string) => {
    console.log("anotherUserJoinedRoom", roomId, username);
    const room = this.getRoom(roomId);
    room.players = [...room.players, username];
    this.DB.get("rooms").set(roomId, room);
    this.DB.save();
  };

  userLeftRoom = (roomId: string, username: string) => {
    let isRoomRemoved = false;
    const room = this.getRoom(roomId);
    room.players = room.players.filter((player) => player !== username);
    if (room.players.length === 0) {
      this.DB.get("rooms").get(roomId).delete(true);
      isRoomRemoved = true;
    } else {
      this.DB.get("rooms").set(roomId, room);
    }
    this.DB.save();
    return isRoomRemoved;
  };
}

export const DB = new Database();
