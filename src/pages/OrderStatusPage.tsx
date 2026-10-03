import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { OrderTimeline } from '../components/OrderTimeline';
import { Order } from '../types';
import { 
  Package, Clock, AlertTriangle, QrCode, Upload, FileText, ChevronRight, 
  Printer, ArrowRight, CheckCircle2, RefreshCw, X, ShieldAlert 
} from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { orders, submitPaymentProof } = useShop();
  const { currentUser } = useAuth();

  // If logged in as user, filter to current user's orders (or demo user). 
  // If guest, show demo user's orders.
  const userOrders = currentUser?.role === 'user' 
    ? orders.filter(o => o.userId === currentUser.id || o.userId === 'usr_demo')
    : orders;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(userOrders[0] || null);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [reuploadFile, setReuploadFile] = useState<string | null>(null);
  const [reuploadFileName, setReuploadFileName] = useState('');

  // Keep selected order updated when orders state changes
  const activeOrder = selectedOrder ? orders.find(o => o.id === selectedOrder.id) || selectedOrder : userOrders[0] || null;

  const handleReuploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !reuploadFile) return;

    submitPaymentProof(activeOrder.id, reuploadFile, reuploadFileName || 'bukti_transfer_baru.jpg');
    setIsReuploadModalOpen(false);
    setReuploadFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReuploadFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReuploadFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateProof = () => {
    setReuploadFile('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
    setReuploadFileName(`struk_pelunasan_${activeOrder?.id.toLowerCase()}.jpg`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Status Pembayaran & Riwayat Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pantau validasi transfer QRIS dan proses mesin cetak secara real-time.
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Riwayat Pesanan</h3>
          <p className="text-xs text-slate-500">
            Anda belum pernah membuat pesanan percetakan. Silakan pilih produk dari katalog kami.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <span>Katalog Cetak</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Order Cards List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Daftar Pesanan ({userOrders.length})
            </h2>

            {userOrders.map(order => {
              const isSelected = activeOrder?.id === order.id;
              const hasAlert = order.paymentStatus === 'Pembayaran Ditolak' || order.orderStatus === 'Ditolak';

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/20 shadow-md ring-1 ring-orange-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-800 truncate">
                    {order.items.map(i => i.productName).join(', ')}
                  </div>

                  {/* Status Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge type="payment" status={order.paymentStatus} size="sm" />
                    <StatusBadge type="order" status={order.orderStatus} size="sm" />
                  </div>

                  {/* Price & Rejection Alert Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-extrabold text-slate-900 tabular-nums">
                      Rp {order.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {hasAlert && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-1 rounded">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Perhatian: Ada penolakan dari admin</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed View of Selected Order */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900 font-mono">
                      {activeOrder.id}
                    </h2>
                    <span className="text-xs text-slate-400">
                      · {new Date(activeOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pemesan: <strong className="text-slate-800">{activeOrder.customerName}</strong> ({activeOrder.customerPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* If not paid yet, show QRIS pay button */}
                  {activeOrder.paymentStatus === 'Belum Bayar' && (
                    <Link
                      to={`/payment/${activeOrder.id}`}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Bayar QRIS Sekarang</span>
                    </Link>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 no-print"
                    title="Cetak Faktur Pesanan"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Cetak Faktur</span>
                  </button>
                </div>
              </div>

              {/* Status Badges Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    STATUS PEMBAYARAN:
                  </span>
                  <StatusBadge type="payment" status={activeOrder.paymentStatus} size="md" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    STATUS MESIN CETAK:
                  </span>
                  <StatusBadge type="order" status={activeOrder.orderStatus} size="md" />
                </div>
              </div>

              {/* REJECTION ALERT & RE-UPLOAD PROOF ACTION */}
              {activeOrder.paymentStatus === 'Pembayaran Ditolak' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-900">
                        Pembayaran Ditolak oleh Tim Keuangan Admin
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200 font-medium">
                        "{activeOrder.paymentRejectionReason || 'Bukti transfer tidak terbaca atau nominal tidak sesuai.'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-rose-700">
                      Silakan upload struk transfer yang baru/jelas agar pesanan dapat diproses.
                    </span>
                    <button
                      onClick={() => setIsReuploadModalOpen(true)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Ulang Bukti Bayar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ORDER REJECTION ALERT */}
              {activeOrder.orderStatus === 'Ditolak' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-start gap-2.5 text-rose-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-rose-900">Pesanan Ditolak oleh Operator Cetak:</strong>
                      <p className="mt-1 bg-white/70 p-2 rounded border border-rose-200">
                        "{activeOrder.orderRejectionReason || 'File tidak memenuhi standar resolusi cetak.'}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Order Timeline */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Perjalanan Status Pesanan:
                </h3>
                <OrderTimeline order={activeOrder} />
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Rincian Item yang Dicetak ({activeOrder.items.length}):
                </h3>

                <div className="space-y-3">
                  {activeOrder.items.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3.5"
                    >
                      <img
                        src={item.fileUrl || item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-bold text-slate-900">{item.productName}</h4>
                          <span className="font-bold text-slate-900 tabular-nums">
                            Rp {item.totalPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          {item.size} · {item.material} · {item.finishing}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>Qty: <strong>{item.quantity}</strong></span>
                          <span>@ Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                        </div>
                        {item.fileName && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">File Desain: {item.fileName}</span>
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-slate-600 italic text-[11px] bg-white p-1.5 rounded border border-slate-200/60 mt-1">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof info if uploaded */}
              {activeOrder.paymentProofUrl && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bukti Pembayaran Terunggah:</span>
                    <span className="font-semibold text-slate-800">{activeOrder.paymentProofName || 'bukti_transfer.jpg'}</span>
                  </div>
                  <a
                    href={activeOrder.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 hover:text-orange-700 font-semibold underline text-xs"
                  >
                    Lihat Foto Bukti
                  </a>
                </div>
              )}

              {/* Delivery and Total Footer */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Alamat Kirim / Pengambilan:</span>
                  <span className="font-medium text-slate-800 max-w-xs text-right truncate">
                    {activeOrder.customerAddress}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Total Pembayaran (Lunas/Tagihan):</span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RE-UPLOAD PAYMENT PROOF MODAL */}
      {isReuploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Unggah Ulang Bukti Pembayaran QRIS
              </h3>
              <button
                onClick={() => setIsReuploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              Pastikan foto transfer jelas, mencantumkan nominal Rp {activeOrder?.totalAmount.toLocaleString('id-ID')}, dan merchant tujuan <strong>BANTEN DIGITAL PRINTING</strong>.
            </div>

            <form onSubmit={handleReuploadSubmit} className="space-y-4">
              {reuploadFile ? (
                <div className="relative p-3 border-2 border-emerald-500 rounded-xl bg-emerald-50/40 flex items-center gap-3">
                  <img
                    src={reuploadFile}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-800 truncate">{reuploadFileName || 'bukti_transfer.jpg'}</p>
                    <p className="text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      File baru siap dikirim
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-orange-600 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-800">
                      Pilih Foto Struk Transfer Baru
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSimulateProof}
                    className="w-full py-2 px-3 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                  >
                    Simulasi: Gunakan Struk Contoh Pelunasan Cepat
                  </button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReuploadModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!reuploadFile}
                  className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl ${
                    reuploadFile ? 'bg-orange-600 hover:bg-orange-700 shadow-md' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Kirim Bukti Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
