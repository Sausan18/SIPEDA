const { query } = require("../helpers");

async function findAllSuratMasuk() {
  const row = await query(`SELECT * FROM surat_masuk ORDER BY id DESC`)
  return row;
}

async function findAllSuratMasukByTahun(tahun) {
  const row = await query(`SELECT * FROM surat_masuk WHERE YEAR(tanggal_surat) ='${tahun}' ORDER BY id DESC`)
  return row;
}

async function findAllSuratMasukSearch(search) {
  const row = await query(`SELECT * FROM surat_masuk WHERE no_surat LIKE '%${search}%' OR instansi LIKE '%${search}%' OR perihal LIKE '%${search}%' ORDER BY id DESC`)
  return row;
}

async function findOneSuratMasukByNo(no) {
  const row = await query(`SELECT * FROM surat_masuk WHERE no_surat='${no}'`);
  if (row.length > 0) return row[0]
  return null;
}

async function createSuratMasuk(data) {
  const result = await query(`INSERT INTO surat_masuk (no_surat, instansi, perihal, tanggal_surat, file_path, user_id) VALUES (
    '${data.no_surat}', '${data.instansi}', '${data.perihal}', '${data.tanggal_surat}', '${data.file_path}', '${data.user_id}'
  )`);

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

async function updateSuratMasukById(id, data) {
  const result = await query(`UPDATE surat_masuk 
    SET no_surat = '${data.no_surat}', 
      instansi = '${data.instansi}', 
      perihal = '${data.perihal}', 
      tanggal_surat = '${data.tanggal_surat}', 
      file_path = '${data.file_path}', 
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

async function deleteSuratMasukById(id) {
  const result = await query(`DELETE FROM surat_masuk WHERE id = ${id}`);

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
  findAllSuratMasuk,
  findAllSuratMasukByTahun,
  createSuratMasuk,
  findOneSuratMasukByNo,
  updateSuratMasukById,
  deleteSuratMasukById,
  findAllSuratMasukSearch
}