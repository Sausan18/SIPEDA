const { findAllBeasiswaByTahun, findAllBeasiswa, createBeasiswa, updateBeasiswaById, deleteBeasiswaById } = require("../database/queries/beasiswa");
const multer = require("multer");
const getUser = require("../utils/getUser");
const upload = multer({ dest: "public/files/" });
const excelJs = require("exceljs");
const fs = require("fs");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");

  const { tahun } = req.query;

  let tahunOption = [];
  let beasiswa = await findAllBeasiswa();
  beasiswa.forEach((beasiswa) => tahunOption.push(beasiswa.tahun));
  tahunOption = [...new Set(tahunOption)];

  if (tahun) {
    beasiswa = await findAllBeasiswaByTahun(tahun);
  }

  const error = req.flash('error');
  const success = req.flash('success');
  res.render('pages/beasiswa', {
    sidebar: "beasiswa",
    user,
    beasiswa,
    tahunOption,
    error,
    success
  })
});

router.post("/", upload.array('files'), async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const body = JSON.parse(JSON.stringify(req.body));
  if (body.nim == '' ||
      body.namamahasiswa == '' ||
      body.namabeasiswa == '' ||
      body.tahun == '') {
        req.flash('error', 'Form tidak boleh ada yang kosong');
        return res.redirect('beasiswa')
      }

  const beasiswaId = body['id-beasiswa'];

  if (!beasiswaId || beasiswaId == '0') {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const beasiswaNew = await createBeasiswa({
      nim: body.nim,
      nama: body.namamahasiswa,
      nama_beasiswa: body.namabeasiswa,
      tahun: body.tahun,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });

    if (beasiswaNew.error) {
      req.flash('error', beasiswaNew.message)
      return res.redirect('beasiswa');
    }
    req.flash('success', beasiswaNew.message)
    return res.redirect("beasiswa")
  } else {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }

    const updateBeasiswa = await updateBeasiswaById(beasiswaId, {
      nim: body.nim,
      nama: body.namamahasiswa,
      nama_beasiswa: body.namabeasiswa,
      tahun: body.tahun,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });

    if (updateBeasiswa.error) {
      req.flash('error', updateBeasiswa.message)
      return res.redirect('beasiswa');
    }
    req.flash('success', updateBeasiswa.message)
    return res.redirect("beasiswa");
  }
});

router.get("/delete", async (req, res) => {
  const deleteRes = await deleteBeasiswaById(req.query.id);

  if (deleteRes.error) {
    req.flash('error', deleteRes.message);
    return res.redirect('/beasiswa')
  }
  req.flash('success', deleteRes.message);
  return res.redirect("/beasiswa");
});

router.get("/export", async (req, res) => {
  const beasiswa = await findAllBeasiswa();
  try {
    let workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet("Beasiswa");
    sheet.columns = [
      { header: "NIM", key: "nim", width: 15 },
      { header: "Nama Mahasiswa", key: "nama", width: 30 },
      { header: "Nama Beasiswa", key: "nama_beasiswa", width: 30 },
      { header: "Tahun", key: "tahun", width: 15 },
    ];

    await beasiswa.map((data, idx) => {
      sheet.addRow(data)
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "beasiswa.xlsx")

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    req.flash("error", error.message)
    console.log(error);
    res.redirect("/beasiswa");
  }
})

module.exports = router;