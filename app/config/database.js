const mongoose = require("mongoose");
const { dbHost, dbName, dbPass, dbUser } = require(".");

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
  },
  (err) => {
    if (err) {
      console.log(`error connected : ${err}`);
    } else {
      console.log("connected to db");
    }
  }
);

module.exports.db = mongoose.connection;
