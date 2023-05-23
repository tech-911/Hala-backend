const { User } = require("../model/User");


const GetAllUsersByGender = async (req, res) => {
  const { gender } = req.body;
  User.find({ gender: gender}, (err, docs) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(docs);
    }
  });
};

module.exports = { GetAllUsersByGender };
