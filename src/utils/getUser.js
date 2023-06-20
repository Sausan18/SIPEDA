const { findOneByUsername } = require("../database/queries/user");
const fs = require("fs");
const path = require("path");

async function getUser (req, res) {
  let { user } = req.cookies;

  if (!user) {
    return null;
  } else {
    try {
      user = JSON.parse(user);
      user = await findOneByUsername(user.username);
      try {
        if (!fs.existsSync(path.resolve(user.foto_path))) {
          user.foto_path = "public/img/profile.png";
        }
      } catch(err) {
        user.foto_path = "public/img/profile.png";
      }
      return user;
    } catch (error) {
      res.clearCookie('user')
      return null;
    }
  }

}

module.exports = getUser