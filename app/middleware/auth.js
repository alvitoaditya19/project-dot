module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.admin === null || req.session.admin === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan join kembali`
      );
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
      next();
    }
  },
};
