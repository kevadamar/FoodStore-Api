const routes = require("express").Router();
const multer = require('multer')
const os = require("os");

const categoriesController = require('../../controllers/categoriesController')

// Routes CRUD categories
routes.get("/categories", categoriesController.getAll);
routes.get("/category/:id", categoriesController.get);
routes.post("/category", multer({dest:os.tmpdir()}).single('image'),categoriesController.createOrUpdate);
routes.post("/category/delete",categoriesController.destroy);

// export routing lainnya
module.exports = routes;
