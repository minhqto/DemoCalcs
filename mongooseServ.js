const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  loginHistory: {
    dateTime: Date,
    userAgent: String,
  },
  calcHistory: [
    {
      calcType: String,
      calcDate: Date,
      calcValue: Number,
    },
  ],
});

//this is the "table in the demoCalcs db"

module.exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://demoCalcAdmin:chimometer@democalcs-u3d0a.mongodb.net/test?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve("Connected to mongoDB!");
    });
  });
};

module.exports.createUser = function(username, password, email) {
  return new Promise(function(resolve, reject) {
    //refactor this to allow for dynamic creation of users
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        if (!err) {
          let newUser = new User({
            userName: username,
            password: hash,
            email: email,
          });
          newUser.save((err) => {
            if (err) {
              reject(err.code);
            } else {
              resolve();
            }
          });
        } else {
          console.log(err);
          reject(err);
        }
      });
    });
  });
};

module.exports.checkUser = function(userData) {
  return new Promise(function(resolve, reject) {});
};

module.exports.deleteUser = function(userData) {
  return new Promise(function(resolve, reject) {});
};

module.exports.saveCalc = function(calc) {};
