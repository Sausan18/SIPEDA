// Module import
const express = require('express');
const path = require("path");
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash');
const cors = require("cors");
require("dotenv").config();

// Package import
const setupDb = require('./src/database/queries/setup');
const { findAllSuratMasuk, findAllSuratMasukByTahun } = require('./src/database/queries/suratmasuk');
const { findAllSuratKeluar, findAllSuratKeluarByTahun } = require('./src/database/queries/suratkeluar');
const { findAllLpj, findAllLpjByTahun, findAllLpjSearch } = require('./src/database/queries/lpj');

// Express app
const app = express()
const port = process.env.PORT || 5000

// Set views folder
app.set('views', path.join(__dirname, 'views'));
// Set engine ejs
app.set('view engine', 'ejs')
// Static public file
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors());

app.use(session({
    secret:'idk',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

if (process.env.SETUPDB === "true")
setupDb()
  .then((res) => console.log(res))
  .catch((err) => console.log(`Database setup error => ${err.message}`));


app.get('/', async (req, res) => {

  const { tahun, search } = req.query;
  
  let tahunOption = [];
  let surat = await findAllLpj();
  surat.forEach((surat) => tahunOption.push(new Date(surat.tanggal_pelaksana).getFullYear()));
  tahunOption = [...new Set(tahunOption)];

  if (tahun) {
    surat = await findAllLpjByTahun(tahun);
  }

  if (search) {
    surat = await findAllLpjSearch(search);
  }
  res.render('pages/index', {
    surat,
    tahunOption
  })
});


app.use('/login', require("./src/router/login"))
app.use('/dashboard', require("./src/router/dashboard"))
app.use('/kegiatan', require("./src/router/kegiatan"))
app.use('/prestasi', require("./src/router/prestasi"))
app.use('/beasiswa', require("./src/router/beasiswa"))
app.use('/pengguna', require("./src/router/user"))
app.use('/localfile', require("./src/router/pdf"))


app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/login')
})

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})