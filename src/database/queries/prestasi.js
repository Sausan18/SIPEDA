const { query } = require("../helpers");

async function findAllPrestasi() {
  const row = await query(`SELECT * FROM prestasi ORDER BY id DESC`)
  return row;
}

async function findAllPrestasiByTahun(tahun) {
  const row = await query(`SELECT * FROM prestasi WHERE tahun ='${tahun}' ORDER BY id DESC`)
  return row;
}

async function createPrestasi(data) {
  const result = await query(`INSERT INTO prestasi (nim, nama, prestasi, tahun, file_path, user_id)
    VALUES (
      '${data.nim}',
      '${data.nama}',
      '${data.prestasi}',
      '${data.tahun}',
      '${data.file_path}',
      '${data.user_id}')
  `);

  let response = {
    error: true,
    message: 'Gagal membuat prestasi'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Prestasi berhasil dibuat'
    };
  }

  return response
}

async function updatePrestasiById(id, data) {
  const result = await query(`UPDATE prestasi
    SET nim = '${data.nim}',
      nama = '${data.nama}',
      prestasi = '${data.prestasi}',
      tahun = '${data.tahun}',
      file_path = '${data.file_path}',
      user_id = '${data.user_id}'
    WHERE id = ${id}
  `);

  let response = {
    error: true,
    message: 'Gagal merubah prestasi'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Prestasi berhasil diupdate'
    };
  }

  return response
}

async function deletePrestasiById(id) {
  const result = await query(`DELETE FROM prestasi WHERE id = ${id}`);

  let response = {
    error: true,
    message: 'Gagal menghapus prestasi'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Prestasi berhasil dihapus'
    };
  }

  return response
}

module.exports = {
  createPrestasi,
  findAllPrestasi,
  findAllPrestasiByTahun,
  updatePrestasiById,
  deletePrestasiById
}