const { query } = require("../helpers");

async function findOneByUsername(username) {
  const row = await query(`SELECT * FROM users WHERE username='${username}'`);
  if (row.length > 0) return row[0]
  return null;
}

async function findAllUser() {
  const row = await query(`SELECT * FROM users ORDER BY id DESC`);
  return row;
}

async function findAllUserByRole(role) {
  const row = await query(`SELECT * FROM users WHERE role = '${role}' ORDER BY id DESC`);
  return row;
}

async function createUser(data) {
  const result = await query(`INSERT INTO users (nama, username, password, role, foto_path) 
    VALUES (
      '${data.nama}',
      '${data.username}',
      '${data.password}',
      '${data.role}',
      '${data.foto_path}')`);
  let response = {
    error: true,
    message: 'Gagal membuat pengguna'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Pengguna berhasil dibuat'
    };
  }

  return response
}

async function updateUserById(id, data) {
  const result = await query(`UPDATE users
    SET nama = '${data.nama}',
      username = '${data.username}',
      ${data.password != null ? `password = '${data.password}',` : ''}
      role = '${data.role}',
      foto_path = '${data.foto_path}'
    WHERE id = ${id}
  `);

  let response = {
    error: true,
    message: 'Gagal merubah pengguna'
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: 'Pengguna berhasil diupdate'
    };
  }

  return response
}

async function deleteUserById(id) {
  const result = await query(`DELETE FROM users WHERE id = ${id}`);

  let response = {
    error: true,
    message: "Gagal menghapus pengguna",
  };

  if (result.affectedRows) {
    response = {
      error: false,
      message: "Pengguna berhasil dihapus",
    };
  }

  return response;
}

module.exports = {
  findOneByUsername,
  findAllUserByRole,
  createUser,
  findAllUser,
  updateUserById,
  deleteUserById
}