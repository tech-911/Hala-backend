const express = require("express");
const authRoute = require("./routes/auth");
// const userActionsRoute = require("./routes/userActions");
const app = express();
const mongoose = require("mongoose");
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
  .catch((err) => {+
    console.log(err);
  });

// Facebook authentication
// passport.use(
//   new FacebookTokenStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       const user = await User.findOne({ email: profile.emails[0].value });
//       if (user) {
//         console.log(user);
//         cb(null, user);
//       } else {
//         try {
//           const user = await new User({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             provider: "facebook",
//           });
//           const saveValue = await user.save();
//           console.log(saveValue);
//           cb(null, saveValue);
//         } catch (err) {
//           console.log(err);
//           cb(err, null);
//         }
//       }
//     }
//   )
// );

//Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); //middleware for parsing postbody format to object format
app.use("/api/auth", authRoute);
// app.use("/api/useraction", userActionsRoute);
// app.use("/api/posts", postRoute);
app.listen(4000);
