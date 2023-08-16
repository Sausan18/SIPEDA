const { query } = require("../helpers");

async function findAllBeasiswa() {
  const row = await query(`SELECT * FROM beasiswa ORDER BY id DESC`)
  return row;
}

async function findAllBeasiswaByTahun(tahun) {
  const row = await query(`SELECT * FROM beasiswa WHERE tahun ='${tahun}' ORDER BY id DESC`)
  return row;
}

async function findAllBeasiswaSearch(search) {
  const row = await query(`SELECT * FROM beasiswa WHERE nim LIKE '%${search}%' OR nama LIKE '%${search}%' OR nama_beasiswa LIKE '%${search}%' ORDER BY id DESC`)
  return row;
}

async function createBeasiswa(data) {
  const result = await query(`INSERT INTO beasiswa (nim, nama, nama_beasiswa, tahun, file_path, user_id)
    VALUES (
      '${data.nim}',
      '${data.nama}',
      '${data.nama_beasiswa}',
      '${data.tahun}',
      '${data.file_path}',
      '${data.user_id}')
  `);

  let response = {
    error: true,
    message: 'Gagal membuat beasiswa'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Beasiswa berhasil dibuat'
    };
  }

  return response
}

async function updateBeasiswaById(id, data) {
  const result = await query(`UPDATE beasiswa
    SET nim = '${data.nim}',
      nama = '${data.nama}',
      nama_beasiswa = '${data.nama_beasiswa}',
      tahun = '${data.tahun}',
      file_path = '${data.file_path}',
      user_id = '${data.user_id}'
    WHERE id = ${id}
  `);

  let response = {
    error: true,
    message: 'Gagal merubah beasiswa'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Beasiswa berhasil diupdate'
    };
  }

  return response
}

async function deleteBeasiswaById(id) {
  const result = await query(`DELETE FROM beasiswa WHERE id = ${id}`);

  let response = {
    error: true,
    message: 'Gagal menghapus beasiswa'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Beasiswa berhasil dihapus'
    };
  }

  return response
}

module.exports = {
  findAllBeasiswa,
  findAllBeasiswaByTahun,
  createBeasiswa,
  updateBeasiswaById,
  deleteBeasiswaById,
  findAllBeasiswaSearch
}