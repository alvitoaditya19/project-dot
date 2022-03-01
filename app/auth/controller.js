const Pembeli = require('../pembeli/model');
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtKey } = require('../../config');


module.exports = {
  signup : async (req, res, next) => {
    try {
      const payload = req.body

      if(req.file){
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
            const pembeli = new Pembeli({ ...payload, avatar: filename });

            await pembeli.save();

            
            delete pembeli._doc.password

            res.status(201).json({ data : pembeli })

          } catch (err) {
            if(err && err.name === "ValidationError"){
              return res.status(422).json({
                error: 1,
                message: err.message,
                fields: err.errors,
              })
            }
            next(err)
          }
        });
      }else{
        let pembeli = new Pembeli(payload)

        await pembeli.save()

        delete pembeli._doc.password

        res.status(201).json({ data : pembeli })
      }

    } catch (err) {
      if(err && err.name === "ValidationError"){
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        })
      }
      next(err)
    }
  },

  signin : (req, res) => {
    const { email, password } = req.body

    Pembeli.findOne({ email : email }).then((pembeli) => {
      if(pembeli){
        const checkPassword = bcrypt.compareSync(password, pembeli.password)
        if(checkPassword){
          const token = jwt.sign({
            pembeli : {
              id: pembeli.id,
              username: pembeli.username,
              email: pembeli.email,
              nama : pembeli.nama,
              phoneNumber : pembeli.phoneNumber,
              avatar: pembeli.avatar,
            }
          }, config.jwtKey)

          res.status(200).json({
            data:{ token }
          })
        }else{
          res.status(403).json({
            message: 'password yang anda masukkan salah'
          })
        }
      } else{
        res.status(403).json({
          message: 'email yang anda masukan belum terdaftar'
        })
      }
    }).catch((err)=>{
      message: err.message || 'Internal Server Error'
    })
  }
}