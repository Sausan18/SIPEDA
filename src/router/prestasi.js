const multer = require("multer");
const getUser = require("../utils/getUser");
const upload = multer({ dest: "public/files/" });
const fs = require("fs");
const excelJs = require("exceljs");
const { createPrestasi, findAllPrestasiByTahun, findAllPrestasi, updatePrestasiById, deletePrestasiById } = require("../database/queries/prestasi");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const { tahun } = req.query;

  let tahunOption = [];
  let prestasi = await findAllPrestasi();
  prestasi.forEach((prestasi) => tahunOption.push(prestasi.tahun));
  tahunOption = [...new Set(tahunOption)];

  if (tahun) {
    prestasi = await findAllPrestasiByTahun(tahun);
  }

  const error = req.flash('error');
  const success = req.flash('success');
  res.render('pages/prestasi', {
    sidebar: "prestasi",
    user,
    prestasi,
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
      body.prestasi == '' ||
      body.tahun == '') {
        req.flash('error', 'Form tidak boleh ada yang kosong');
        return res.redirect('prestasi')
      }
  const prestasiId = body['id-prestasi'];
  
  if (!prestasiId || prestasiId == '0') {
    let filePath = null;
    
    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const prestasiNew = await createPrestasi({
      nim: body.nim,
      nama: body.namamahasiswa,
      prestasi: body.prestasi,
      tahun: body.tahun,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });

    if (prestasiNew.error) {
      req.flash('error', prestasiNew.message)
      return res.redirect('prestasi');
    }
    req.flash('success', prestasiNew.message);
    return res.redirect("prestasi")
  } else {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }

    const updatePrestasi = await updatePrestasiById(prestasiId, {
      nim: body.nim,
      nama: body.namamahasiswa,
      prestasi: body.prestasi,
      tahun: body.tahun,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });

    if (updatePrestasi.error) {
      req.flash('error', updatePrestasi.message)
      return res.redirect('prestasi');
    }
    req.flash('success', updatePrestasi.message);
    return res.redirect("prestasi");
  }

});

router.get("/delete", async (req, res) => {
  const deleteRes = await deletePrestasiById(req.query.id);

  if (deleteRes.error) {
    req.flash('error', deleteRes.message);
    return res.redirect('/prestasi')
  }
  req.flash('success', deleteRes.message);
  return res.redirect("/prestasi");
});

router.get("/export", async (req, res) => {
  const { tahun } = req.query;
  let prestasi = await findAllPrestasi();
  if (tahun && tahun != "null") {
    prestasi = await findAllPrestasiByTahun(tahun);
  }

  try {
    let workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet("Prestasi");
    sheet.columns = [
      { header: "NIM", key: "nim", width: 15 },
      { header: "Nama Mahasiswa", key: "nama", width: 30 },
      { header: "Prestasi", key: "prestasi", width: 20 },
      { header: "Tahun", key: "tahun", width: 15 },
    ];

    await prestasi.map((data, idx) => {
      sheet.addRow(data)
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "prestasi.xlsx")

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    req.flash("error", error.message)
    console.log(error);
    res.redirect("/prestasi");
  }
})

module.exports = router;