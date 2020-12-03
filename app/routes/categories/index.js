const routes = require("express").Router();
const multer = require('multer')

const categoriesController = require('../../controllers/categoriesController')

// Routes CRUD categories
routes.get("/categories", categoriesController.index);
routes.get("/category/:id", categoriesController.get);
routes.post("/category", multer().none(),categoriesController.createOrUpdate);
routes.post("/category/delete",categoriesController.destroy);

// export routing lainnya
module.exports = routes;
