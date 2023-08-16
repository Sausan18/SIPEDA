const { query } = require("../helpers");

async function findAllLpj() {
  const row = await query(`SELECT * FROM lpj ORDER BY id DESC`)
  return row;
}

async function findAllLpjByTahun(tahun) {
  const row = await query(`SELECT * FROM lpj WHERE YEAR(tanggal_pelaksana) ='${tahun}' ORDER BY id DESC`)
  return row;
}

async function findAllLpjSearch(search) {
  const row = await query(`SELECT * FROM lpj WHERE nama LIKE '%${search}%' OR penanggungjawab LIKE '%${search}%' OR departemen LIKE '%${search}%' ORDER BY id DESC`)
  return row;
}

async function createLpj(data) {
  const result = await query(`INSERT INTO lpj (nama, penanggungjawab, departemen, tanggal_pelaksana, deskripsi, file_path, url_photo, user_id)
    VALUES ('${data.nama}',
    '${data.penanggungjawab}',
    '${data.departemen}',
    '${data.tanggal_pelaksana}',
    '${data.deskripsi}',
    '${data.file_path}',
    '${data.url_photo}',
    '${data.user_id}')
    `);

  let response = {
    error: true,
    message: 'Gagal membuat surat'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Surat berhasil dibuat'
    };
  }

  return response
}

async function updateLpjById(id, data) {
  const result = await query(`UPDATE lpj
    SET nama = '${data.nama}',
    penanggungjawab = '${data.penanggungjawab}',
    departemen = '${data.departemen}',
    tanggal_pelaksana = '${data.tanggal_pelaksana}',
    deskripsi = '${data.deskripsi}',
    file_path = '${data.file_path}',
    url_photo = '${data.url_photo}',
    user_id = '${data.user_id}'
    WHERE id = ${id}
  `);

  let response = {
    error: true,
    message: 'Gagal merubah surat'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Surat berhasil diupdate'
    };
  }

  return response
}

async function deleteLpjById(id) {
  const result = await query(`DELETE FROM lpj WHERE id = ${id}`);

  let response = {
    error: true,
    message: 'Gagal menghapus surat'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Surat berhasil dihapus'
    };
  }

  return response
}

module.exports = {
  findAllLpj,
  findAllLpjByTahun,
  createLpj,
  updateLpjById,
  deleteLpjById,
  findAllLpjSearch
}