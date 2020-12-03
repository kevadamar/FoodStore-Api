const Category = require("../models/Category");

const index = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
      totalData: 0,
      data: null,
    });
    next(err);
  }
};

const createOrUpdate = (req, res, next) => {
  if (req.body.id) {
    update(req, res, next);
  } else {
    store(req, res, next);
  }
};

const store = async (req, res, next) => {
  try {
    let category = new Categoryry(req.body);

    await category.save();

    res.status(201).send({
      status: 201,
      messages: "Category Created",
      data: product,
    });
  } catch (err) {
      next(err)
  }
};
