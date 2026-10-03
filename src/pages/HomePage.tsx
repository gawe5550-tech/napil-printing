import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { HERO_IMAGE } from '../data/initialData';
import { Printer, Zap, Award, QrCode, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Spanduk & Banner',
    'Stiker & Label',
    'Brosur & Flyer',
    'Kartu Nama & Dokumen',
    'Merchandise & Sablon',
  ];

  const filteredProducts = selectedCategory === 'Semua'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Workshop Banten Digital Printing"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24 lg:px-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Cetak Digital No. 1 di Serang & Sekitarnya</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight text-white font-display">
            Percetakan Digital Cepat, <br />
            <span className="text-orange-400">Presisi Tinggi</span> & Bayar QRIS Instan.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Pesan spanduk outdoor, banner roll-up, stiker label kemasan, brosur promosi, dan kartu nama secara online. Cukup upload desain, bayar via QRIS otomatis, dan pesanan kami cetak langsung di workshop Serang.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#katalog"
              className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-lg shadow-orange-900/30 flex items-center gap-2"
            >
              <span>Lihat Katalog Produk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/orders"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              Lacak Pesanan Saya
            </Link>
          </div>

          {/* Key Quick USPs */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Selesai 1 Hari Kerja</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Printer className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Mesin UV Resolusi Tinggi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <QrCode className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Bayar QRIS Semua Bank</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Garansi Cetak Ulang</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section (Alur Pesan) */}
      <section id="layanan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Alur Pemesanan Online yang Praktis
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Empat langkah mudah dari pemesanan hingga hasil cetak siap di tangan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-base mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Pilih & Atur Spesifikasi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan ukuran, pilihan bahan, jenis finishing, dan jumlah. Harga otomatis terhitung transparan.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-base mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Upload File Desain</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unggah file desain siap cetak (PDF, JPG, PNG, atau AI/Corel) beserta catatan pesanan khusus Anda.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-base mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Bayar Lewat QRIS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scan barcode QRIS dengan aplikasi m-Banking atau dompet digital Anda, lalu upload bukti transfer.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Produksi & Kirim</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah pembayaran tervalidasi, file dicetak dan difinishing rapi. Siap dikirim atau diambil di workshop.
            </p>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Katalog Produk Percetakan
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pilih kategori produk percetakan sesuai kebutuhan promosi atau bisnis Anda.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image slot */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-white">
                  {product.category}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-medium px-2 py-0.5 rounded bg-white/90 backdrop-blur text-slate-700">
                  {product.estimatedDays}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3 space-y-1">
                    {product.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Mulai dari</span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      Rp {product.basePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">/{product.unit}</span>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Atur & Pesan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Bengkel Percetakan Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Ingin Konsultasi Bahan Langsung di Workshop?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Workshop kami berlokasi di Serang, Banten, dilengkapi mesin UV Roland, Konica Minolta Digital Press, dan mesin cutting otomatis Mimaki. Anda dapat melihat sample buku bahan, cetak mock-up, atau ambil langsung pesanan Anda tanpa ongkos kirim.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <span>✓ Sampel Buku Bahan Gratis</span>
              <span>✓ Bisa Pesan Satuan Maupun Ribuan</span>
              <span>✓ Siap Kerjasama B2B Instansi / Kampus</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-80 shrink-0 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Customer Care & Pre-Press</h4>
              <p className="text-xs text-slate-500 mt-1">Konsultasikan file desain sebelum naik cetak</p>
            </div>
            <a
              href="https://wa.me/6281298765432"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Chat WhatsApp CS (0812-9876-5432)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
