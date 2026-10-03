import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Printer } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="tentang" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & summary */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Banten Digital Printing
              </span>
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pusat percetakan digital profesional di Provinsi Banten. Melayani cetak outdoor, indoor, merchandise, dan dokumen perkantoran dengan standar warna teruji dan jaminan ketepatan waktu.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garansi Hasil Cetak Tajam & Tepat Waktu</span>
            </div>
          </div>

          {/* Produk Populer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Layanan Unggulan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Spanduk & Banner Outdoor</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Roll Up Banner Aluminium</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Stiker Vinyl Kiss-Cut & Die-Cut</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Kartu Nama Box Eksklusif</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Brosur & Flyer Lipat Warna</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Sablon Kaos DTF Satuan</Link></li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Jam Operasional Workshop</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Senin — Jumat</p>
                  <p className="text-xs text-slate-400">08:00 — 21:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Sabtu</p>
                  <p className="text-xs text-slate-400">08:30 — 17:00 WIB</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mesin Beroperasi 24 Jam</p>
                  <p className="text-xs text-slate-400">Antrean cetak malam tetap berjalan otomatis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak & Workshop</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  Jl. Ahmad Yani No. 45, Cipocok Jaya, Kota Serang, Provinsi Banten 42121
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs tabular-nums">+62 812-9876-5432 (WhatsApp CS)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs">halo@bantendigitalprinting.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Banten Digital Printing. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span>Metode Bayar: QRIS Standar Nasional</span>
            <span>·</span>
            <span>Kecepatan & Presisi Warna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
