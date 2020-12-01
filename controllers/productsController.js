const fs = require("fs");
const path = require("path");
const pathConfig = require("../config/pathConfig");
const Product = require("../models/Product");

// GetAll Products
module.exports.getAll = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    console.log(page);
    const products = await Product.find()
      .select("_id name price stock status image_url createdAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(parseInt(size) * 1)
      .skip((parseInt(page) - 1) * parseInt(size));

    if (products.length > 0) {
      res.status(200).send({
        status: 200,
        messages: "List Products",
        totalData: products.length,
        data: products,
      });
    } else {
      res.status(200).send({
        status: 200,
        messages: "List Products Kosong",
        totalData: 0,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
      totalData: 0,
      data: null,
    });
  }
};

// Get Product
module.exports.get = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    // console.log(product);

    if (product) {
      res.status(200).send({
        status: 200,
        messages: "Product Detail",
        data: product,
      });
    } else {
      res.status(404).send({
        status: 404,
        messages: "Product Tidak ada",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      messages: "Internal Server Error",
    });
  }
};

module.exports.createOrUpdate = (req, res, next) => {
  console.log(req.path.substr(1).toLowerCase());
  if (req.body.id) {
    if (req.path.substr(1).toLowerCase() === "delete") {
      destroy(req, res, next);
    } else {
      update(req, res, next);
    }
  } else {
    create(req, res, next);
  }
};

// Create Product
const create = async (req, res, next) => {
  // console.log(req)
  // const { name, price, stock, status } = req.body;
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
        console.log(product);
        await product.save();

        res.status(201).send({
          status: 201,
          messages: "Product Created",
          data: product,
        });
      });
    } else {
      const product = new Product(req.body);
      console.log(product);
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
      return res.json({
        error: 404,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

// Update Product
const update = async (req, res, next) => {

  const {id} = req.body;

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
        // console.log("error : ",product)
        let currentImage = `${pathConfig.rootPath}/public/uploads/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndUpdate(
          { _id: id },
          { ...req.body, image_url: filename },
          { new: true, runValidators: true }
        );
        console.log("error : ",product)

        res.status(200).send({
          status: 200,
          messages: "Product Updated",
          data: product,
        });
      });
    } else {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true, runValidators: true }
      );
      console.log(product);
      await product.save();

      res.status(200).send({
        status: 200,
        messages: "Product Created",
        data: product,
      });
    }
  } catch (error) {
    // console.log("error:" ,error);
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 404,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
};

// destroy Product
const destroy = async (req, res, next) => {
  const { id } = req.body;
  //   console.log(req.body)
  try {
    let product = await Product.findOneAndDelete({ _id: id });

    let currentImage = `${pathConfig.rootPath}/public/uploads/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    res.status(200).send({
      status: 200,
      messages: "Product Deleted",
      data: null,
    });
  } catch (error) {
    // console.log("error : ", error);
    res.send({
      status: 400,
      messages: error.message,
    });
    next(error);
  }
};
