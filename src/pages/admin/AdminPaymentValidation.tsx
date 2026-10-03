import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Order, PaymentStatus } from '../../types';
import { 
  CheckCircle2, XCircle, Eye, Clock, AlertTriangle, ShieldCheck, 
  FileImage, Search, Filter, X 
} from 'lucide-react';

export const AdminPaymentValidation: React.FC = () => {
  const { orders, adminValidatePayment } = useShop();

  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for viewing payment proof in detail
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Rejection modal state
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'Semua' ? true : order.paymentStatus === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (order: Order) => {
    adminValidatePayment(order.id, true);
    if (inspectingOrder?.id === order.id) {
      setInspectingOrder(null);
    }
  };

  const handleOpenRejectModal = (order: Order) => {
    setRejectingOrder(order);
    setRejectionReason('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrder || !rejectionReason.trim()) return;

    adminValidatePayment(rejectingOrder.id, false, rejectionReason);
    setRejectingOrder(null);
    setRejectionReason('');
    if (inspectingOrder?.id === rejectingOrder.id) {
      setInspectingOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Manajemen Keuangan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Validasi Pembayaran QRIS Masuk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verifikasi bukti transfer QRIS pelanggan sebelum pesanan diteruskan ke meja produksi.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari No. Order, nama pelanggan, HP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['Semua', 'Menunggu Validasi', 'Pembayaran Valid', 'Pembayaran Ditolak', 'Belum Bayar'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">No. Order</th>
                <th className="px-5 py-3 font-semibold">Nama Pelanggan</th>
                <th className="px-5 py-3 font-semibold">Bukti Bayar</th>
                <th className="px-5 py-3 font-semibold">Tanggal Unggah</th>
                <th className="px-5 py-3 font-semibold">Status Payment</th>
                <th className="px-5 py-3 font-semibold">Total Tagihan</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const hasProof = !!order.paymentProofUrl;
                  const isPending = order.paymentStatus === 'Menunggu Validasi';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        <div>{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4">
                        {hasProof ? (
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold group"
                          >
                            <img
                              src={order.paymentProofUrl}
                              alt="Thumbnail Bukti"
                              className="w-7 h-7 object-cover rounded border border-slate-200 group-hover:ring-2 group-hover:ring-blue-400"
                            />
                            <span>Lihat Bukti</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Belum diunggah</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 tabular-nums">
                        {order.paymentSubmittedAt ? (
                          new Date(order.paymentSubmittedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        ) : (
                          new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge type="payment" status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 tabular-nums">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApprove(order)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(order)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Rincian</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT PAYMENT PROOF MODAL / DRAWER */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Pemeriksaan Bukti Pembayaran QRIS
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Pesanan: {inspectingOrder.id} · {inspectingOrder.customerName}
                </p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proof Image Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase">Tangkapan Layar / Struk Transfer:</span>
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex items-center justify-center min-h-[240px]">
                {inspectingOrder.paymentProofUrl ? (
                  <img
                    src={inspectingOrder.paymentProofUrl}
                    alt="Bukti Transfer QRIS"
                    className="max-h-[380px] max-w-full rounded-lg object-contain shadow"
                  />
                ) : (
                  <p className="text-xs text-slate-400 italic">User belum mengunggah bukti pembayaran.</p>
                )}
              </div>
            </div>

            {/* Verification Checklist Information */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Total Tagihan Sistem:</span>
                <span className="font-extrabold text-slate-900 text-base tabular-nums">
                  Rp {inspectingOrder.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Status Saat Ini:</span>
                <div className="mt-1">
                  <StatusBadge type="payment" status={inspectingOrder.paymentStatus} size="sm" />
                </div>
              </div>
              {inspectingOrder.paymentRejectionReason && (
                <div className="col-span-2 pt-2 border-t border-slate-200 text-rose-700">
                  <strong>Alasan Penolakan Terakhir:</strong> {inspectingOrder.paymentRejectionReason}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>

              {inspectingOrder.paymentStatus !== 'Pembayaran Valid' && (
                <button
                  type="button"
                  onClick={() => handleOpenRejectModal(inspectingOrder)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Pembayaran</span>
                </button>
              )}

              {inspectingOrder.paymentStatus !== 'Pembayaran Valid' && (
                <button
                  type="button"
                  onClick={() => handleApprove(inspectingOrder)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Pembayaran (Lunas)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL (MANDATORY REASON) */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-rose-700 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Tolak Pembayaran ({rejectingOrder.id})
              </h3>
              <button
                onClick={() => setRejectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Mohon masukkan alasan penolakan pembayaran secara jelas agar pelanggan dapat memperbaiki atau melakukan transfer ulang.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Penolakan (Wajib Diisi):
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Nominal transfer kurang Rp 25.000, atau bukti transfer blur / bukan rekening tujuan..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Buttons for Admin Convenience */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Nominal transfer kurang dari total tagihan.',
                  'Bukti transfer buram / tidak terbaca.',
                  'Dana belum masuk ke rekening QRIS.',
                ].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!rejectionReason.trim()}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${
                    rejectionReason.trim() ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Konfirmasi Tolak Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
