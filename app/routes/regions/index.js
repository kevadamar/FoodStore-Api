const routes = require("express").Router();

const regionsController = require("../../controllers/regionsController");

// Routes CRUD regions
routes.get("/wilayah/provinsi", regionsController.getProvinsi);
routes.get("/wilayah/kotakab", regionsController.getKotakab);
routes.get("/wilayah/kecamatan", regionsController.getKecamatan);
routes.get("/wilayah/kelurahan", regionsController.getKelurahan);

// export routing lainnya
module.exports = routes;
