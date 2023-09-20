const getUser = require("../utils/getUser");
const multer = require("multer");
const fs = require("fs");
const { findAllSuratKeluarByTahun, findAllSuratKeluar, findOneSuratKeluarByNo, createSuratKeluar, updateSuratKeluarById, deleteSuratKeluarById, findAllSuratKeluarSearch } = require("../database/queries/suratkeluar");
const { findAllSuratMasuk, findOneSuratMasukByNo, createSuratMasuk, findAllSuratMasukByTahun, updateSuratMasukById, deleteSuratMasukById, findAllSuratMasukSearch } = require("../database/queries/suratmasuk");
const { createLpj, updateLpjById, findAllLpjByTahun, findAllLpj, deleteLpjById, findAllLpjSearch } = require("../database/queries/lpj");
const upload = multer({ dest: "public/files/" });
const path = require("path")

const router = require("express").Router();

router.get("/", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  return res.render('pages/kegiatan', {
    sidebar: "kegiatan",
    user,
  })
});

router.get("/suratmasuk", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login")
  user.foto_path = "public/" + user.foto_path.split("public")[1]
  const { tahun, search } = req.query;

  let tahunOption = [];
  let surat = await findAllSuratMasuk();

  surat.forEach((surat) => tahunOption.push(new Date(surat.tanggal_surat).getFullYear()));
  tahunOption = [...new Set(tahunOption)]

  if (tahun) {
    surat = await findAllSuratMasukByTahun(tahun);
  }

  if (search) {
    surat = await findAllSuratMasukSearch(search);
  }

  const error = req.flash('error');
  const success = req.flash('success');
  res.render('pages/suratmasuk', {
    sidebar: "kegiatan",
    user,
    surat,
    tahunOption,
    error,
    success
  })
});

router.post("/suratmasuk", upload.array('files'), async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const body = JSON.parse(JSON.stringify(req.body));

  if (body.nomorsurat == '' || 
      body.instansi == '' || 
      body.perihal == '' || 
      body.tanggal == '') {
        req.flash('error', 'Form tidak boleh ada yang kosong')
        return res.redirect('suratmasuk')
      }

  const suratId = body['id-surat-masuk'];
  if (!suratId || suratId == "0") {
    const isNoSuratDuplicate = await findOneSuratMasukByNo(body.nomorsurat);
    if (isNoSuratDuplicate) {
      req.flash('error', 'Nomor surat masuk telah digunakan');
      return res.redirect('suratmasuk');
    }
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const suratNew = await createSuratMasuk({
      no_surat: body.nomorsurat,
      instansi: body.instansi,
      perihal: body.perihal,
      tanggal_surat: body.tanggal,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });
  
    if (suratNew.error) {
      req.flash('error', suratNew.message)
      return res.redirect('suratmasuk');
    }
    req.flash('success', suratNew.message)
    return res.redirect("suratmasuk")
  } else {
    let filePath = null;
    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }

    const updateSurat = await updateSuratMasukById(suratId, {
      no_surat: body.nomorsurat,
      instansi: body.instansi,
      perihal: body.perihal,
      tanggal_surat: body.tanggal,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      user_id: user.id
    });

    if (updateSurat.error) {
      req.flash('error', updateSurat.message)
      return res.redirect('suratmasuk');
    }
    req.flash('success', updateSurat.message)
    return res.redirect("suratmasuk");
  }

});

router.get("/suratmasuk/delete", async (req, res) => {
  const deleteRes = await deleteSuratMasukById(req.query.id);

  if (deleteRes.error) {
    req.flash('error', deleteRes.message);
    return res.redirect('/kegiatan/suratmasuk')
  }
  req.flash('success', deleteRes.message)
  return res.redirect("/kegiatan/suratmasuk");
});

router.get("/suratkeluar", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login")
  user.foto_path = "public/" + user.foto_path.split("public")[1]

  const { tahun, search } = req.query;

  let tahunOption = [];
  let surat = await findAllSuratKeluar();
  surat.forEach((surat) => tahunOption.push(new Date(surat.tanggal_surat).getFullYear()));
  tahunOption = [...new Set(tahunOption)]

  if (tahun) {
    surat = await findAllSuratKeluarByTahun(tahun);
  }

  if (search) {
    surat = await findAllSuratKeluarSearch(search);
  }

  const error = req.flash('error');
  const success = req.flash('success');
  res.render('pages/suratkeluar', {
    sidebar: "kegiatan",
    user,
    surat,
    tahunOption,
    error,
    success,
  })
});

router.post("/suratkeluar", upload.array('files'), async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const body = JSON.parse(JSON.stringify(req.body));

  if (body.nomorsurat == '' || 
      body.perihal == '' || 
      body.tujuan == '' || 
      body.tanggal == '' ||
      body.penanggungjawab == '') {
        req.flash('error', 'Form tidak boleh ada yang kosong')
        return res.redirect('suratkeluar')
      }

  const suratId = body['id-surat-masuk'];
  if (!suratId || suratId == "0") {
    const isNoSuratDuplicate = await findOneSuratKeluarByNo(body.nomorsurat);
    if (isNoSuratDuplicate) {
      req.flash('error', 'Nomor surat masuk telah digunakan');
      return res.redirect('suratkeluar');
    }
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const suratNew = await createSuratKeluar({
      no_surat: body.nomorsurat,
      perihal: body.perihal,
      tujuan: body.tujuan,
      tanggal_surat: body.tanggal,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      penanggungjawab: body.penanggungjawab,
      user_id: user.id
    });

    if (suratNew.error) {
      req.flash('error', suratNew.message)
      return res.redirect('suratkeluar');
    }
    req.flash('success', suratNew.message);
    return res.redirect("suratkeluar")
  } else {
    let filePath = null;
    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const updateSurat = await updateSuratKeluarById(suratId, {
      no_surat: body.nomorsurat,
      perihal: body.perihal,
      tujuan: body.tujuan,
      tanggal_surat: body.tanggal,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      penanggungjawab: body.penanggungjawab,
      user_id: user.id,
    })

    if (updateSurat.error) {
      req.flash('error', updateSurat.message)
      return res.redirect('suratkeluar');
    }
    req.flash('success', updateSurat.message);
    return res.redirect("suratkeluar");
  }
});

router.get("/suratkeluar/delete", async (req, res) => {

  const deleteRes = await deleteSuratKeluarById(req.query.id);

  if (deleteRes.error) {
    req.flash('error', deleteRes.message);
    return res.redirect('/kegiatan/suratkeluar')
  }
  req.flash('success', deleteRes.message);
  return res.redirect("/kegiatan/suratkeluar");
});

router.get("/lpj", async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login")
  user.foto_path = "public/" + user.foto_path.split("public")[1]

  const { tahun, search } = req.query;

  let tahunOption = [];
  let surat = await findAllLpj();
  surat.forEach((surat) => {
    tahunOption.push(new Date(surat.tanggal_pelaksana).getFullYear())
    surat.deskripsi = surat.deskripsi.split("\r\n").join("")
  });
  tahunOption = [...new Set(tahunOption)]

  if (tahun) {
    surat = await findAllLpjByTahun(tahun);
  }

  if (search) {
    surat = await findAllLpjSearch(search);
  }


  const error = req.flash('error');
  const success = req.flash('success');
  res.render('pages/lpj', {
    sidebar: "kegiatan",
    user,
    surat,
    tahunOption,
    error,
    success
  })
});

router.post("/lpj", upload.array('files'), async (req, res) => {
  const user = await getUser(req, res);
  if (!user) return res.redirect("/login");
  const body = JSON.parse(JSON.stringify(req.body));
  
  if (body.namakegiatan == '' ||
      body.penanggungjawab == '' ||
      body.departemen == 'Departemen' ||
      body.tanggal == '' ||
      body.deskripsi == '') {
        req.flash('error', 'Form tidak boleh ada yang kosong');
        return res.redirect('lpj')
      }

  const suratId = body['id-surat-masuk'];
  if (!suratId || suratId == "0") {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const suratNew = await createLpj({
      nama: body.namakegiatan,
      penanggungjawab: body.penanggungjawab,
      departemen: body.departemen,
      tanggal_pelaksana: body.tanggal,
      deskripsi: body.deskripsi,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      url_photo: body.url_photo,
      user_id: user.id
    })

    if (suratNew.error) {
      req.flash('error', suratNew.message)
      return res.redirect('lpj');
    }
    req.flash('success', suratNew.message)
    return res.redirect("lpj");
  } else {
    let filePath = null;

    if (req.files[0]) {
      filePath = req.files[0].path + '-' + req.files[0].originalname
      fs.renameSync(req.files[0].path, filePath);
    }
    const updateSurat = await updateLpjById(suratId, {
      nama: body.namakegiatan,
      penanggungjawab: body.penanggungjawab,
      departemen: body.departemen,
      tanggal_pelaksana: body.tanggal,
      deskripsi: body.deskripsi,
      file_path: filePath ? filePath.split('\\').join("/") : null,
      url_photo: body.url_photo,
      user_id: user.id
    });

    if (updateSurat.error) {
      req.flash('error', updateSurat.message)
      return res.redirect('lpj');
    }
    req.flash('success', updateSurat.message)
    return res.redirect("lpj");
  }
});

router.get("/lpj/delete", async (req, res) => {
  const deleteRes = await deleteLpjById(req.query.id);

  if (deleteRes.error) {
    req.flash('error', deleteRes.message);
    return res.redirect('/kegiatan/lpj')
  }
  req.flash('success', deleteRes.message);
  return res.redirect("/kegiatan/lpj");
})

module.exports = router;