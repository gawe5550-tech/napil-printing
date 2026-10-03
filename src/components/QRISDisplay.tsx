import React, { useState, useEffect } from 'react';
import { Upload, Clock, CheckCircle2, AlertCircle, Copy, Check, FileImage, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface Props {
  order: Order;
  onSubmitProof: (proofUrl: string, proofName: string) => void;
}

export const QRISDisplay: React.FC<Props> = ({ order, onSubmitProof }) => {
  // Countdown 24 hours timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 58,
    seconds: 45,
  });

  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(order.paymentProofUrl || null);
  const [fileName, setFileName] = useState<string>(order.paymentProofName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSimulatedProof = () => {
    // Convenient fallback dummy payment receipt
    const mockReceipt = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
    setFilePreview(mockReceipt);
    setFileName(`struk_qris_${order.id.toLowerCase()}.jpg`);
  };

  const handleCopy = (text: string, type: 'amount' | 'order') => {
    navigator.clipboard.writeText(text);
    if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePreview) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitProof(filePreview, fileName || 'bukti_transfer.jpg');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner with 24h Countdown */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-medium">Batas Waktu Pembayaran QRIS:</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-base font-bold tabular-nums bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-orange-400">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-slate-500">:</span>
          <span className="text-orange-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-slate-500">:</span>
          <span className="text-orange-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Indonesian Official QRIS Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white rounded-2xl border-2 border-slate-300 shadow-md p-5 text-center flex flex-col items-center">
            {/* QRIS Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-red-600 text-xl tracking-tighter">QRIS</span>
                <span className="text-[9px] font-semibold text-slate-500 leading-tight text-left">
                  QR Code Standar<br />Pembayaran Nasional
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                GPN
              </div>
            </div>

            {/* Merchant Details */}
            <div className="my-3 text-center">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                BANTEN DIGITAL PRINTING
              </h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">NMID: ID1020267788991</p>
              <p className="text-[10px] text-slate-400">A01 · Serang, Banten</p>
            </div>

            {/* Simulated Real QRIS QR Code Graphic */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-inner relative group">
              <svg
                viewBox="0 0 220 220"
                className="w-56 h-56 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="220" height="220" fill="white" />
                
                {/* Corner Positioning Squares */}
                {/* Top-Left */}
                <rect x="15" y="15" width="50" height="50" fill="#0f172a" rx="4" />
                <rect x="23" y="23" width="34" height="34" fill="white" rx="2" />
                <rect x="29" y="29" width="22" height="22" fill="#0f172a" rx="2" />

                {/* Top-Right */}
                <rect x="155" y="15" width="50" height="50" fill="#0f172a" rx="4" />
                <rect x="163" y="23" width="34" height="34" fill="white" rx="2" />
                <rect x="169" y="29" width="22" height="22" fill="#0f172a" rx="2" />

                {/* Bottom-Left */}
                <rect x="15" y="155" width="50" height="50" fill="#0f172a" rx="4" />
                <rect x="23" y="163" width="34" height="34" fill="white" rx="2" />
                <rect x="29" y="169" width="22" height="22" fill="#0f172a" rx="2" />

                {/* Simulated Data Pattern Matrix */}
                <g fill="#0f172a">
                  {/* Row 1-2 bits */}
                  <rect x="75" y="18" width="6" height="6" />
                  <rect x="87" y="18" width="6" height="6" />
                  <rect x="105" y="18" width="6" height="6" />
                  <rect x="123" y="18" width="6" height="6" />
                  <rect x="135" y="18" width="6" height="6" />

                  <rect x="81" y="30" width="6" height="6" />
                  <rect x="99" y="30" width="6" height="6" />
                  <rect x="117" y="30" width="6" height="6" />
                  <rect x="129" y="30" width="6" height="6" />

                  <rect x="75" y="42" width="6" height="6" />
                  <rect x="93" y="42" width="6" height="6" />
                  <rect x="111" y="42" width="6" height="6" />
                  <rect x="135" y="42" width="6" height="6" />

                  {/* Mid Rows */}
                  <rect x="18" y="75" width="6" height="6" />
                  <rect x="36" y="75" width="6" height="6" />
                  <rect x="54" y="75" width="6" height="6" />
                  <rect x="72" y="75" width="6" height="6" />
                  <rect x="90" y="75" width="6" height="6" />
                  <rect x="108" y="75" width="6" height="6" />
                  <rect x="126" y="75" width="6" height="6" />
                  <rect x="144" y="75" width="6" height="6" />
                  <rect x="162" y="75" width="6" height="6" />
                  <rect x="180" y="75" width="6" height="6" />
                  <rect x="198" y="75" width="6" height="6" />

                  {/* Core Matrix Blocks */}
                  <rect x="24" y="90" width="6" height="6" />
                  <rect x="42" y="90" width="6" height="6" />
                  <rect x="66" y="90" width="6" height="6" />
                  <rect x="78" y="90" width="6" height="6" />
                  <rect x="102" y="90" width="6" height="6" />
                  <rect x="120" y="90" width="6" height="6" />
                  <rect x="138" y="90" width="6" height="6" />
                  <rect x="156" y="90" width="6" height="6" />
                  <rect x="174" y="90" width="6" height="6" />
                  <rect x="192" y="90" width="6" height="6" />

                  <rect x="18" y="105" width="6" height="6" />
                  <rect x="30" y="105" width="6" height="6" />
                  <rect x="54" y="105" width="6" height="6" />
                  <rect x="84" y="105" width="6" height="6" />
                  <rect x="114" y="105" width="6" height="6" />
                  <rect x="132" y="105" width="6" height="6" />
                  <rect x="168" y="105" width="6" height="6" />
                  <rect x="186" y="105" width="6" height="6" />

                  {/* Center QRIS logo badge */}
                  <rect x="90" y="90" width="40" height="40" rx="8" fill="white" stroke="#dc2626" strokeWidth="2" />
                  <text x="110" y="114" textAnchor="middle" fill="#dc2626" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                    QRIS
                  </text>

                  {/* Lower rows */}
                  <rect x="75" y="156" width="6" height="6" />
                  <rect x="93" y="156" width="6" height="6" />
                  <rect x="111" y="156" width="6" height="6" />
                  <rect x="129" y="156" width="6" height="6" />
                  <rect x="147" y="156" width="6" height="6" />
                  <rect x="177" y="156" width="6" height="6" />
                  <rect x="195" y="156" width="6" height="6" />

                  <rect x="81" y="174" width="6" height="6" />
                  <rect x="99" y="174" width="6" height="6" />
                  <rect x="117" y="174" width="6" height="6" />
                  <rect x="141" y="174" width="6" height="6" />
                  <rect x="165" y="174" width="6" height="6" />
                  <rect x="189" y="174" width="6" height="6" />

                  <rect x="75" y="192" width="6" height="6" />
                  <rect x="87" y="192" width="6" height="6" />
                  <rect x="111" y="192" width="6" height="6" />
                  <rect x="129" y="192" width="6" height="6" />
                  <rect x="153" y="192" width="6" height="6" />
                  <rect x="171" y="192" width="6" height="6" />
                  <rect x="195" y="192" width="6" height="6" />
                </g>
              </svg>
            </div>

            {/* Supported Banks & E-wallets */}
            <div className="w-full mt-4 pt-3 border-t border-slate-200">
              <p className="text-[10px] text-slate-500 mb-1.5 font-medium">
                Mendukung Seluruh Aplikasi Perbankan & Dompet Digital:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-semibold text-slate-600">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">BCA Mobile</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">Livin Mandiri</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">BRImo</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">GoPay</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">OVO</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">DANA</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded">ShopeePay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Details & Payment Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Summary Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Nomor Pesanan</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-slate-900">{order.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(order.id, 'order')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  title="Salin No. Pesanan"
                >
                  {copiedOrder ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Nama Pelanggan</span>
              <span className="text-xs font-semibold text-slate-800">{order.customerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Metode Pembayaran</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                QRIS Dinamis
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Tagihan Pembayaran</span>
                <span className="text-xs text-slate-400">Pastikan nominal transfer sama persis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                  Rp {order.totalAmount.toLocaleString('id-ID')}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(String(order.totalAmount), 'amount')}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:border-slate-400"
                  title="Salin Jumlah Tagihan"
                >
                  {copiedAmount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Steps of Payment */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Cara Pembayaran QRIS:</h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
              <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, DANA, ShopeePay).</li>
              <li>Pilih menu <strong>Bayar / Pay</strong> lalu scan kode QR di atas (atau screenshot kode QR).</li>
              <li>Pastikan nama merchant adalah <strong>BANTEN DIGITAL PRINTING</strong> dan masukkan nominal sebesar <strong>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>.</li>
              <li>Selesaikan pembayaran dan simpan bukti transfer (struk/tangkapan layar).</li>
              <li>Upload bukti transfer pada formulir di bawah ini lalu klik <strong>"Saya Sudah Bayar"</strong>.</li>
            </ol>
          </div>

          {/* Upload Proof Form */}
          <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Unggah Bukti Pembayaran (Screenshot / Struk Transfer)
              </label>

              {filePreview ? (
                <div className="relative border-2 border-emerald-500/40 rounded-xl p-3 bg-emerald-50/30 flex items-center gap-4">
                  <img
                    src={filePreview}
                    alt="Preview Bukti Pembayaran"
                    className="w-16 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{fileName || 'bukti_transfer.jpg'}</p>
                    <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Bukti transfer siap dikirim
                    </p>
                    <div className="mt-2 flex gap-2">
                      <label className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 cursor-pointer underline">
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-6 bg-slate-50 hover:bg-orange-50/30 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-orange-600 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-orange-600">
                      Klik untuk memilih foto / screenshot struk transfer
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">Format JPG, PNG, atau WEBP (Maks 10MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Demo Helper Button to simulate proof with 1 click */}
                  <button
                    type="button"
                    onClick={handleUseSimulatedProof}
                    className="w-full py-1.5 px-3 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileImage className="w-3.5 h-3.5 text-slate-500" />
                    Simulasi: Gunakan Contoh Struk QRIS Siap Pakai (Untuk Percobaan Cepat)
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!filePreview || isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                filePreview && !isSubmitting
                  ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-300 cursor-not-allowed opacity-75'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirimkan Bukti...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saya Sudah Bayar</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Setelah tombol diklik, status pesanan akan berubah menjadi "Menunggu Validasi".
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
