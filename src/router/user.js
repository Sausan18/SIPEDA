const { createUser, findOneByUsername, findAllUserByRole, updateUserById, deleteUserById } = require("../database/queries/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const getUser = require("../utils/getUser");
const upload = multer({ dest: "public/files/" });
const fs = require("fs");
const { findAllUser } = require("../database/queries/user");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");

  const { role } = req.query;

  let users;

  if (role) {
    users = await findAllUserByRole(role);
  } else {
    users = await findAllUser();
  }

  const error = req.flash('error')
  const success = req.flash('success')

  return res.render('pages/pengguna', {
    sidebar: "pengguna",
    user,
    users,
    error,
    success
  })
})

router.post("/", upload.array('files'), async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const body = JSON.parse(JSON.stringify(req.body));
  
  if (body.nama == "" ||
      body.username == "" ||
      body.role == ""    
  ) {
    req.flash('error', 'Form tidak boleh ada yang kosong');
    return res.redirect('pengguna')
  }

  const userId = body['id-pengguna'];

  if (!userId || userId == "0") {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    } else {
      req.flash('error', 'Foto tidak boleh kosong');
      return res.redirect('pengguna')
    }

    const isUsernameExists = await findOneByUsername(body.username);
    if (isUsernameExists) {
      req.flash('error', 'Username telah digunakan');
      return res.redirect('pengguna')
    }

    const salt = 10
    let password = await bcrypt.hash(body.password, salt);

    const userNew = await createUser({
      nama: body.nama,
      username: body.username,
      password,
      role: body.role,
      foto_path: filePath.split('\\').join("/")
    });

    if (userNew.error) {
      req.flash('error', userNew.message)
      return res.redirect('pengguna');
    }
    req.flash('success', userNew.message)
    return res.redirect("pengguna")
  } else {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }

    const salt = 10;
    let password = null;

    if (body.password && body.password != "" ) 
      password = await bcrypt.hash(body.password, salt);

    const updateUser = await updateUserById(userId, {
      nama: body.nama,
      username: body.username,
      password,
      role: body.role,
      foto_path: filePath.split('\\').join("/")
    });

    if (updateUser.error) {
      req.flash('error', updateUser.message)
      return res.redirect('pengguna');
    }
    req.flash('success', updateUser.message);
    return res.redirect("pengguna");
  }
})

router.get("/delete", async (req, res) => {
  const deleteRes = await deleteUserById(req.query.id);

  if (deleteRes.error) {
    req.flash("error", deleteRes.message);
    return res.redirect("/pengguna");
  }

  req.flash("success", deleteRes.message);
  return res.redirect("/pengguna");
})

module.exports = router;