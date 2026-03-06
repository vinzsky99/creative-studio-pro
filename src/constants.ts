export const ART_STYLES = [
  "Realism", "Photorealism", "Hyperrealism", "Surrealism", "Abstract", "Cinematic", "Cyberpunk", "Anime", "3D Render", "Oil Painting", "Watercolor", "Sketch", "Minimalist", "Vintage", "Neon", "Sci-Fi", "Studio Photography", "Editorial", "Macro", "Bokeh", "Pixel Art", "Low Poly", "Concept Art", "Digital Art", "Line Art", "Manga", "Pop Art"
];

export const CAMERA_ANGLES = [
  "Eye Level", "Low Angle", "High Angle", "Extreme Low Angle", "Extreme High Angle", "Bird's Eye View", "Worm's Eye View", "Overhead Shot", "Drone Shot", "Dutch Angle", "Point of View", "Close-Up", "Extreme Close-Up", "Medium Shot", "Long Shot", "Extreme Long Shot", "Wide Shot", "Macro Angle", "Tilt Shift"
];

export const LIGHTING_STYLES = [
  "Realistic Natural Lighting", "Best Cinematic Lighting", "Golden Hour Lighting", "Soft Diffused Lighting", "Dramatic Chiaroscuro", "Moody Neon Lighting", "Bright Ambient Lighting", "Studio Strobe Lighting", "Volumetric Fog Lighting"
];

export const LOOP_STYLES = [
  "seamless loop", "perfect loop", "seamless looping animation", "smooth transition", "infinite loop", "endless loop background", "continuous motion", 
  "loopable footage", "cyclic motion", "no jump cut", "no flicker", "no frame skip", "no stutter", "stable frame pacing", "clean frame blend", "consistent lighting", 
  "abstract loop", "flowing particles loop", "gradient motion loop", "light streak loop", "hologram loop", "digital data stream loop", 
  "geometric animation loop", "symmetry animation", "mirrored animation technique", "tileable motion background", "rotating product loop", "slow spin loop", 
  "steam rising loop", "pouring liquid loop", "macro texture loop", "water ripple loop", "ocean wave loop", "cloud timelapse loop", "rain falling loop"
];

export const MOTION_STYLES = [
  "none", "smooth motion", "cinematic movement", "controlled camera movement", "stable footage", "fluid motion", "natural movement", "dynamic motion", 
  "slow motion", "real time motion", "hyperlapse motion", "timelapse motion", "handheld stable", "tripod stable", "gimbal stabilized", "slider movement", 
  "dolly in", "dolly out", "push in shot", "pull out shot", "pan left", "pan right", "tilt up", "tilt down", "crane shot", "orbit camera movement", 
  "tracking shot", "follow shot", "static shot", "locked camera"
];

export const RESOLUTIONS = {
  '3:2': { label: '3:2 (6000x4000)', w: 6000, h: 4000, apiRatio: '4:3' }, 
  '4:3': { label: '4:3 (6000x4500)', w: 6000, h: 4500, apiRatio: '4:3' },
  '1:1': { label: '1:1 (5000x5000)', w: 5000, h: 5000, apiRatio: '1:1' },
  '16:9': { label: '16:9 (5000x2815)', w: 5000, h: 2815, apiRatio: '16:9' },
  '9:16': { label: '9:16 (2160x3840)', w: 2160, h: 3840, apiRatio: '9:16' }
};

export const RESEARCH_FILTERS = [
  "All Categories (Trending Now)", "Backgrounds & Textures", "Business & Finance", 
  "Lifestyle & People", "Technology & AI", "Nature & Landscapes", 
  "Food & Drink", "Health & Medical", "Education & Science", 
  "Seasonal & Events", "Architecture & Real Estate", 
  "Animals & Wildlife", "Art & Abstract", "Transportation & Automotive", 
  "Fashion & Beauty", "Industry & Manufacturing", "Sports & Fitness"
];

export const MEDIA_TYPES = ["All Formats", "Image", "Video", "Vector"];

export const AGENCY_FORMATS = {
  'Adobe Stock': { headers: ['Filename', 'Title', 'Keywords', 'Category'], getRow: (data: any, title: string) => [data.filename, title, data.keywords, data.category] },
  'Shutterstock': { headers: ['Filename', 'Description', 'Keywords', 'Categories', 'Editorial', 'r_rated', 'location'], getRow: (data: any, title: string) => [data.filename, title, data.keywords, data.category, 'no', 'no', ''] },
  'Freepik': { headers: ['file_name', 'title', 'keywords'], getRow: (data: any, title: string) => [data.filename, title, data.keywords] },
  'Vecteezy': { headers: ['Filename', 'Title', 'Description', 'Keywords', 'License'], getRow: (data: any, title: string) => [data.filename, title, title, data.keywords, 'Free'] },
  'Dreamstime': { headers: ['Filename', 'Title', 'Description', 'Keywords'], getRow: (data: any, title: string) => [data.filename, title, title, data.keywords] }
};

export const GEN_FORMATS = ['.png', '.jpg', '.jpeg', '.ai', '.eps', '.psd', '.svg'];
export const META_FORMATS = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.ai', '.eps', '.psd', '.svg'];

export const DICT: any = {
  ID: {
    appTitle: "CREATIVE STUDIO", tabGen: "AI Generator", tabGenDesc: "Kreasi T2I & I2I",
    tabMeta: "Stock Metadata", tabMetaDesc: "Antrean & Bulk CSV", tabAudit: "Technical Audit",
    tabAuditDesc: "Kualitas Video & Frame", tabRes: "Market Research", tabResDesc: "Tren Viral & Urgen",
    t2i: "Teks ke Gambar", i2i: "Gambar ke Gambar", uploadRef: "Upload Referensi",
    promptInst: "Instruksi Prompt", promptPlaceholder: "Deskripsikan gambar dengan detail (contoh: A hyperrealistic portrait...)",
    visualStyle: "Gaya Visual", cameraAngle: "Angle Kamera", resRatio: "Resolusi / Rasio", targetFormat: "Target Format",
    count: "Jumlah", generateBtn: "GENERATE", emptyWorkspace: "Kosongkan Data", clearWorkspace: "Bersihkan Semua",
    downloadHD: "Download 8K", videoPromptTitle: "JSON Prompt Video", copyJson: "Salin JSON",
    metaGenTitle: "Metadata Batch System", metaGenDesc: "Auto Tagging & Bulk Ekspor. Antrean otomatis.",
    uploadMedia: "Upload File Metadata", extractBtn: "PROSES ANTREAN METADATA", stockMetaResult: "Hasil Stock Metadata",
    exportCsv: "Export CSV", exportZip: "Export ZIP All", titleDesc: "Judul / Deskripsi", keywords: "Kata Kunci", fileName: "Nama File",
    uploadMediaExtract: "Pilih file dari antrean untuk melihat data", qaAuditTitle: "Advanced Technical Audit",
    qaAuditDesc: "Analisis frame video, noise, & risiko AI", uploadSvg: "Upload File Audit",
    runAudit: "JALANKAN AUDIT VIDEO/GAMBAR", techDashboard: "DASHBOARD TEKNIS", riskLevel: "TINGKAT RISIKO",
    estReject: "ESTIMASI DITOLAK", quality: "Kualitas", uniqueness: "Keunikan",
    qualityIssues: "Laporan Teknis Ekstrem", noIssues: "Lulus inspeksi. File sangat bersih & tajam.",
    rawData: "Data Output Mentah", awaitingMedia: "Pilih file dari antrean untuk memulai audit frame",
    seedKeyword: "Kata Dasar (Opsional)", seedPlaceholder: "Contoh: neon cyberpunk city (Kosongkan = Auto)",
    smartFilter: "Filter Target Pintar", trendBtn: "RISET TREN VIRAL", autoTrendBtn: "TREN GLOBAL OTOMATIS",
    totalKeywords: "Total Keyword", avgDemand: "Rata-rata Permintaan", avgComp: "Rata-rata Kompetisi",
    trendStrategy: "Strategi Tren", targetKeyword: "Bidikan Keyword (Ekspansi)", format: "Format",
    score: "Skor Data", action: "Aksi",
    checkLive: "Cek Live", marketStandby: "Mesin Pasar Standby", selectAgency: "Pilih Agensi",
    marketDesc: "Pilih Filter Kategori atau masukkan kata dasar untuk mencari celah pasar tanpa batas yang sedang viral.",
    errDescReq: "Deskripsi prompt dibutuhkan!", errImgReq: "Gambar referensi dibutuhkan!",
    viewImg: "Lihat Gambar", closeImg: "Tutup", editImg: "Revisi Gambar (Hapus Watermark, Edit Elemen)",
    revising: "Sedang Merevisi Gambar...", reviseTitle: "Revisi AI Studio",
    revisePlaceholder: "Contoh: ganti warna baju menjadi merah, perbaiki mata...",
    submitRevise: "PROSES REVISI GAMBAR", cancel: "Batal",
    demand: "Permintaan", competition: "Kompetisi", urgency: "Urgensi", viewOnAdobe: "Lihat di Adobe Stock",
    similarContent: "Analisis Konten Serupa / Duplikat", kuratorNote: "Catatan Kurator",
    queueEmpty: "Antrean Kosong", addFiles: "Tambahkan File...", exportAllCsv: "Export All CSV",
    search: "Cari...", type: "Ketik", selected: "Terpilih", none: "Kosong", custom: "Kustom",
    processingQueue: "MEMPROSES ANTREAN...", extractingUnique: "Mengekstrak Data Unik...", pixelInspection: "Inspeksi Frame & Piksel Lanjutan...",
    engineActive: "MESIN_AKTIF", downloadVideoJSON: "Unduh JSON Prompt",
    seamlessLoop: "Seamless Loop", retryBtn: "Coba Lagi", rerunAllBtn: "ULANGI SEMUA PROSES",
    exportThisItem: "Ekspor CSV (Item Ini)"
  },
  EN: {
    appTitle: "CREATIVE STUDIO", tabGen: "AI Generator", tabGenDesc: "T2I & I2I Creation",
    tabMeta: "Stock Metadata", tabMetaDesc: "Queue & Bulk CSV", tabAudit: "Technical Audit",
    tabAuditDesc: "Video Quality & Frames", tabRes: "Market Research", tabResDesc: "Viral & Urgent Trends",
    t2i: "Text to Image", i2i: "Image to Image", uploadRef: "Upload Reference",
    promptInst: "Prompt Instruction", promptPlaceholder: "Describe the image in detail (e.g., A hyperrealistic portrait...)",
    visualStyle: "Visual Style", cameraAngle: "Camera Angle", resRatio: "Resolution / Ratio", targetFormat: "Target Format",
    count: "Count", generateBtn: "GENERATE", emptyWorkspace: "Clear Data", clearWorkspace: "Clear All",
    downloadHD: "Download 8K", videoPromptTitle: "Video Prompt JSON", copyJson: "Copy JSON",
    metaGenTitle: "Metadata Batch System", metaGenDesc: "Auto Tagging & Bulk Export. Automated queue.",
    uploadMedia: "Upload Metadata Files", extractBtn: "PROCESS METADATA QUEUE", stockMetaResult: "Stock Metadata Result",
    exportCsv: "Export CSV", exportZip: "Export ZIP All", titleDesc: "Title / Description", keywords: "Keywords", fileName: "File Name",
    uploadMediaExtract: "Select file from queue to view data", qaAuditTitle: "Advanced Technical Audit",
    qaAuditDesc: "Video frame, noise & AI risk analysis", uploadSvg: "Upload Audit Files",
    runAudit: "RUN VIDEO/IMAGE AUDIT", techDashboard: "TECHNICAL DASHBOARD", riskLevel: "RISK LEVEL",
    estReject: "EST. REJECT", quality: "Quality", uniqueness: "Uniqueness",
    qualityIssues: "Extreme Technical Report", noIssues: "Passed inspection. File is perfectly clean & sharp.",
    rawData: "Raw Data Output", awaitingMedia: "Select a file from queue to start frame audit",
    seedKeyword: "Seed Keyword (Optional)", seedPlaceholder: "Example: neon cyberpunk city (Leave blank = Auto)",
    smartFilter: "Smart Target Filter", trendBtn: "RESEARCH VIRAL TRENDS", autoTrendBtn: "AUTO GLOBAL TREND",
    totalKeywords: "Total Keywords", avgDemand: "Avg Demand Score", avgComp: "Avg Competition",
    trendStrategy: "Trend Strategy", targetKeyword: "Keyword Target (Expansion)", format: "Format",
    score: "Data Score", action: "Action",
    checkLive: "Check Live", marketStandby: "Market Engine Standby", selectAgency: "Select Agency",
    marketDesc: "Select a Category Filter or enter a seed keyword to find unlimited, highly viral market gaps.",
    errDescReq: "Prompt description is required!", errImgReq: "Reference image is required!",
    viewImg: "View Image", closeImg: "Close", editImg: "Revise Image (Remove Watermark, Edit Elements)",
    revising: "Revising Image...", reviseTitle: "AI Studio Revision",
    revisePlaceholder: "Example: change shirt color to red, fix eyes...",
    submitRevise: "PROCESS REVISION", cancel: "Cancel",
    demand: "Demand", competition: "Competition", urgency: "Urgency", viewOnAdobe: "View on Adobe Stock",
    similarContent: "Similar / Duplicate Content Analysis", kuratorNote: "Curator Notes",
    queueEmpty: "Queue Empty", addFiles: "Add Files...", exportAllCsv: "Export All CSV",
    search: "Search...", type: "Type", selected: "Selected", none: "None", custom: "Custom",
    processingQueue: "PROCESSING QUEUE...", extractingUnique: "Extracting Unique Data...", pixelInspection: "Advanced Frame & Pixel Inspection...",
    engineActive: "ENGINE_ACTIVE", downloadVideoJSON: "Download Prompt JSON",
    seamlessLoop: "Seamless Loop", retryBtn: "Retry", rerunAllBtn: "RERUN ALL PROCESSES",
    exportThisItem: "Export CSV (This Item)"
  }
};
