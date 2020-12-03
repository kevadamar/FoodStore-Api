const routes = require("express").Router();
const multer = require('multer')

const tagsController = require('../../controllers/tagsController')

// Routes CRUD tags
routes.get("/tags", tagsController.index);
routes.get("/tag/:id", tagsController.get);
routes.post("/tag", multer().none(),tagsController.createOrUpdate);
routes.post("/tag/delete",tagsController.destroy);

// export routing lainnya
module.exports = routes;
