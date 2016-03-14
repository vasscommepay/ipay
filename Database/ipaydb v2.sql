-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2016 at 09:49 AM
-- Server version: 5.6.25
-- PHP Version: 5.6.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ipaydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE IF NOT EXISTS `berita` (
  `idberita` int(11) NOT NULL,
  `judul_berita` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `author` varchar(45) DEFAULT NULL,
  `isi_berita` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `contact_channel`
--

CREATE TABLE IF NOT EXISTS `contact_channel` (
  `id` varchar(10) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `isinternet` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `data_bank`
--

CREATE TABLE IF NOT EXISTS `data_bank` (
  `kode` int(11) NOT NULL,
  `bank` varchar(10) DEFAULT NULL,
  `tgl_proses` datetime DEFAULT NULL,
  `tgl_bank` varchar(10) DEFAULT NULL,
  `jumlah` decimal(10,0) DEFAULT NULL,
  `tipe` char(1) DEFAULT NULL,
  `saldo` decimal(10,0) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `kode_tiket` int(11) DEFAULT NULL,
  `terklaim` tinyint(4) DEFAULT NULL,
  `catatan` varchar(255) DEFAULT NULL,
  `data_bankcol` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `histori_komisi`
--

CREATE TABLE IF NOT EXISTS `histori_komisi` (
  `id_transaksi` int(11) NOT NULL,
  `id_member` int(11) NOT NULL,
  `jumlah_komisi` decimal(10,0) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_mutasi`
--

CREATE TABLE IF NOT EXISTS `jenis_mutasi` (
  `idjenis_mutasi` varchar(45) NOT NULL,
  `nama_jenis_mutasi` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `jenis_mutasi`
--

INSERT INTO `jenis_mutasi` (`idjenis_mutasi`, `nama_jenis_mutasi`) VALUES
('debit', 'debit'),
('kom', 'pencairan komisi'),
('kredit', 'kredit'),
('min', 'pencarian saldo'),
('sal', 'tambah saldo');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_transaksi`
--

CREATE TABLE IF NOT EXISTS `jenis_transaksi` (
  `id` varchar(45) NOT NULL,
  `nama` varchar(45) DEFAULT NULL,
  `deskripsi` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `jenis_transaksi`
--

INSERT INTO `jenis_transaksi` (`id`, `nama`, `deskripsi`) VALUES
('jual', 'jual produk', 'menjual produk pada end customer'),
('tstk', 'tambah stok', 'menambah stok untuk dijual');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_tiket`
--

CREATE TABLE IF NOT EXISTS `kategori_tiket` (
  `idkategori_tiket` varchar(45) NOT NULL,
  `nama_kategori` varchar(45) DEFAULT NULL,
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `komentar`
--

CREATE TABLE IF NOT EXISTS `komentar` (
  `idkomentar` int(11) NOT NULL,
  `judul_komentar` varchar(45) DEFAULT NULL,
  `isi_komentar` text,
  `pengirim` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `level_member`
--

CREATE TABLE IF NOT EXISTS `level_member` (
  `id_level` int(11) NOT NULL,
  `nama_member` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `prefix` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `level_member`
--

INSERT INTO `level_member` (`id_level`, `nama_member`, `level`, `prefix`) VALUES
(0, 'company', 0, 'ipy'),
(1, 'korwil', 1, 'kwl'),
(2, 'koordinator agen', 2, 'kor'),
(3, 'agen', 3, 'agn');

-- --------------------------------------------------------

--
-- Table structure for table `master_produk`
--

CREATE TABLE IF NOT EXISTS `master_produk` (
  `id` varchar(45) NOT NULL,
  `nama` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `harga_beli` decimal(10,0) DEFAULT NULL,
  `keterangan` text,
  `kategori_produk` varchar(45) DEFAULT NULL,
  `nominal` decimal(10,0) DEFAULT NULL,
  `prabayar` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE IF NOT EXISTS `member` (
  `id_member` int(11) NOT NULL,
  `identity_number` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `npwp` varchar(45) DEFAULT NULL,
  `total_komisi` decimal(15,4) DEFAULT NULL,
  `total_saldo` decimal(15,4) DEFAULT NULL,
  `level_member` int(11) DEFAULT NULL,
  `reg_num` varchar(45) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id_member`, `identity_number`, `created_at`, `updated_at`, `npwp`, `total_komisi`, `total_saldo`, `level_member`, `reg_num`) VALUES
(4, '13123123123123123', '2016-03-14 15:42:15', '2016-03-14 15:42:15', '21312312312', NULL, NULL, 0, '2016-03-14H764T844'),
(5, '123123', '2016-03-14 15:46:43', '2016-03-14 15:46:43', '123123123', NULL, NULL, 1, '1432016H764T844'),
(6, '1234132413241324', '2016-03-14 15:48:40', '2016-03-14 15:48:40', '134123413241324', NULL, NULL, 1, '1432016hIHFtJFF');

--
-- Triggers `member`
--
DELIMITER $$
CREATE TRIGGER `reg_code` BEFORE INSERT ON `member`
 FOR EACH ROW BEGIN
DECLARE tgl INT;
DECLARE regnum VARCHAR(30);
SELECT CONCAT(DAY(CURDATE()),MONTH(CURDATE()),YEAR(CURDATE())) INTO @tgl;

SELECT CONCAT(@tgl, substring('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed)*36+1, 1)) INTO @regnum;
SET NEW.reg_num = @regnum;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `member_address`
--

CREATE TABLE IF NOT EXISTS `member_address` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `jalan` text,
  `id_kecamatan` int(11) DEFAULT NULL,
  `id_kota` int(11) DEFAULT NULL,
  `id_provinsi` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `keterangan_tambahan` text,
  `id_member` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_agen`
--

CREATE TABLE IF NOT EXISTS `member_agen` (
  `id` int(11) NOT NULL,
  `id_member` int(11) DEFAULT NULL,
  `id_koordinator` int(11) DEFAULT NULL,
  `nama` text,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_contact`
--

CREATE TABLE IF NOT EXISTS `member_contact` (
  `id_member` int(11) NOT NULL,
  `channel_id` varchar(10) NOT NULL,
  `channel_value` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_internal`
--

CREATE TABLE IF NOT EXISTS `member_internal` (
  `member_id` int(11) NOT NULL,
  `nama` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_koordinator`
--

CREATE TABLE IF NOT EXISTS `member_koordinator` (
  `id` int(11) NOT NULL,
  `id_member` int(11) DEFAULT NULL,
  `nama` text,
  `id_korwil` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_korwil`
--

CREATE TABLE IF NOT EXISTS `member_korwil` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `users_id` int(11) DEFAULT NULL,
  `id_wilayah` int(11) DEFAULT NULL,
  `korwil_name` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `member_order`
--

CREATE TABLE IF NOT EXISTS `member_order` (
  `id_order` int(11) NOT NULL,
  `id_member` int(11) DEFAULT NULL,
  `biaya_total` decimal(10,0) DEFAULT NULL,
  `tanggal_order` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(45) DEFAULT NULL,
  `keterangan` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `mutasi_saldo_member`
--

CREATE TABLE IF NOT EXISTS `mutasi_saldo_member` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `saldo_awal` decimal(10,0) DEFAULT NULL,
  `jumlah_transaksi` decimal(10,0) DEFAULT NULL,
  `jenis_mutasi` varchar(45) DEFAULT NULL,
  `saldo_akhir` varchar(45) DEFAULT NULL,
  `id_transaksi` int(11) DEFAULT NULL,
  `debet` tinyint(4) DEFAULT NULL,
  `kode_order` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `mutasi_saldo_member`
--
DELIMITER $$
CREATE TRIGGER `update_saldo` AFTER INSERT ON `mutasi_saldo_member`
 FOR EACH ROW begin
DECLARE isdebet TINYINT;
SELECT NEW.debet INTO @isdebet;
IF @isdebet = 0 
THEN
       UPDATE member SET member.total_saldo = member.total_saldo + NEW.jumlah_transaksi
       WHERE member.id_member = NEW.member_id
       ;
       ELSE
       UPDATE member SET member.total_saldo = member.total_saldo - 	NEW.jumlah_transaksi
       WHERE member.id_member = NEW.member_id;
       END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pembelian_master_produk`
--

CREATE TABLE IF NOT EXISTS `pembelian_master_produk` (
  `id_pembelian` int(11) NOT NULL,
  `id_product` varchar(45) NOT NULL,
  `harga` decimal(10,0) DEFAULT NULL,
  `tanggal_order` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_supplier` varchar(45) DEFAULT NULL,
  `keterangan` text,
  `kode_pembelian` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='		';

-- --------------------------------------------------------

--
-- Table structure for table `pertanyaan`
--

CREATE TABLE IF NOT EXISTS `pertanyaan` (
  `id` int(11) NOT NULL,
  `id_member` int(11) DEFAULT NULL,
  `pertanyaan` text,
  `id_tiket` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `produk_member`
--

CREATE TABLE IF NOT EXISTS `produk_member` (
  `product_id` varchar(45) NOT NULL,
  `member_id` int(11) NOT NULL,
  `harga_beli` decimal(10,0) DEFAULT NULL,
  `harga_jual` decimal(10,0) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `margin` decimal(10,0) DEFAULT NULL,
  `stok_produk` decimal(10,0) DEFAULT NULL,
  `min_order_qty` int(11) DEFAULT NULL,
  `max_order_qty` int(11) DEFAULT NULL,
  `aktif` tinyint(1) DEFAULT NULL,
  `kosong` tinyint(1) DEFAULT NULL,
  `perhitungan_keuntungan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `status_transaksi`
--

CREATE TABLE IF NOT EXISTS `status_transaksi` (
  `id_status` varchar(45) NOT NULL,
  `nama_status` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status_transaksi`
--

INSERT INTO `status_transaksi` (`id_status`, `nama_status`) VALUES
('btl', 'batal'),
('ggl', 'gagal'),
('pro', 'proses'),
('suc', 'sukes');

-- --------------------------------------------------------

--
-- Table structure for table `tiket`
--

CREATE TABLE IF NOT EXISTS `tiket` (
  `idtiket` varchar(45) NOT NULL,
  `nama_tiket` varchar(45) DEFAULT NULL,
  `kategori_tiket` varchar(45) DEFAULT NULL,
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE IF NOT EXISTS `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `id_produk` varchar(45) NOT NULL,
  `id_member_produk` int(11) NOT NULL,
  `quantities` decimal(10,0) DEFAULT NULL,
  `tujuan` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `total_biaya` decimal(10,0) DEFAULT NULL,
  `jenis_transaksi` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `member_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wilayah`
--

CREATE TABLE IF NOT EXISTS `wilayah` (
  `id` int(11) NOT NULL,
  `nama` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`idberita`);

--
-- Indexes for table `contact_channel`
--
ALTER TABLE `contact_channel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_bank`
--
ALTER TABLE `data_bank`
  ADD PRIMARY KEY (`kode`);

--
-- Indexes for table `histori_komisi`
--
ALTER TABLE `histori_komisi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `komisi_id_member_fk_idx` (`id_member`);

--
-- Indexes for table `jenis_mutasi`
--
ALTER TABLE `jenis_mutasi`
  ADD PRIMARY KEY (`idjenis_mutasi`);

--
-- Indexes for table `jenis_transaksi`
--
ALTER TABLE `jenis_transaksi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_tiket`
--
ALTER TABLE `kategori_tiket`
  ADD PRIMARY KEY (`idkategori_tiket`);

--
-- Indexes for table `komentar`
--
ALTER TABLE `komentar`
  ADD PRIMARY KEY (`idkomentar`);

--
-- Indexes for table `level_member`
--
ALTER TABLE `level_member`
  ADD PRIMARY KEY (`id_level`);

--
-- Indexes for table `master_produk`
--
ALTER TABLE `master_produk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id_member`),
  ADD KEY `mbmer_level_member_fk_idx` (`level_member`);

--
-- Indexes for table `member_address`
--
ALTER TABLE `member_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `address_id_member_fk_idx` (`id_member`);

--
-- Indexes for table `member_agen`
--
ALTER TABLE `member_agen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_member_UNIQUE` (`id_member`),
  ADD KEY `koordinator_id_agen_fk_idx` (`id_koordinator`);

--
-- Indexes for table `member_contact`
--
ALTER TABLE `member_contact`
  ADD PRIMARY KEY (`id_member`,`channel_id`),
  ADD KEY `channel_id_contact_idx` (`channel_id`);

--
-- Indexes for table `member_internal`
--
ALTER TABLE `member_internal`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `member_koordinator`
--
ALTER TABLE `member_koordinator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_member_UNIQUE` (`id_member`),
  ADD KEY `korwil_id_koordinator_fk_idx` (`id_korwil`);

--
-- Indexes for table `member_korwil`
--
ALTER TABLE `member_korwil`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `member_id_UNIQUE` (`member_id`),
  ADD KEY `wilayah_id_korwil_fk_idx` (`id_wilayah`);

--
-- Indexes for table `member_order`
--
ALTER TABLE `member_order`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `transaction_from_member_id_fk_idx` (`id_member`),
  ADD KEY `order_username_fk_idx` (`username`);

--
-- Indexes for table `mutasi_saldo_member`
--
ALTER TABLE `mutasi_saldo_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mutasi_saldo_id_member_fk_idx` (`member_id`),
  ADD KEY `mutasi_id_transaksi_fk_idx` (`id_transaksi`),
  ADD KEY `mutasi_jenis_mutasi_idx` (`jenis_mutasi`);

--
-- Indexes for table `pembelian_master_produk`
--
ALTER TABLE `pembelian_master_produk`
  ADD PRIMARY KEY (`id_pembelian`),
  ADD KEY `id_product_product_order_fk_idx` (`id_product`);

--
-- Indexes for table `pertanyaan`
--
ALTER TABLE `pertanyaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pertanyaan_id_tiket_fk_idx` (`id_tiket`),
  ADD KEY `pertanyaan_id_member_fk_idx` (`id_member`);

--
-- Indexes for table `produk_member`
--
ALTER TABLE `produk_member`
  ADD PRIMARY KEY (`product_id`,`member_id`),
  ADD KEY `product_member_id_member_fk_idx` (`member_id`);

--
-- Indexes for table `status_transaksi`
--
ALTER TABLE `status_transaksi`
  ADD PRIMARY KEY (`id_status`);

--
-- Indexes for table `tiket`
--
ALTER TABLE `tiket`
  ADD PRIMARY KEY (`idtiket`),
  ADD KEY `tiket_id_kategori_fk_idx` (`kategori_tiket`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `produk_transaksi_id_produk_fk_idx` (`id_produk`),
  ADD KEY `transaksi_jenis_fk_idx` (`jenis_transaksi`),
  ADD KEY `transaksi_status_fk_idx` (`status`),
  ADD KEY `transaksi_id_member_idx` (`id_member_produk`),
  ADD KEY `produk_transaksi_id_transaksi_Fk` (`id_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD KEY `users_member_id_fk_idx` (`member_id`);

--
-- Indexes for table `wilayah`
--
ALTER TABLE `wilayah`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_bank`
--
ALTER TABLE `data_bank`
  MODIFY `kode` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id_member` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `member_address`
--
ALTER TABLE `member_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `member_agen`
--
ALTER TABLE `member_agen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `member_koordinator`
--
ALTER TABLE `member_koordinator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `member_korwil`
--
ALTER TABLE `member_korwil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `member_order`
--
ALTER TABLE `member_order`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `mutasi_saldo_member`
--
ALTER TABLE `mutasi_saldo_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pertanyaan`
--
ALTER TABLE `pertanyaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `wilayah`
--
ALTER TABLE `wilayah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `histori_komisi`
--
ALTER TABLE `histori_komisi`
  ADD CONSTRAINT `komisi_id_member_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `komisi_id_transaksi_fk` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `mbmer_level_member_fk` FOREIGN KEY (`level_member`) REFERENCES `level_member` (`id_level`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_address`
--
ALTER TABLE `member_address`
  ADD CONSTRAINT `address_id_member_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_agen`
--
ALTER TABLE `member_agen`
  ADD CONSTRAINT `agen_member_id_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `koordinator_id_agen_fk` FOREIGN KEY (`id_koordinator`) REFERENCES `member_koordinator` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_contact`
--
ALTER TABLE `member_contact`
  ADD CONSTRAINT `channel_id_contact` FOREIGN KEY (`channel_id`) REFERENCES `contact_channel` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `contact_username_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_internal`
--
ALTER TABLE `member_internal`
  ADD CONSTRAINT `member_internal_id_member_fk` FOREIGN KEY (`member_id`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_koordinator`
--
ALTER TABLE `member_koordinator`
  ADD CONSTRAINT `koordinator_member_id_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `korwil_id_koordinator_fk` FOREIGN KEY (`id_korwil`) REFERENCES `member_korwil` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_korwil`
--
ALTER TABLE `member_korwil`
  ADD CONSTRAINT `korwil_member_id_fk` FOREIGN KEY (`member_id`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `wilayah_id_korwil_fk` FOREIGN KEY (`id_wilayah`) REFERENCES `wilayah` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `member_order`
--
ALTER TABLE `member_order`
  ADD CONSTRAINT `order_username_fk` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `transaction_from_member_id_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `mutasi_saldo_member`
--
ALTER TABLE `mutasi_saldo_member`
  ADD CONSTRAINT `mutasi_id_transaksi_fk` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `mutasi_jenis_mutasi_fk` FOREIGN KEY (`jenis_mutasi`) REFERENCES `jenis_mutasi` (`idjenis_mutasi`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `mutasi_saldo_id_member_fk` FOREIGN KEY (`member_id`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pembelian_master_produk`
--
ALTER TABLE `pembelian_master_produk`
  ADD CONSTRAINT `id_product_product_order_fk` FOREIGN KEY (`id_product`) REFERENCES `master_produk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pertanyaan`
--
ALTER TABLE `pertanyaan`
  ADD CONSTRAINT `pertanyaan_id_member_fk` FOREIGN KEY (`id_member`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `pertanyaan_id_tiket_fk` FOREIGN KEY (`id_tiket`) REFERENCES `tiket` (`idtiket`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `produk_member`
--
ALTER TABLE `produk_member`
  ADD CONSTRAINT `product_member_id_member_fk` FOREIGN KEY (`member_id`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `product_member_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `master_produk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tiket`
--
ALTER TABLE `tiket`
  ADD CONSTRAINT `tiket_id_kategori_fk` FOREIGN KEY (`kategori_tiket`) REFERENCES `kategori_tiket` (`idkategori_tiket`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `produk_transaksi_id_produk_fk` FOREIGN KEY (`id_produk`) REFERENCES `produk_member` (`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `produk_transaksi_id_transaksi_Fk` FOREIGN KEY (`id_order`) REFERENCES `member_order` (`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `transaksi_id_member` FOREIGN KEY (`id_member_produk`) REFERENCES `produk_member` (`member_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `transaksi_jenis_fk` FOREIGN KEY (`jenis_transaksi`) REFERENCES `jenis_transaksi` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `transaksi_status_fk` FOREIGN KEY (`status`) REFERENCES `status_transaksi` (`id_status`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_member_id_fk` FOREIGN KEY (`member_id`) REFERENCES `member` (`id_member`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
