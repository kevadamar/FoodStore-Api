const routesApp = require("express")();

const productRouter = require("./products");
const categoryRouter = require("./categories");
const tagRouter = require("./tags");
const authRouter = require("./auth");
const regionsRouter = require("./regions");

//Routes AUTH
routesApp.use("/api", authRouter);
// Routes CRUD product
routesApp.use("/api", productRouter);
// Routes CRUD category
routesApp.use("/api", categoryRouter);
// Routes CRUD tag
routesApp.use("/api", tagRouter);
// Routes GET REGIONS
routesApp.use("/api", regionsRouter)

// page not found
const routeNotFound = (req, res, next) => {
  res.status(404).json({
    status: "error 404",
    message: "page not found",
  });
};

routesApp.use(routeNotFound);

// error handling
const errorHandling = (err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "terjadi kesalahan pada server",
  });
};

routesApp.use(errorHandling);

// export routing lainnya
module.exports = routesApp;
