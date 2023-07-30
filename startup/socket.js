const { Server } = require("socket.io");
const socketIds = require("../util/socketIds");
const authSocketMiddleware = require("../middleware/authSocketMiddleware");
const { UserSocket } = require("../models/socketUser");
const jwt = require("jsonwebtoken");
const config = require("config");

let io = undefined;
let socket = undefined;

const socketServer = {
  init: function (server) {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3001",
      },
    });

    io.use((socket, next) => {
      // authSocketMiddleware(socket, next);
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Token Not Found !"));
      try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        socket.user_id = decoded;
        next();
      } catch (err) {
        console.log(err);
        return next(new Error("Invalid Authorization"));
      }
    }).on("connection", async (socket) => {
      console.log("User connected", socket.id);
      const { _id: user_id } = socket.user_id;
      console.log(user_id);

      let user = await UserSocket.findOne({ user_id });

      const eventQueue = createUpdateUser(user, socket.id, user_id);
      emitQueueEvents(eventQueue, socket);

      socket.on("disconnect", async () => {
        await UserSocket.findOneAndUpdate(
          { socket_id: socket.id },
          { $set: { isConnected: false } }
        );
        console.log("User disconnected", socket.id);
      });
    });
  },

  getIO: function () {
    if (!io) {
      throw new Error("Socket.IO has not been initialized.");
    }
    return io;
  },
  getScoket: function () {
    if (!socket) {
      throw new Error("Socket.IO has not been initialized.");
    }
    return socket;
  },
};

const createUpdateUser = (user, socket_id, user_id) => {
  if (!user) {
    user = new UserSocket({
      user_id,
      socket_id,
      isConnected: true,
    });
  } else {
    user.socket_id = socket_id;
    user.isConnected = true;
  }
  const evetnQueue = user.message_queue;
  user.message_queue = [];
  try {
    user.save();
  } catch (error) {
    console.log(error);
  }
  return evetnQueue;
};

const emitQueueEvents = async (eventQueue, socket) => {
  if (!(eventQueue.length > 0)) return;
  eventQueue.forEach((queueEvent) => {
    socket.emit(queueEvent.event, { message: queueEvent.message });
  });
};

module.exports = socketServer;
