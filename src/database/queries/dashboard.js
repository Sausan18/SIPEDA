const { query } = require("../helpers");

async function getCountAllData() {
  const result = await query(`SELECT
    (SELECT COUNT(*) FROM surat_masuk) AS total_surat_masuk,
	  (SELECT COUNT(*) FROM surat_keluar) AS total_surat_keluar,
	  (SELECT COUNT(*) FROM lpj) AS total_lpj,
	  (SELECT COUNT(*) FROM prestasi) AS total_prestasi,
	  (SELECT COUNT(*) FROM beasiswa) AS total_beasiswa,
	  (SELECT COUNT(*) FROM users) AS total_users
    FROM dual`);
  
  if (result && result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

module.exports = {
  getCountAllData
}