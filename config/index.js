const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
  }
);

const db = mongoose.connection;

try {
  db.on("error", console.error.bind(console, "error db connect"));
  db.once("open", async () => {
    console.log("connected to db");
  });
} catch (error) {
  console.log('error',error);
}

