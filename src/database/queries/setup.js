const { query } = require("../helpers");

async function setupDb() {
  await query(`CREATE TABLE if not exists users (
        id int NOT NULL AUTO_INCREMENT,
        nama varchar(255) NOT NULL,
        username varchar(255) NOT NULL,
        password varchar(1000) NOT NULL,
        role int NOT NULL,
        foto_path varchar(1000) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY(username)
  )AUTO_INCREMENT=1;`);
  
  await query(`CREATE TABLE if not exists surat_masuk (
        id int NOT NULL AUTO_INCREMENT,
        no_surat varchar(255) NOT NULL,
        instansi varchar(255) NOT NULL,
        perihal varchar(255) NOT NULL,
        tanggal_surat DATE,
        file_path varchar(255),
        user_id int,
        PRIMARY KEY (id),
        UNIQUE KEY(no_surat),
        FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  await query(`CREATE TABLE if not exists surat_keluar (
        id int NOT NULL AUTO_INCREMENT,
        no_surat varchar(255) NOT NULL,
        perihal varchar(255) NOT NULL,
        tujuan varchar(255) NOT NULL,
        tanggal_surat DATE,
        penanggungjawab varchar(255) NOT NULL,
        file_path varchar(255),
        user_id int,
        PRIMARY KEY (id),
        UNIQUE KEY(no_surat),
        FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  await query(`CREATE TABLE if not exists lpj (
        id int NOT NULL AUTO_INCREMENT,
        nama varchar(255) NOT NULL,
        penanggungjawab varchar(255) NOT NULL,
        departemen varchar(255) NOT NULL,
        tanggal_pelaksana DATE,
        deskripsi varchar(1000),
        file_path varchar(255),
        url_photo varchar(1000),
        user_id int,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  await query(`CREATE TABLE if not exists prestasi (
        id int NOT NULL AUTO_INCREMENT,
        nim varchar(255) NOT NULL,
        nama varchar(255) NOT NULL,
        prestasi varchar(255) NOT NULL,
        tahun varchar(50),
        file_path varchar(255),
        user_id int,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  await query(`CREATE TABLE if not exists beasiswa (
        id int NOT NULL AUTO_INCREMENT,
        nim varchar(255) NOT NULL,
        nama varchar(255) NOT NULL,
        nama_beasiswa varchar(255) NOT NULL,
        tahun varchar(50),
        file_path varchar(255),
        user_id int,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  return 'Database setup successfully'
}

module.exports = setupDb;