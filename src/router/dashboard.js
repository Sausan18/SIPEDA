const { getCountAllData } = require("../database/queries/dashboard");
const getUser = require("../utils/getUser");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");

  const countData = await getCountAllData();

  res.render('pages/dashboard', {
    sidebar: "dashboard",
    user,
    countData
  });
})

module.exports = router;