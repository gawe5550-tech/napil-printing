import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  DollarSign, Package, Clock, CheckCircle2, TrendingUp, AlertCircle, 
  ArrowRight, Users, Printer, ShieldAlert, ArrowUpRight 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders } = useShop();

  // Financial calculations: ONLY orders with 'Pembayaran Valid' count towards income!
  const validOrders = orders.filter(o => o.paymentStatus === 'Pembayaran Valid');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Status counts
  const totalOrdersCount = orders.length;
  const pendingPaymentsCount = orders.filter(o => o.paymentStatus === 'Menunggu Validasi').length;
  const inProductionCount = orders.filter(o => ['Diproses', 'Dicetak'].includes(o.orderStatus)).length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'Selesai').length;

  // Monthly / Daily mock distribution for simple bar chart
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Portal Administrator Percetakan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Ringkasan Operasional & Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau arus transaksi QRIS, antrean mesin cetak, dan performa omzet harian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/payments"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Validasi Pembayaran ({pendingPaymentsCount})</span>
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Laporan Lengkap</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Pemasukan (Valid Payments Only) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pemasukan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums font-mono">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dari {validOrders.length} transaksi QRIS valid
            </p>
          </div>
        </div>

        {/* Card 2: Pembayaran Menunggu Validasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menunggu Validasi</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {pendingPaymentsCount} <span className="text-xs font-medium text-slate-500">transaksi</span>
            </div>
            <Link
              to="/admin/payments"
              className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 mt-1 underline"
            >
              <span>Periksa bukti transfer</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Pesanan Diproses & Dicetak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dalam Produksi</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {inProductionCount} <span className="text-xs font-medium text-slate-500">antrean</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 mt-1 underline"
            >
              <span>Pantau mesin cetak</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Total Pesanan Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Semua Pesanan</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {totalOrdersCount} <span className="text-xs font-medium text-slate-500">pesanan</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {completedOrdersCount} pesanan telah selesai diserahkan
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Simple Sales Volume Chart + Attention Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Grafik Tren Pemasukan Penjualan
              </h3>
              <p className="text-xs text-slate-500">Volume transaksi berhasil 7 hari terakhir</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Oktober 2026
            </span>
          </div>

          {/* Bar Chart Representation with clean styling */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-200 pb-2">
              {[
                { day: 'Sen', amount: 190000, height: '40%' },
                { day: 'Sel', amount: 320000, height: '65%' },
                { day: 'Rab', amount: 206250, height: '45%' },
                { day: 'Kam', amount: 480000, height: '85%' },
                { day: 'Jum', amount: 298000, height: '60%' },
                { day: 'Sab', amount: 560000, height: '95%' },
                { day: 'Min', amount: 115000, height: '28%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 bg-slate-100 px-1 py-0.5 rounded tabular-nums whitespace-nowrap">
                    Rp {bar.amount.toLocaleString('id-ID')}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-lg h-36 flex items-end justify-center p-1">
                    <div
                      style={{ height: bar.height }}
                      className="w-full bg-orange-500 group-hover:bg-orange-600 rounded-t-md transition-all shadow-sm"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded" />
              <span>Omzet Terverifikasi Lunas (QRIS)</span>
            </div>
            <span>Rata-rata: Rp 310.000 / transaksi</span>
          </div>
        </div>

        {/* Right Column: Quick Pending Actions */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            Tindakan Penting Hari Ini
          </h3>

          <div className="space-y-3">
            {pendingPaymentsCount > 0 ? (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">
                    {pendingPaymentsCount} Pembayaran Butuh Validasi
                  </p>
                  <p className="text-amber-800 mt-0.5">
                    Pelanggan sudah mengunggah bukti QRIS. Harap cek rekening sebelum menyetujui.
                  </p>
                  <Link
                    to="/admin/payments"
                    className="inline-block mt-2 font-bold text-amber-900 underline"
                  >
                    Buka Halaman Validasi →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Semua pembayaran sudah tervalidasi rapi!</span>
              </div>
            )}

            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
              <Printer className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-blue-900">
                  {inProductionCount} Pesanan Siap / Sedang Dicetak
                </p>
                <p className="text-blue-800 mt-0.5">
                  Perbarui status ke "Dicetak" atau "Selesai" jika barang telah difinishing.
                </p>
                <Link
                  to="/admin/orders"
                  className="inline-block mt-2 font-bold text-blue-900 underline"
                >
                  Kelola Status Cetak →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Pesanan Terbaru Masuk
            </h3>
            <p className="text-xs text-slate-500">5 transaksi teratas di sistem</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">No. Order</th>
                <th className="px-5 py-3 font-semibold">Pelanggan</th>
                <th className="px-5 py-3 font-semibold">Produk</th>
                <th className="px-5 py-3 font-semibold">Status Bayar</th>
                <th className="px-5 py-3 font-semibold">Status Cetak</th>
                <th className="px-5 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{order.id}</td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    <div>{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                    {order.items.map(i => i.productName).join(', ')}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge type="payment" status={order.paymentStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge type="order" status={order.orderStatus} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 tabular-nums">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
