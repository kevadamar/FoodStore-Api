const express = require("express");
const routes = express.Router();
const multer = require('multer')
const os = require("os");

require("../config");

const productController = require('../controllers/productsController')

// Routes CRUD product
routes.get("/products", productController.getAll);
routes.get("/product/:id", productController.get);
routes.post("/product", multer({dest:os.tmpdir()}).single('image'),productController.createOrUpdate);
routes.post("/delete",productController.createOrUpdate);

// export routing lainnya
module.exports = routes;
