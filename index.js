const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors')

const routers = require("./routes");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())

const log = (req, res, next) => {
  console.log(Date.now() + " " + req.ip + " " + req.originalUrl);
  next();
};

app.use(log);

app.use(routers);

// page not found
const routeNotFound = (req, res, next) => {
  res.status(404).json({
    status: "error 404",
    message: "page not found",
  });
};

app.use(routeNotFound);

const errorHandling = (err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "terjadi kesalahan pada server",
  });
};
app.use(errorHandling);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
