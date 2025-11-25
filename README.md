# CV Screener - AI-Powered Resume Screening System

Sistem screening CV berbasis AI yang dapat memfilter resume berdasarkan kata kunci dengan dukungan OCR untuk PDF yang di-scan. Aplikasi ini menggunakan fuzzy matching untuk mencocokkan kata kunci secara lebih fleksibel.

## 🌟 Fitur Utama

- **Upload Multiple CV**: Upload beberapa file CV sekaligus dalam format PDF
- **Keyword Filtering**: Filter CV berdasarkan kata kunci yang ditentukan
- **OCR Support**: Ekstraksi teks dari PDF yang di-scan menggunakan Tesseract OCR
- **Fuzzy Matching**: Pencocokan kata kunci yang lebih fleksibel dengan toleransi kesalahan ejaan
- **Scoring System**: Sistem penilaian otomatis berdasarkan jumlah kata kunci yang cocok
- **Modern UI**: Antarmuka pengguna yang responsif dan mudah digunakan
- **Desktop App**: Dapat dikemas sebagai aplikasi desktop standalone

## 🛠️ Teknologi yang Digunakan

### Backend
- **FastAPI**: Framework web Python yang cepat dan modern
- **PyMuPDF (fitz)**: Ekstraksi teks dari PDF
- **Pytesseract**: OCR untuk PDF yang di-scan
- **RapidFuzz**: Fuzzy string matching
- **Uvicorn**: ASGI server

### Frontend
- **React**: Library JavaScript untuk UI
- **Vite**: Build tool yang cepat
- **Modern CSS**: Styling dengan animasi dan efek modern

## 📋 Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

1. **Python 3.8+**
   - Download dari [python.org](https://www.python.org/downloads/)

2. **Node.js 16+**
   - Download dari [nodejs.org](https://nodejs.org/)

3. **Tesseract OCR**
   - **Windows**: Download installer dari [GitHub Tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
   - Install di `C:\Program Files\Tesseract-OCR\` (default)
   - **Linux**: `sudo apt-get install tesseract-ocr`
   - **macOS**: `brew install tesseract`

## 🚀 Cara Instalasi dan Menjalankan

### Mode Development (Web)

#### 1. Clone Repository
```bash
git clone <repository-url>
cd cv_screener
```

#### 2. Setup Backend

```bash
# Buat virtual environment
python -m venv .venv

# Aktifkan virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

> **Catatan**: Jika Tesseract tidak terinstall di lokasi default, edit file `backend/main.py` baris 29 dan sesuaikan path-nya:
> ```python
> pytesseract.pytesseract.tesseract_cmd = r'C:\Path\To\Your\tesseract.exe'
> ```

#### 3. Setup Frontend

```bash
cd frontend
npm install
```

#### 4. Build Frontend

```bash
# Masih di folder frontend
npm run build
```

File hasil build akan disalin ke `backend/static/`

#### 5. Jalankan Backend Server

```bash
# Kembali ke root directory
cd ..

# Pastikan virtual environment aktif
# Jalankan server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

#### 6. Akses Aplikasi

Buka browser dan akses: `http://localhost:8000`

---

### Mode Desktop Application

Aplikasi ini juga dapat dikemas sebagai aplikasi desktop standalone menggunakan PyInstaller.

#### 1. Build Frontend (jika belum)

```bash
cd frontend
npm run build
cd ..
```

#### 2. Build Executable

```bash
# Pastikan virtual environment aktif
pyinstaller build_exe.spec
```

#### 3. Jalankan Aplikasi Desktop

Setelah build selesai, executable akan berada di folder `dist/CVScreener/`:

```bash
# Windows
dist\CVScreener\CVScreener.exe

# Linux/macOS
./dist/CVScreener/CVScreener
```

> **Catatan**: Pastikan Tesseract OCR sudah terinstall di sistem karena executable masih memerlukan Tesseract untuk fungsi OCR.

---

## 📖 Cara Penggunaan

1. **Buka Aplikasi**: Akses aplikasi melalui browser (mode web) atau jalankan executable (mode desktop)

2. **Input Kata Kunci**: 
   - Masukkan kata kunci yang ingin dicari, dipisahkan dengan koma
   - Contoh: `python, javascript, react, fastapi, machine learning`

3. **Upload CV**:
   - Klik area upload atau drag & drop file PDF
   - Dapat upload multiple files sekaligus
   - Mendukung PDF text-based dan scanned PDF

4. **Proses dan Lihat Hasil**:
   - Klik tombol "Screen CVs"
   - Tunggu proses selesai (dengan loading animation)
   - Hasil akan ditampilkan dengan skor dan kata kunci yang cocok
   - CV diurutkan berdasarkan skor tertinggi

## 🔧 Konfigurasi

### Mengubah Port Server

Edit file `backend/desktop_main.py` atau command uvicorn:

```python
# desktop_main.py
uvicorn.run(app, host="127.0.0.1", port=8000)  # Ubah port di sini
```

Atau saat menjalankan dengan uvicorn:
```bash
uvicorn backend.main:app --port 8080  # Gunakan port 8080
```

### Mengubah Threshold Fuzzy Matching

Edit file `backend/main.py` baris 90:

```python
if fuzz.partial_ratio(keyword, content_lower) >= 85:  # Ubah nilai 85 (0-100)
```

- Nilai lebih tinggi = matching lebih ketat
- Nilai lebih rendah = matching lebih fleksibel

## 📁 Struktur Project

```
cv_screener/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── desktop_main.py      # Desktop app entry point
│   ├── requirements.txt     # Python dependencies
│   └── static/              # Built frontend files
├── frontend/
│   ├── src/                 # React source code
│   ├── public/              # Public assets
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
├── build_exe.spec           # PyInstaller spec file
├── dist/                    # Built executable
└── README.md                # This file
```

## 🐛 Troubleshooting

### Error: Tesseract not found
**Solusi**: 
- Pastikan Tesseract sudah terinstall
- Update path di `backend/main.py` baris 29

### Error: Module not found
**Solusi**:
```bash
# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Frontend tidak muncul
**Solusi**:
```bash
# Rebuild frontend
cd frontend
npm run build
cd ..
```

### Port sudah digunakan
**Solusi**:
- Ubah port di konfigurasi
- Atau matikan aplikasi yang menggunakan port tersebut

## 📝 Development

### Menjalankan Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` dengan hot reload.

> **Catatan**: Dalam mode development, pastikan backend tetap berjalan di port 8000 karena frontend akan melakukan API calls ke `http://localhost:8000`

### Menjalankan Backend dengan Auto-reload

```bash
uvicorn backend.main:app --reload
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau laporkan issue.

## 📄 Lisensi

MIT License - Proyek ini gratis dan open source untuk digunakan oleh siapa saja.

## 👨‍💻 Author

**Naufal Ammar Hidayatulloh**

---

**Selamat menggunakan CV Screener! 🎉**
