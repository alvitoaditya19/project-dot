
const Product = require('../product/model');
const Pembeli = require('../pembeli/model');
const Category = require('../category/model');

module.exports = {
  index: async (req, res) => {
    try {     
      const product = await Product.countDocuments();
      const pembeli = await Pembeli.countDocuments();
      const category = await Category.countDocuments();
      res.render("admin/dashboard/view_dashboard",{
        name : req.session.admin.name,
        title: "Halaman Dashboard",
        count: {
          product,
          pembeli,
          category,
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
