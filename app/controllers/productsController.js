const fs = require("fs");
const path = require("path");
const pathConfig = require("../config");
const Product = require("../models/Product");
const { errField } = require("../helpers");

// index Products
const index = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;
    // console.log(page);
    const products = await Product.find()
      .select("_id name price stock status image_url createdAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(parseInt(size) * 1)
      .skip((parseInt(page) - 1) * parseInt(size));

    if (products.length > 0) {
      return res.status(200).send({
        status: 200,
        messages: "List Products",
        totalData: products.length,
        data: products,
      });
    } else {
      return res.status(200).send({
        status: 200,
        messages: "List Products Kosong",
        totalData: 0,
        data: null,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
      totalData: 0,
      data: null,
    });
  }
};

// Get Product
const get = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    // console.log(product);

    if (product) {
      return res.status(200).send({
        status: 200,
        messages: "Product Detail",
        data: product,
      });
    } else {
      return res.status(404).send({
        status: 404,
        messages: "Product Tidak ada",
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

// destroy Product
const destroy = async (req, res, next) => {
  const { id } = req.body;
  //   console.log(req.body)
  try {
    let product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
      return res.status(404).send({
        status: 404,
        messages: "Product Not Found",
      });
    }

    let currentImage = `${pathConfig.rootPath}/public/uploads/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.status(200).send({
      status: 200,
      messages: "Product Deleted",
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

// store Product
const store = async (req, res, next) => {
  try {
    if (req.file) {
      let tmp_data = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = `${req.file.filename}.${originalExt}`;
      let target_path = path.resolve(
        pathConfig.rootPath,
        `public/uploads/${filename}`
      );

      const src = fs.createReadStream(tmp_data);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        const product = new Product({ ...req.body, image_url: filename });
        // console.log("with image");
        await product.save();

        res.status(201).send({
          status: 201,
          messages: "Product Created",
          data: product,
        });
      });
      src.on("error", async (err) => {
        next(err);
      });
    } else {
      const product = new Product(req.body);
      // console.log("no image");
      await product.save();

      res.status(201).send({
        status: 201,
        messages: "Product Created",
        data: product,
      });
    }
  } catch (error) {
    // console.log("error:" ,error);
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

// Update Product
const update = async (req, res, next) => {
  const { id } = req.body;

  try {
    if (req.file) {
      let tmp_data = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = `${req.file.filename}.${originalExt}`;
      let target_path = path.resolve(
        pathConfig.rootPath,
        `public/uploads/${filename}`
      );

      const src = fs.createReadStream(tmp_data);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        let product = await Product.findOne({ _id: id });
        if (!product) {
          return res.status(404).send({
            status: 404,
            messages: "Product Not Found",
          });
        }
        let currentImage = `${pathConfig.rootPath}/public/uploads/${product.image_url}`;
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndUpdate(
          { _id: id },
          { ...req.body, image_url: filename },
          { new: true, runValidators: true }
        );
        // console.log("error : ", product);

        res.status(200).send({
          status: 200,
          messages: "Product Updated",
          data: product,
        });
      });
    } else {
      const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });
      // console.log(product);
      await product.save();

      res.status(200).send({
        status: 200,
        messages: "Product Updated",
        data: product,
      });
    }
  } catch (error) {
    // console.log("error:" ,error);
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
  destroy,
  get,
};
