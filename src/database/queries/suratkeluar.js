const { query } = require("../helpers");

async function findAllSuratKeluar() {
  const row = await query(`SELECT * FROM surat_keluar ORDER BY id DESC`)
  return row;
}

async function findAllSuratKeluarByTahun(tahun) {
  const row = await query(`SELECT * FROM surat_keluar WHERE YEAR(tanggal_surat) = '${tahun}' ORDER BY id DESC`)
  return row;
}

async function findOneSuratKeluarByNo(no) {
  const row = await query(`SELECT * FROM surat_keluar WHERE no_surat='${no}'`);
  if (row.length > 0) return row[0]
  return null;
}

async function createSuratKeluar(data) {
  const result = await query(`INSERT INTO surat_keluar (no_surat, perihal, tujuan, tanggal_surat, penanggungjawab, file_path, user_id) VALUES (
    '${data.no_surat}', '${data.perihal}', '${data.tujuan}', '${data.tanggal_surat}', '${data.penanggungjawab}', '${data.file_path}', '${data.user_id}'
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

async function updateSuratKeluarById(id, data) {
  const result = await query(`UPDATE surat_keluar
    SET no_surat = '${data.no_surat}',
      perihal = '${data.perihal}',
      tujuan = '${data.tujuan}',
      tanggal_surat = '${data.tanggal_surat}',
      penanggungjawab = '${data.penanggungjawab}',
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

async function deleteSuratKeluarById(id) {
  const result = await query(`DELETE FROM surat_keluar WHERE id = ${id}`);

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
  findAllSuratKeluar,
  findAllSuratKeluarByTahun,
  createSuratKeluar,
  findOneSuratKeluarByNo,
  updateSuratKeluarById,
  deleteSuratKeluarById
}