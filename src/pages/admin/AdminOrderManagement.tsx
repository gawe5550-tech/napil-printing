import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { 
  Printer, CheckCircle2, XCircle, Eye, AlertTriangle, Layers, 
  PackageCheck, FileText, Download, Lock, Search, Filter, X 
} from 'lucide-react';

export const AdminOrderManagement: React.FC = () => {
  const { orders, adminUpdateOrderStatus } = useShop();

  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for viewing details & file design
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Reject order modal state
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'Semua' ? true : order.orderStatus === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(i => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    const res = adminUpdateOrderStatus(order.id, newStatus);
    if (res.success && inspectingOrder?.id === order.id) {
      setInspectingOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    }
  };

  const handleConfirmRejectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingOrder || !rejectionReason.trim()) return;

    adminUpdateOrderStatus(rejectingOrder.id, 'Ditolak', rejectionReason.trim());
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
          Divisi Produksi Percetakan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Validasi & Kelola Status Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Periksa file desain pelanggan, setujui/tolak pesanan, dan perbarui proses cetak ke Diproses → Dicetak → Selesai.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari No. Order, nama pelanggan, produk..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['Semua', 'Menunggu Validasi', 'Diproses', 'Dicetak', 'Selesai', 'Ditolak'].map(status => (
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">No. Order</th>
                <th className="px-5 py-3 font-semibold">Pelanggan</th>
                <th className="px-5 py-3 font-semibold">Item & Spesifikasi</th>
                <th className="px-5 py-3 font-semibold">File Desain</th>
                <th className="px-5 py-3 font-semibold">Status Bayar</th>
                <th className="px-5 py-3 font-semibold">Status Produksi</th>
                <th className="px-5 py-3 font-semibold text-right">Alur Mesin Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada pesanan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isPaymentValid = order.paymentStatus === 'Pembayaran Valid';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        <div>{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-700 max-w-xs">
                        <div className="font-semibold truncate">
                          {order.items.map(i => i.productName).join(', ')}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {order.items.map(i => `${i.size} (${i.quantity}x)`).join(' · ')}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Periksa File</span>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge type="payment" status={order.paymentStatus} size="sm" />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge type="order" status={order.orderStatus} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {/* Status progression control according to strict rule: "Pesanan hanya bisa diproses jika pembayaran sudah valid" */}
                        {!isPaymentValid ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold" title="Harus divalidasi lunas terlebih dahulu di tab Validasi Payment">
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Butuh Validasi Bayar</span>
                          </div>
                        ) : order.orderStatus === 'Menunggu Validasi' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(order, 'Diproses')}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              <span>Mulai Proses</span>
                            </button>
                            <button
                              onClick={() => {
                                setRejectingOrder(order);
                                setRejectionReason('');
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : order.orderStatus === 'Diproses' ? (
                          <button
                            onClick={() => handleUpdateStatus(order, 'Dicetak')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Kirim ke Mesin Cetak</span>
                          </button>
                        ) : order.orderStatus === 'Dicetak' ? (
                          <button
                            onClick={() => handleUpdateStatus(order, 'Selesai')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Tandai Selesai</span>
                          </button>
                        ) : order.orderStatus === 'Selesai' ? (
                          <span className="text-emerald-700 font-semibold text-xs inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Produksi Selesai
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold text-xs">
                            Pesanan Ditolak
                          </span>
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

      {/* INSPECT ORDER & DESIGN FILE MODAL */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 space-y-6 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span>Rincian Spesifikasi & File Desain</span>
                  <span className="font-mono text-orange-600 text-base">({inspectingOrder.id})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pemesan: {inspectingOrder.customerName} ({inspectingOrder.customerPhone}) · {inspectingOrder.customerEmail}
                </p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Strict Payment Status Warning */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${
              inspectingOrder.paymentStatus === 'Pembayaran Valid'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {inspectingOrder.paymentStatus === 'Pembayaran Valid' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold block">
                    Status Pembayaran: {inspectingOrder.paymentStatus}
                  </span>
                  {inspectingOrder.paymentStatus !== 'Pembayaran Valid' && (
                    <span className="text-[11px] text-amber-800">
                      Pesanan ini belum bisa diproduksi sebelum pembayaran diverifikasi di tab Validasi Payment.
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge type="payment" status={inspectingOrder.paymentStatus} size="sm" />
            </div>

            {/* Items and Design Files Detail */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Item Pesanan & File Desain:
              </h4>

              {inspectingOrder.items.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{idx + 1}. {item.productName}</h5>
                      <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                        <p><strong>Ukuran:</strong> {item.size}</p>
                        <p><strong>Bahan:</strong> {item.material}</p>
                        <p><strong>Finishing:</strong> {item.finishing}</p>
                        <p><strong>Jumlah:</strong> {item.quantity} pcs (Total Rp {item.totalPrice.toLocaleString('id-ID')})</p>
                      </div>
                    </div>

                    {/* Design thumbnail or preview */}
                    <div className="text-right shrink-0">
                      <div className="w-24 h-24 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm relative group mb-1">
                        <img
                          src={item.fileUrl || item.productImage}
                          alt="Desain"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {item.notes && (
                    <div className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-lg text-xs text-amber-900">
                      <strong>Catatan Khusus Pelanggan:</strong> {item.notes}
                    </div>
                  )}

                  {/* File actions */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600 truncate max-w-sm">
                      Nama File: <strong>{item.fileName || 'Belum ada nama file'}</strong>
                    </span>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        download={item.fileName || 'file_cetak.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Unduh / Buka File HD</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong>Tujuan Pengiriman / Pengambilan:</strong> {inspectingOrder.customerAddress}
            </div>

            {/* Workflow Control Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInspectingOrder(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {inspectingOrder.orderStatus !== 'Ditolak' && inspectingOrder.orderStatus !== 'Selesai' && (
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingOrder(inspectingOrder);
                      setRejectionReason('');
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold"
                  >
                    Tolak Pesanan
                  </button>
                )}

                {inspectingOrder.paymentStatus === 'Pembayaran Valid' && (
                  <>
                    {inspectingOrder.orderStatus === 'Menunggu Validasi' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inspectingOrder, 'Diproses')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Mulai Diproses
                      </button>
                    )}
                    {inspectingOrder.orderStatus === 'Diproses' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inspectingOrder, 'Dicetak')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Kirim ke Mesin Cetak
                      </button>
                    )}
                    {inspectingOrder.orderStatus === 'Dicetak' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inspectingOrder, 'Selesai')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        Tandai Selesai Siap Ambil
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT ORDER MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-rose-700 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Tolak Pesanan ({rejectingOrder.id})
              </h3>
              <button
                onClick={() => setRejectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Berikan alasan penolakan agar pelanggan memahami mengapa file atau spesifikasi pesanan tidak dapat dicetak.
            </p>

            <form onSubmit={handleConfirmRejectOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alasan Penolakan Pesanan (Wajib):
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Resolusi file desain terlalu pecah (< 72 DPI), teks terpotong batas margin aman..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Resolusi file desain terlalu rendah / pecah.',
                  'Bahan yang dipilih sedang kehabisan stok supplier.',
                  'File desain belum disematkan font (missing font).',
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
                  Konfirmasi Tolak Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
