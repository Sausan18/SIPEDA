const { createUser, findOneByUsername } = require("../database/queries/user");
const bcrypt = require("bcrypt");

const router = require("express").Router();

router.get("/", (req, res) => {
  const error = req.flash('error');
  res.render('pages/login', { error });
})

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await findOneByUsername(username);

  if (!user) {
    req.flash('error', 'Username tidak ditemukan')
    return res.redirect('/login')
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash('error', 'Password anda salah')
    return res.redirect('/login')
  } 
  res.cookie(`user`, JSON.stringify({ id: user.id, username: user.username, role: user.role }));
  return res.redirect('/dashboard')
})

module.exports = router;