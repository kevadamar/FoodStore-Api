const Tag = require("../models/Tag");
const { policyFor } = require("../policy");

const index = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;
    // console.log(page);
    const tag = await Tag.find()
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(parseInt(size) * 1)
      .skip((parseInt(page) - 1) * parseInt(size));

    if (tag.length > 0) {
      return res.status(200).send({
        status: 200,
        messages: "List Tag",
        totalData: tag.length,
        data: tag,
      });
    } else {
      return res.status(200).send({
        status: 200,
        messages: "List Tag Kosong",
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

// Get Tag
const get = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    // console.log(Tag);

    if (tag) {
      return res.status(200).send({
        status: 200,
        messages: "Tag Detail",
        data: tag,
      });
    } else {
      return res.status(404).send({
        status: 404,
        messages: "Tag Tidak ada",
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

// destroy Tag
const destroy = async (req, res, next) => {
  try {
    const { id } = req.body;
    let policy = policyFor(req.user);

    if (!policy.can("delete", "Tag")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses menghapus tag",
      });
    }
    let tag = await Tag.findOneAndDelete({ _id: id });
    // console.log(Tag);
    return res.status(200).send({
      status: 200,
      messages: "Tag Deleted",
      data: null,
    });
  } catch (error) {
    console.log("error : ", error);
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

// Update Tag
const update = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("update", "Tag")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses update tag",
      });
    }
    let tag = await Tag.findOneAndUpdate(
      { _id: req.body.id },
      { name: `${req.body.name}` },
      { new: true, runValidators: true }
    );
    if (!tag) {
      return res.json({
        error: 404,
        message: "Tag Not Found",
      });
    }
    return res.status(200).send({
      status: 200,
      messages: "Tag Updated",
      data: tag,
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

// Create Tag
const store = async (req, res, next) => {
  try {
    let { body, user } = req;

    let policy = policyFor(user);

    if (!policy.can("create", "Tag")) {
      return res.status(400).json({
        error: 1,
        message: "User tidak memiliki akses membuat tag",
      });
    }

    let tag = new Tag(body);

    await tag.save();

    return res.status(201).send({
      status: 201,
      messages: "Tag Created",
      data: tag,
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
