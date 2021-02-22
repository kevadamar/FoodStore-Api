const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const HASH_ROUND = 10;

const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Nama Lengkap harus diisi"],
      maxLength: [255, "Panjang nama maksimal 255 karakter"],
      minLength: [3, "Panjang nama minimal 3 karakter"],
    },
    customer_id: Number,
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  (value) => {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Users").find({ email: value });

      return count.length == 0;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar!`
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("Users", userSchema);
