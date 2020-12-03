const routes = require("express").Router();
const multer = require('multer')
const os = require("os");

const productController = require('../../controllers/productsController')

// Routes CRUD product
routes.get("/products", productController.index);
routes.get("/product/:id", productController.get);
routes.post("/product", multer({dest:os.tmpdir()}).single('image'),productController.createOrUpdate);
routes.post("/product/delete",productController.destroy);

// export routing lainnya
module.exports = routes;
