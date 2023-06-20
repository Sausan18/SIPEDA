const router = require("express").Router();

router.get("/:filepath", (req, res) => {
  res.render('pages/pdfview', { filepath: "/files/" + req.params.filepath })
})

module.exports = router;