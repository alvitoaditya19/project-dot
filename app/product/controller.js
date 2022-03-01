const req = require("express/lib/request");
const Product = require("./model");

const Category = require("../category/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const product = await Product.find()
        .populate("category");

      console.log("product ==>");
      console.log(product);

      res.render("admin/product/view_product", {
        product,
        alert,
        name: req.session.admin.name,
        title: "Halaman Product",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();

      res.render("admin/product/create", {
        category,
        name: req.session.admin.name,
        title: "Halaman Tambah Product",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, category } = req.body;
      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const product = new Product({
              name,
              category,
              thumbnial: filename,
            });

            console.log(product);
            await product.save();

            req.flash("alertMessage", "Berhasil tambah product");
            req.flash("alertStatus", "success");

            res.redirect("/product");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/product");
          }
        });
      } else {
        const product = new Product({
          name,
          category,
        });

        await product.save();

        req.flash("alertMessage", "Berhasil tambah product");
        req.flash("alertStatus", "success");

        res.redirect("/product");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const product = await Product.findOne({ _id: id })
        .populate("category");

      res.render("admin/product/edit", {
        product,
        category,
        name: req.session.admin.name,
        title: "Halaman Ubah Product",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const product = await Product.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${product.thumbnial}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Product.findOneAndUpdate(
              {
                _id: id,
              },
              {
                name,
                category,
                thumbnial: filename,
              }
            );

            req.flash("alertMessage", "Berhasil ubah product");
            req.flash("alertStatus", "success");

            res.redirect("/product");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/product");
          }
        });
      } else {
        await Product.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            category,
          }
        );

        req.flash("alertMessage", "Berhasil ubah product");
        req.flash("alertStatus", "success");

        res.redirect("/product");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
    actionDelete: async (req, res) => {
      try {
        const { id } = req.params;
        const product = await Product.findOneAndRemove({
          _id: id,
        });

        let currentImage = `${config.rootPath}/public/uploads/${product.thumbnial}`;
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        req.flash("alertMessage", "Berhasil Hapus product");
        req.flash("alertStatus", "success");

        res.redirect("/product");
      } catch (err) {
        req.flash("alertMessage", `${err.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/product");
      }
    },

    actionStatus: async (req,res)=>{
    try {
      const { id } = req.params
      let product = await Product.findOne({_id:id})
      let status = product.status === 'Y' ? 'N' : 'Y'

      product = await Product.findOneAndUpdate({
        _id:id
      },{status})

        req.flash("alertMessage", "Berhasil Ubah Status");
        req.flash("alertStatus", "success");

        res.redirect("/product");

    } catch (error) {
        req.flash("alertMessage", `${err.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/product");
    }
    }
};
