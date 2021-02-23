const Category = require("../models/Category");
const { policyFor } = require("../policy");

const index = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;
    // console.log(page);
    const category = await Category.find()
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(parseInt(size) * 1)
      .skip((parseInt(page) - 1) * parseInt(size));

    if (category.length > 0) {
      return res.status(200).send({
        status: 200,
        messages: "List Category",
        totalData: category.length,
        data: category,
      });
    } else {
      return res.status(200).send({
        status: 200,
        messages: "List Category Kosong",
        totalData: 0,
        data: null,
      });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
      totalData: 0,
      data: null,
    });
    next(err);
  }
};

// Get Category
const get = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    // console.log(category);

    if (category) {
      return res.status(200).send({
        status: 200,
        messages: "Category Detail",
        data: category,
      });
    } else {
      return res.status(404).send({
        status: 404,
        messages: "Category Tidak ada",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
    });
  }
};

// destroy Category
const destroy = async (req, res, next) => {
  try {
    const { id } = req.body;
    let policy = policyFor(req.user);

    if (!policy.can("delete", "Category")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses menghapus kategori",
      });
    }

    let category = await Category.findOneAndDelete({ _id: id });
    // console.log(category);
    return res.status(200).send({
      status: 200,
      messages: "Category Deleted",
      data: null,
    });
  } catch (error) {
    // console.log("error : ", error);
    return res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
    });
  }
};

const createOrUpdate = (req, res, next) => {
  if (req.body.id) {
    update(req, res, next);
  } else {
    store(req, res, next);
  }
};

// Update Category
const update = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("update", "Category")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses update kategori",
      });
    }

    let category = await Category.findOneAndUpdate(
      { _id: req.body.id },
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    // console.log(category)
    if (!category) {
      return res.json({
        error: 404,
        message: "Category Not Found",
      });
    }
    return res.status(200).send({
      status: 200,
      messages: "Category Updated",
      data: category,
    });
  } catch (error) {
    // console.log(error);
    if (error && error.name === "ValidationError") {
      const errorField = errField(error);

      return res.json({
        error: 404,
        message: error.message,
        fields: errorField,
      });
    }
    next(error);
  }
};

// Create Category
const store = async (req, res, next) => {
  try {
    let { body, user } = req;
    let category = new Category(body);
    let policy = policyFor(user);

    if (!policy.can("create", "Category")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses membuat kategori",
      });
    }

    await category.save();

    return res.status(201).send({
      status: 201,
      messages: "Category Created",
      data: category,
    });
  } catch (error) {
    //   console.log(error);
    if (error && error.name === "ValidationError") {
      const errorField = errField(error);

      return res.json({
        error: 404,
        message: error.message,
        fields: errorField,
      });
    }
    next(error);
  }
};

module.exports = {
  index,
  createOrUpdate,
  get,
  destroy,
};
