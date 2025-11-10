document.addEventListener('DOMContentLoaded', () => {

    // Ambil semua elemen yang kita butuhkan
    const lubang = document.querySelectorAll('.hole');
    const skorTampil = document.getElementById('skor');
    const waktuTampil = document.getElementById('waktu');
    const tombolMulai = document.getElementById('tombol-mulai');
    
    let skor = 0;
    let waktu = 30;
    let lubangTerakhir;
    let permainanBerjalan = false;
    let timerId;
    let moleTimerId;

    // Fungsi untuk mendapatkan lubang acak
    function lubangAcak(lubang) {
        const idx = Math.floor(Math.random() * lubang.length);
        const lubangPilihan = lubang[idx];

        // Mencegah tikus muncul di lubang yang sama 2x berturut-turut
        if (lubangPilihan === lubangTerakhir) {
            return lubangAcak(lubang);
        }
        lubangTerakhir = lubangPilihan;
        return lubangPilihan;
    }

    // Fungsi untuk membuat tikus muncul
    function munculkanTikus() {
        if (!permainanBerjalan) return;

        // Waktu acak tikus muncul (antara 0.5 - 1.2 detik)
        const waktuMuncul = Math.random() * 700 + 500;
        const lubangPilihan = lubangAcak(lubang);
        
        lubangPilihan.classList.add('up'); // Tikus muncul

        // Sembunyikan tikus setelah beberapa saat
        setTimeout(() => {
            lubangPilihan.classList.remove('up');
        }, waktuMuncul);

        // Panggil fungsi ini lagi untuk loop
        moleTimerId = setTimeout(munculkanTikus, waktuMuncul + 100); 
    }

    // Fungsi saat tikus dipukul
    function pukulTikus(e) {
        if (!e.isTrusted) return; // Mencegah klik palsu
        if (!permainanBerjalan) return; // Tidak bisa pukul jika game belum mulai
        
        // 'this' merujuk ke lubang yang diklik
        if (this.classList.contains('up')) {
            skor++;
            skorTampil.textContent = skor;
            this.classList.remove('up'); // Tikus langsung sembunyi
        }
    }

    // Tambahkan event listener ke setiap lubang
    lubang.forEach(l => l.addEventListener('click', pukulTikus));

    // Fungsi untuk memulai permainan
    function mulaiPermainan() {
        if (permainanBerjalan) return; // Mencegah klik ganda
        
        permainanBerjalan = true;
        skor = 0;
        waktu = 30;
        skorTampil.textContent = skor;
        waktuTampil.textContent = waktu;
        
        tombolMulai.textContent = "Sedang Main!";
        tombolMulai.disabled = true;

        // Mulai memunculkan tikus
        munculkanTikus();

        // Mulai hitung mundur waktu
        timerId = setInterval(() => {
            waktu--;
            waktuTampil.textContent = waktu;

            if (waktu <= 0) {
                selesaiPermainan();
            }
        }, 1000);
    }

    // Fungsi saat permainan selesai
    function selesaiPermainan() {
        permainanBerjalan = false;
        clearInterval(timerId); // Hentikan timer waktu
        clearTimeout(moleTimerId); // Hentikan timer tikus
        
        tombolMulai.textContent = "Mulai Lagi?";
        tombolMulai.disabled = false;
        
        alert(`Waktu Habis! Skor akhir kamu: ${skor}`);
        
        // Bersihkan semua tikus dari papan
        lubang.forEach(l => l.classList.remove('up'));
    }

    // Mulai permainan saat tombol diklik
    tombolMulai.addEventListener('click', mulaiPermainan);

});