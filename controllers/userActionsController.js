const { User } = require("../model/User");
const { UserAction } = require("../model/UserActions");

const GetAllUsersByGender = async (req, res) => {
  const { gender } = req.body;
  User.find({ gender: gender }, (err, docs) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(docs);
    }
  });
};
const Reacted = async (req, res) => {
  const { email, reactEmail, action } = req.body;

  const actionResponse = await UserAction.findOne({ email: email });
  console.log(actionResponse);
  if (actionResponse) {
    if (action === "like") {
      if (actionResponse.liked.includes(reactEmail)) {
        return res.status(400).send({ message: "user already liked" });
      } else {
        if (actionResponse.unlike.includes(reactEmail)) {
          const index = actionResponse.unlike.indexOf(reactEmail);
          if (index > -1) {
            actionResponse.unlike.splice(index, 1);
          }
          actionResponse.liked.push(reactEmail);
          actionResponse.save();
          console.log(actionResponse);
          res.send({ message: "reacted sucessfully" });
        } else {
          actionResponse.liked.push(reactEmail);
          actionResponse.save();
          console.log(actionResponse);
          res.send({ message: "reacted sucessfully" });
        }
      }
    } else if (action === "unlike") {
      if (actionResponse.unlike.includes(reactEmail)) {
        return res.status(400).send({ message: "user already unliked" });
      } else {
        if (actionResponse.liked.includes(reactEmail)) {
          const index = actionResponse.liked.indexOf(reactEmail);
          if (index > -1) {
            actionResponse.liked.splice(index, 1);
          }
          actionResponse.unlike.push(reactEmail);
          actionResponse.save();
          console.log(actionResponse);
          res.send({ message: "reacted sucessfully" });
        } else {
          actionResponse.unlike.push(reactEmail);
          actionResponse.save();
          console.log(actionResponse);
          res.send({ message: "reacted sucessfully" });
        }
      }
    } else {
      return res.status(400).send({ message: "incorrect react action" });
    }
  } else {
    if (action === "like") {
      try {
        const userActionRes = await new UserAction({
          email: email,
          liked: [reactEmail],
          unlike: [],
        });
        const saveValue = await userActionRes.save();
        console.log(saveValue);
        res.send(saveValue);
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
    } else if (action === "unlike") {
      try {
        const userActionRes = await new UserAction({
          email: email,
          liked: [],
          unlike: [reactEmail],
        });
        const saveValue = await userActionRes.save();
        console.log(saveValue);
        res.send(saveValue);
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
    }
  }
};

module.exports = { GetAllUsersByGender, Reacted };
