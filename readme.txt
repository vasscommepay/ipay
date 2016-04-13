***JANGAN LUPA PULL DAHULU SEBELUM MEMULAI PEKERJAAN
*** = WAJIB A'IN

Folder ipayWeb untuk menyimpan pekerjaan web
Folder Node API untuk menyimpan pekerjaan API
Folder documents untuk menyimpan dokumentasi

----------------------------- Commit 16-03-2016 ----------------------------------
- merubah database untuk kolom member_koordinator, member_korwil, member_agen
- merubah database untuk kolom contact
- Menambah fitur register member
- Contoh data yang dikirim untuk register member:
	{"session": "cAEHsefbtn",

    "identity_number":12345,
 
   "nama":"testing",
 
   "tanggal_lahir":"1994-02-20",
 
   "jenis_kelamin":"L",
  
  "npwp":"123456789",
  
  "level_member":0,
 
   "wilayah":1 (*hanya untuk penambahan korwil),
 
   "addressName":"rumah",
 
   "jalan":"jl.santai",
 
   "kec":3,
  
  "kab":2,

    "prov":1,

    "ket":"nothing",

    "telp":"081331660994",

    "email":"bfibrianto@gmail.com"
}.
- Setelah menambah member, mendapatkan respon:
{
  "inserted": "true",
  "reg_num": "1632016hIHFtJFF",
  "createdAt": "2016-03-16T09:51:54.000Z"
}
- nama member, createdAt, level, dan reg_num ditampilkan pada ui, dikirim ke email.
-------------------------------------- END ---------------------------

--------------------------------- USEFULL LINK -------------------------------------------
- NODE.JS:
	-https://github.com/felixge/node-mysql#todo (modul mysql)
	-https://github.com/caolan/async (modul async)
	-http://www.sebastianseilund.com/nodejs-async-in-practice (contoh penggunaan asycn)
- WEB:
	- http://jqueryvalidation.org/ (untuk melakukan validasi nilai input form)
	- http://api.jquery.com/jquery.ajax/ (Untuk submit data ke server tanpa harus refresh halaman)
	- https://laravel.com/docs/5.2/session (Untuk mengelola session laravel)
	- https://laravel.com/docs/5.2/routing (Untuk mengelola routing laravel)
------------------------------------ END --------------------------------------------------

-------------------------------- Fitur Transaksi ----------------------------------------------
Fitur transaksi sudah

------------------------------ COUCH DB ----------------------------------------------------------
COUCHAPP EDITOR: Create, Edit and Upload CouchDB applications: https://smileos-8d8a45.smileupps.com/_editor

BULK DOCS EDITOR: Edit multiple docs at once: https://smileos-8d8a45.smileupps.com/_costco

FUTON via SMILEOS: Futon restricted to admin only: https://smileos-8d8a45.smileupps.com/_utils/index.html

FAUXTON via SMILEOS: Fauxton restricted to admin only: https://smileos-8d8a45.smileupps.com/_utils/fauxton/index.html
