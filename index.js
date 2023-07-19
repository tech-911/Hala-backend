const express = require("express");
const authRoute = require("./routes/auth");
const chatRoutes = require('./routes/chat');

const userActionsRoute = require("./routes/userActions");
const app = express();
const mongoose = require("mongoose");
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const cors = require("cors");
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { User } = require("./model/User");
require("dotenv").config();

//Cross-Origin Resource Sharing (CORS) handler
app.use(cors());

//mongoose connection process
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

// Facebook authentication
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        console.log(user);
        cb(null, user);
      } else {
        try {
          const user = await new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "facebook",
          });
          const saveValue = await user.save();
          console.log(saveValue);
          cb(null, saveValue);
        } catch (err) {
          console.log(err);
          cb(err, null);
        }
      }
    }
  )
);

//Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); //middleware for parsing postbody format to object format
app.use("/api/auth", authRoute);
app.use("/api/useraction", userActionsRoute);
app.use("/api/chat", chatRoutes)

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Associate the socket with a user ID
  socket.on('setUser', (userId) => {
    socket.userId = userId;
  });

  // Handle incoming messages
  socket.on('message', async (data) => {
    console.log('Received message:', data);

    // Find the recipient's socket and emit the message
    const recipientSocket = Object.values(io.sockets.sockets).find(
      (socket) => socket.userId === data.recipientId
    );

    if (recipientSocket) {
      recipientSocket.emit('message', data);
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// app.use("/api/posts", postRoute);
// app.listen(4000);
server.listen(4000, () => {
  console.log('Socket.io server is running on port 4000');
});
