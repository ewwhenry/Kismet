import { Server } from "socket.io";
import server from "./http.js";

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket connected: %s", socket.id);
});

export default io;
