const req = require("express/lib/request");
const Pembeli = require("./model");
const Category = require('../category/model');
const Product = require('../product/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const pembeli = await Pembeli.find();
      res.render("admin/pembeli/view_pembeli", {
        alert,
        pembeli,
        name: req.session.admin.name,
        title: "Halaman Pembeli",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/pembeli");
    }
  },
  landingPage: async(req, res)=>{
    try {
      const product = await Product.find()
      .select('_id name status category thumbnail')
      .populate('category');

        res.status(200).json({data: product});
    } catch (err) {
      res.status(500).json({message: err.message || `Internal Server Error`})
    }
  },

  category : async(req,res)=>{
    try {
      const category = await Category.find()
      res.status(200).json({ data: category})
    } catch (err) {
      res.status(500).json({message: err.message || `Internal Server Error`});
    }
  },
}