const {model,Schema} = require("mongoose");

const productSchema = Schema({
  name: {
    type: String,
    required: [true, "Nama makanan harus diisi"],
    minLength: [3,"Panjang nama makanan minimal 3 karakter"],
    maxLength: [255,"Panjang nama makanan maksimal 255 karakter"]
  },
  description:{
    type: String,
    maxLength: [1000,"Panjang deskripsi maksimal 1000 karakter"],
    required: [true, "Deskripsi harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "price harus diisi"],
    default:0,
    min: 0,
    max: 10000000,
  },
  image_url:{
    type:String,
  },
  stock: {
    type:Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true,
  }
},{timestamps: true});

module.exports = model("Product", productSchema);
