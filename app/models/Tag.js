const { model, Schema } = require("mongoose");

const tagSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama tag harus diisi"],
      minLength: [3, "Panjang nama tag minimal 3 karakter"],
      maxLength: [20, "Panjang nama tag maksimal 20 karakter"],
    },
  },
  { timestamps: true }
);

module.exports = model("Tag", tagSchema);
