const mongoose = require("mongoose");

const bcrypt = require('bcryptjs')

const HASH_ROUND = 10

let pembeliSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email Harus Diisi"],
  },
  name: {
    type: String,
    require: [true, "Email Harus Diisi"],
    maxlength: [225, "panjang nama harus antara 3-225 karakter"],
    minlength: [3, "panjang nama harus antara 3-225 karakter"],
  },
  username: {
    type: String,
    require: [true, "Email Harus Diisi"],
    maxlength: [225, "panjang username harus antara 3-225 karakter"],
    minlength: [3, "panjang username harus antara 3-225 karakter"],
  },
  password: {
    type: String,
    require: [true, "Kata Sandi Harus Diisi"],
    maxlength: [225, "panjang password harus antara 3-225 karakter"],
  },
  status: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },
  avatar:{
    type: String,
  },
  fileName : {type:String},
  phoneNumber: {
    type: String,
    require: [true, "Nomor Telepon Harus Diisi"],
    maxlength: [13, "panjang nomor handphobe harus antara 9-13 karakter"],
    minlength: [9, "panjang nomor handphobe harus antara 9-13 karakter"],
  },
  favorit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
},{ timestamps: true });

pembeliSchema.path('email').validate(async function (value){
  try {
    const count = await this.model('Pembeli').countDocuments({ email : value })
    return !count;
  } catch (err) {
    throw err
  }
}, attr => `${attr.value} sudah terdaftar`)

pembeliSchema.pre('save', function (next){
  this.password = bcrypt.hashSync(this.password, HASH_ROUND)
  next()
})

module.exports = mongoose.model("Pembeli", pembeliSchema);
