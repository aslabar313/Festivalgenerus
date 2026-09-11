import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Star 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              FestivalGenerus
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur Utam</a>
            <a href="#peran" className="hover:text-emerald-400 transition-colors">Hak Akses & Role</a>
            <a href="#paket" className="hover:text-emerald-400 transition-colors">Harga SaaS</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-slate-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Platform SaaS Festival & Lomba Generus Digital
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none max-w-4xl mx-auto">
            Kelola Festival & Perlombaan Generus dengan <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Lebih Cepat & Transparan</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Solusi serba ada untuk pendaftaran peserta, jadwal perlombaan, input nilai juri secara real-time, hingga pengumuman pemenang dalam satu dashboard terintegrasi.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Daftar Event Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#fitur"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all"
            >
              Pelajari Fitur
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-800/80">
            <div>
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Real-time Penilaian Juri</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-400">Multi-Role</div>
              <div className="text-xs text-slate-400 mt-1">Admin, Panitia, Juri, Peserta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">Otomatis</div>
              <div className="text-xs text-slate-400 mt-1">Kalkulasi Rekap Nilai & Juara</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">E-Sertifikat</div>
              <div className="text-xs text-slate-400 mt-1">Generasi Cetak Otomatis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="fitur" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Fitur Unggulan FestivalGenerus
            </h2>
            <p className="mt-4 text-slate-400">
              Dirancang khusus untuk mempermudah panitia daerah/kelompok dalam menyelenggarakan kegiatan perlombaan generus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Registrasi & Verifikasi Peserta</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Formulir pendaftaran digital dengan pembagian kategori umur (Cabe Rawit, Pra-Remaja, Remaja), perwakilan desa/kelompok, dan status verifikasi berkas.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-teal-500/50 transition-colors group">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sistem Input Nilai Juri</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dashboard khusus juri untuk penilaian langsung dari smartphone/tablet per indikator (Tajwid, Adab, Intonasi, Keserasian) tanpa kertas.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Leaderboard & Rekap Real-time</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kalkulasi otomatis total nilai dan perankingan secara transparan untuk menentukan Juara 1, 2, 3, dan Juara Umum Kelompok/Desa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Section */}
      <section id="peran" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Akses & Hak Pengguna Terintegrasi
            </h2>
            <p className="mt-4 text-slate-400">
              Setiap elemen panitia dan peserta memiliki tampilan dashboard yang disesuaikan dengan peran masing-masing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
              <div className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Admin Utama
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mengatur master event, pembuatan akun juri & panitia, manajemen modul lomba, serta pengawasan sistem secara menyeluruh.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
              <div className="text-teal-400 font-bold text-lg mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Panitia Event
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mengelola data peserta, verifikasi pendaftaran, jadwal tampil, penanganan nomor dada, dan cetak sertifikat.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
              <div className="text-cyan-400 font-bold text-lg mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" /> Dewan Juri
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Memasukkan skor kriteria nilai peserta per cabang perlombaan secara cepat, aman, dan langsung tersimpan ke database.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
              <div className="text-amber-400 font-bold text-lg mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" /> Official / Peserta
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Melakukan pendaftaran kontingen, melihat urutan tampil, serta memantau pengumuman nilai dan hasil kejuaraan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / SaaS Plans */}
      <section id="paket" className="py-20 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Pilihan Paket SaaS FestivalGenerus
            </h2>
            <p className="mt-4 text-slate-400">
              Pilih paket yang sesuai dengan skala event tingkat Kelompok, Desa, atau Daerah.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic / Free Plan */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Kelompok / Starter</h3>
                <p className="text-slate-400 text-xs mt-1">Cocok untuk acara skala kecil</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">Gratis</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Max 1 Event
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Max 50 Peserta
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 Cabang Lomba
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Penilaian Standard
                  </li>
                </ul>
              </div>
              <Link href="/register" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-center font-semibold rounded-lg text-sm text-white transition-colors">
                Mulai Starter
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 border-2 border-emerald-500 p-8 rounded-2xl flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider">
                Paling Populer
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Desa / Pro</h3>
                <p className="text-slate-400 text-xs mt-1">Untuk Festival Generus Desa</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">Rp 299rb</span>
                  <span className="text-slate-400 text-sm"> / event</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Peserta Unlimited
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cabang Lomba Unlimited
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Scoring Juri
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Rekap & Export Excel/PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Generator E-Sertifikat
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=pro" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center rounded-lg text-sm transition-colors">
                Pilih Paket Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Daerah / Enterprise</h3>
                <p className="text-slate-400 text-xs mt-1">Untuk Festival Generus Daerah</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi Event Concurrent
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Domain SaaS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority Technical Support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Integrasi Payment Gateway
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=enterprise" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-center font-semibold rounded-lg text-sm text-white transition-colors">
                Hubungi Panitia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-slate-200">FestivalGenerus SaaS</span> &copy; {new Date().getFullYear()}
          </div>
          <p className="text-xs text-slate-500">
            Platform Sistem Informasi & Penilaian Perlombaan Generus
          </p>
        </div>
      </footer>
    </div>
  );
}
