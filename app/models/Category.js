const { model, Schema } = require("mongoose");

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kategori harus diisi"],
      minLength: [3, "Panjang nama kategori minimal 3 karakter"],
      maxLength: [20, "Panjang nama kategori maksimal 20 karakter"],
    },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
