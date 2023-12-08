import { Server } from "socket.io";
import SocketUser from "./models/mongodb/SocketUser.js";

let io;

export default {
  initializeSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      socket.on("new-user", async (userId) => {
        await SocketUser.create({ userId, socketId: socket.id });
      });

      socket.on("follow-profile", (notification) => {
        console.log(notification);
      });

      socket.on("disconnect", async () => {
        await SocketUser.findOneAndDelete({ socketId: socket.id });
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error(
        "Can't get io instance before calling initializeSocket()"
      );
    }
    return io;
  },
};
