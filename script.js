/* ==========================================================
   Sistem Absensi Mahasiswa - UTS Kelompok 7
   Frontend simulasi: data contoh, tanpa backend/database.
   ========================================================== */

const content = document.getElementById('app-content');

// Simpan tampilan dashboard awal agar bisa dipulihkan tanpa reload halaman.
const dashboardHTML = content.innerHTML;

/* ---------- Data contoh ---------- */

// [NIM, Nama, Kelas, Status]
const students = [
  ['25091397064', 'Muh. Abdillah Irawan', 'D4 MI 2025B', 'Aktif'],
  ['25091397044', 'Naila Husna Sabilah', 'D4 MI 2025B', 'Aktif'],
  ['25091397071', 'Vanhan Rheda Wardana', 'D4 MI 2025B', 'Aktif'],
  ['25091397012', 'Dimas Pratama', 'D4 MI 2025A', 'Aktif'],
];

// [Mata Kuliah, Hari, Waktu, Ruang]
const schedules = [
  ['Pemrograman Web', 'Senin', '08.00–09.40', 'A-203'],
  ['Basis Data', 'Selasa', '10.00–11.40', 'Lab Komputer'],
  ['Analisis Desain PL', 'Rabu', '13.00–14.40', 'B-105'],
  ['Struktur Data', 'Kamis', '09.00–10.40', 'Lab Komputer'],
];

// Status kehadiran contoh, urutannya mengikuti array `students`.
const attendanceStatus = ['Hadir', 'Hadir', 'Izin', 'Hadir'];

/* ---------- Navigasi ---------- */

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.page === page);
  });
}

/* ---------- Halaman tabel ---------- */

function renderCell(value, isStatusColumn) {
  if (isStatusColumn && value === 'Aktif') {
    return '<span class="badge">Aktif</span>';
  }
  return value;
}

function renderTable({ title, subtitle, headers, rows, searchHint }) {
  const headerHTML = headers.map((h) => `<th>${h}</th>`).join('');

  const rowsHTML = rows
    .map((row) => {
      const cells = row
        .map((value, i) => `<td>${renderCell(value, i === row.length - 1)}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  content.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="toolbar">
        <input id="searchRows" placeholder="${searchHint}">
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${headerHTML}</tr></thead>
          <tbody id="rows">${rowsHTML}</tbody>
        </table>
      </div>
    </section>`;

  document.getElementById('searchRows').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    document.querySelectorAll('#rows tr').forEach((tr) => {
      tr.hidden = !tr.textContent.toLowerCase().includes(keyword);
    });
  });
}

/* ---------- Halaman form ---------- */

function renderForm() {
  const courseOptions = schedules
    .map(([course]) => `<option>${course}</option>`)
    .join('');

  content.innerHTML = `
    <section class="panel">
      <h2>Form Absensi / Data</h2>
      <p class="panel-note">Simulasi frontend. Data tidak disimpan ke database.</p>
      <div class="notice">Periksa kembali isian sebelum melakukan validasi.</div>

      <form id="demoForm">
        <div class="form-grid">
          <div class="field">
            <label for="nim">NIM / ID Mahasiswa</label>
            <input id="nim" name="nim" required pattern="[0-9]{8,20}" placeholder="Masukkan nomor identitas">
          </div>
          <div class="field">
            <label for="nama">Nama lengkap</label>
            <input id="nama" name="nama" required minlength="3" placeholder="Nama lengkap">
          </div>
          <div class="field">
            <label for="jadwal">Mata kuliah</label>
            <select id="jadwal" required>
              <option value="">Pilih mata kuliah</option>
              ${courseOptions}
            </select>
          </div>
          <div class="field">
            <label for="tanggal">Tanggal</label>
            <input id="tanggal" type="date" required>
          </div>
          <div class="field">
            <label for="status">Status kehadiran</label>
            <select id="status" required>
              <option value="">Pilih status</option>
              <option>Hadir</option>
              <option>Izin</option>
              <option>Sakit</option>
            </select>
          </div>
          <div class="field">
            <label for="waktu">Waktu absensi</label>
            <input id="waktu" type="time" required>
          </div>
        </div>

        <div class="form-actions">
          <button class="primary-btn" type="submit">Validasi Form</button>
          <button class="small-btn" type="reset">Reset</button>
        </div>
        <p id="message" class="form-message" aria-live="polite"></p>
      </form>
    </section>`;

  document.getElementById('demoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message');
    message.textContent =
      'Validasi berhasil. Ini hanya simulasi; data belum dikirim atau disimpan.';
    message.classList.add('success');
  });
}

/* ---------- Router sederhana ---------- */

const pages = {
  dashboard: () => {
    content.innerHTML = dashboardHTML;
  },

  mahasiswa: () =>
    renderTable({
      title: 'Data Mahasiswa',
      subtitle: 'Daftar contoh mahasiswa terdaftar',
      headers: ['NIM', 'Nama', 'Kelas', 'Status'],
      rows: students,
      searchHint: 'Cari NIM atau nama...',
    }),

  jadwal: () =>
    renderTable({
      title: 'Jadwal Perkuliahan',
      subtitle: 'Daftar contoh jadwal kuliah',
      headers: ['Mata Kuliah', 'Hari', 'Waktu', 'Ruang'],
      rows: schedules,
      searchHint: 'Cari mata kuliah atau hari...',
    }),

  rekap: () =>
    renderTable({
      title: 'Rekap Kehadiran',
      subtitle: 'Contoh data kehadiran mahasiswa',
      headers: ['NIM', 'Nama', 'Kelas', 'Status'],
      rows: students.map(([nim, nama, kelas], i) => [nim, nama, kelas, attendanceStatus[i]]),
      searchHint: 'Cari data kehadiran...',
    }),

  form: renderForm,
};

function showPage(page) {
  setActiveNav(page);
  (pages[page] || pages.dashboard)();
}

/* ---------- Inisialisasi ---------- */

// Event delegation: tombol di dalam konten dinamis (mis. "Lihat rekap")
// tetap berfungsi setelah konten diganti.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-page]');
  if (!trigger) return;
  e.preventDefault();
  showPage(trigger.dataset.page);
});

setActiveNav('dashboard');
