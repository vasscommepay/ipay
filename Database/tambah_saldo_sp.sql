DROP PROCEDURE IF EXISTS new_member;

DELIMITER $$

CREATE PROCEDURE tambah_saldo (member_id_par INT,jumlah_transaksi_par DECIMAL(15,2),jenis_mutasi_par VARCHAR(10), uplink_par INT)
BEGIN
	DECLARE saldo_awal_mem DECIMAL(15,2);
    DECLARE saldo_akhir_mem DECIMAL(15,2);
    DECLARE saldo_awal_up DECIMAL(15,2);
    DECLARE saldo_akhir_up DECIMAL(15,2);
    
	SELECT total_saldo FROM member WHERE id_member = member_id_par INTO @saldo_awal_mem;
	SET @saldo_akhir_mem = @saldo_awal_mem+jumlah_transaksi_par;
    
    SELECT total_saldo FROM member WHERE id_member = uplink_par INTO @saldo_awal_up;
	SET @saldo_akhir_up = @saldo_awal_up-jumlah_transaksi_par;
    
	INSERT INTO mutasi_saldo_member (jumlah_transaksi,jenis_mutasi,DBCR,member_id)
    VALUES(jumlah_transaksi_par,jenis_mutasi_par,"CR",member_id_par);
    
    INSERT INTO mutasi_saldo_member (jumlah_transaksi,jenis_mutasi,DBCR,member_id)
    VALUES(jumlah_transaksi_par,"debit","DB",uplink_par);
    
    UPDATE member SET total_saldo = @saldo_akhir_mem WHERE id_member = member_id_par
    ;
    UPDATE member SET total_saldo = @saldo_akhir_up WHERE id_member = uplink_par;
    
END;

$$

DELIMITER $$

CREATE PROCEDURE sp_transaksi (oder_id_par INT,id_tran_par INT,biaya_total_par DECIMAL(15,2),status_par VARCHAR(45),keterangan_par TEXT)
BEGIN
	declare id_member INT;
    declare saldo_awal DECIMAL(15,2);
    declare saldo_akhir DECIMAL(15,2);
    
    SELECT id_member from member_order WHERE id_order = order_id_par INTO @id_member;
    SELECT total_saldo from member where id_member = @id_member INTO @saldo_awal;
    SET @saldo_akhir = @saldo_awal + biaya_total_par;
    
	UPDATE transaksi SET status = status_par WHERE id_transaksi = id_tran_par;
    
    INSERT INTO mutasi_saldo_member (jumlah_transaksi,jenis_mutasi,DBCR,member_id,id_transaksi,kode_order)
    VALUES(biaya_total_par,"tran","DB",member_id_par,id_tran_par,order_id_par);
END;

$$

DELIMITER $$

CREATE PROCEDURE new_member(identity_par VARCHAR(20),nama_par TEXT,tgl_lahir_par DATE,jenis_kelamin_par VARCHAR(1), npwp_par VARCHAR(13), level_member_par INT)
BEGIN 
	DECLARE tgl VARCHAR(8);
    DECLARE regnum VARCHAR(16);
    
    SELECT CONCAT(DAY(CURDATE()),MONTH(CURDATE()),YEAR(CURDATE())) INTO @tgl;

    SELECT CONCAT(
			  substring('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),@tgl) INTO @regnum;
              
	insert into member (identity_number,nama,tgl_lahir,jenis_kelamin, npwp, level_member,reg_num, max_users) 
    values (identity_par, nama_par, tgl_lahir_par, jenis_kelamin_par, npwp_par, level_member_par, @regnum, 2);
    
END;
$$
SELECT id_member,
CONCAT(substring('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1),
              substring('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1))
FROM member;

