import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { DollarSign, Download, Printer, TrendingUp, Calendar, Filter, Award, ShoppingBag } from 'lucide-react';

type DateFilterMode = 'harian' | 'mingguan' | 'bulanan' | 'semua' | 'kustom';

export const AdminSalesReport: React.FC = () => {
  const { orders } = useShop();

  const [dateFilter, setDateFilter] = useState<DateFilterMode>('semua');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Critical rule: Hanya pesanan dengan pembayaran valid yang dihitung sebagai pemasukan!
  const validIncomeOrders = useMemo(() => {
    const validOnly = orders.filter(o => o.paymentStatus === 'Pembayaran Valid');
    const now = new Date();

    if (dateFilter === 'harian') {
      const todayStr = now.toISOString().split('T')[0];
      return validOnly.filter(o => o.createdAt.startsWith(todayStr));
    }

    if (dateFilter === 'mingguan') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return validOnly.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    }

    if (dateFilter === 'bulanan') {
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      return validOnly.filter(o => o.createdAt.startsWith(currentYearMonth));
    }

    if (dateFilter === 'kustom' && customStartDate) {
      const start = new Date(customStartDate);
      const end = customEndDate ? new Date(customEndDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return validOnly.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    return validOnly;
  }, [orders, dateFilter, customStartDate, customEndDate]);

  // Aggregate metrics
  const totalRevenue = validIncomeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransactions = validIncomeOrders.length;
  const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Best selling products calculation
  const productSalesMap = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    validIncomeOrders.forEach(ord => {
      ord.items.forEach(it => {
        if (!map[it.productName]) {
          map[it.productName] = { name: it.productName, qty: 0, revenue: 0 };
        }
        map[it.productName].qty += it.quantity;
        map[it.productName].revenue += it.totalPrice;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [validIncomeOrders]);

  const bestSeller = productSalesMap[0] || { name: 'Belum ada data', qty: 0, revenue: 0 };

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Nomor Order', 'Nama Pelanggan', 'No HP', 'Produk & Spesifikasi', 'Jumlah Item', 'Metode Bayar', 'Status Bayar', 'Total Pemasukan (IDR)'];
    
    const rows = validIncomeOrders.map(o => [
      `"${new Date(o.createdAt).toLocaleDateString('id-ID')}"`,
      `"${o.id}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.items.map(i => `${i.productName} (${i.size})`).join('; ').replace(/"/g, '""')}"`,
      o.items.reduce((s, i) => s + i.quantity, 0),
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      o.totalAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Pemasukan_Banten_Printing_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Akuntansi & Finansial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Laporan Pemasukan Penjualan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data omzet hanya menghitung pesanan dengan status <strong>"Pembayaran Valid (Lunas)"</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export ke CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan / PDF</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400 mr-1" />
          <span className="text-xs font-bold text-slate-700 mr-2">Rentang Waktu:</span>
          {(['semua', 'harian', 'mingguan', 'bulanan', 'kustom'] as DateFilterMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setDateFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                dateFilter === mode
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode === 'semua' ? 'Semua Waktu' : mode === 'harian' ? 'Hari Ini' : mode === 'mingguan' ? '7 Hari Terakhir' : mode === 'bulanan' ? 'Bulan Ini' : 'Kustom'}
            </button>
          ))}
        </div>

        {dateFilter === 'kustom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-700"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-700"
            />
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Pemasukan Bersih
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono tabular-nums">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            ✓ 100% Pembayaran QRIS Lunas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Jumlah Transaksi Valid
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 tabular-nums">
            {totalTransactions} <span className="text-sm font-medium text-slate-500">pesanan</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Telah lolos verifikasi bank
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Rata-rata Nilai Pesanan (AOV)
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900 font-mono tabular-nums">
            Rp {averageOrderValue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Per transaksi berhasil
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Produk Paling Laris
          </span>
          <div className="mt-2 text-sm font-bold text-slate-900 line-clamp-1">
            {bestSeller.name}
          </div>
          <span className="text-[11px] text-orange-600 font-semibold block mt-1">
            Terjual: {bestSeller.qty} pcs
          </span>
        </div>
      </div>

      {/* Revenue Breakdown & Best Seller Mini Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Distribusi Omzet per Kategori Produk
            </h3>
            <span className="text-xs text-slate-400">Periode Terpilih</span>
          </div>

          <div className="space-y-3 pt-2">
            {productSalesMap.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada data penjualan pada rentang ini.</p>
            ) : (
              productSalesMap.slice(0, 5).map((prod, i) => {
                const percent = totalRevenue > 0 ? ((prod.revenue / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-semibold truncate max-w-md">{prod.name} ({prod.qty}x)</span>
                      <span className="font-bold tabular-nums font-mono text-slate-900">
                        Rp {prod.revenue.toLocaleString('id-ID')} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-orange-500 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Award className="w-4 h-4 text-orange-500" />
            Top Penjualan Produk
          </h3>
          <p className="text-xs text-slate-500">
            Urutan produk percetakan dengan kontribusi omzet terbesar:
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {productSalesMap.slice(0, 4).map((p, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[10px] flex items-center justify-center text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium truncate max-w-[140px]">{p.name}</span>
                </div>
                <span className="font-bold tabular-nums text-slate-900">
                  Rp {p.revenue.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Detailed Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Rincian Rekap Transaksi Penjualan Masuk
            </h3>
            <p className="text-xs text-slate-500">
              Total {validIncomeOrders.length} transaksi yang valid masuk ke kas
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">No. Order</th>
                <th className="px-5 py-3 font-semibold">Pelanggan</th>
                <th className="px-5 py-3 font-semibold">Rincian Produk & Spesifikasi</th>
                <th className="px-5 py-3 font-semibold text-center">Jumlah</th>
                <th className="px-5 py-3 font-semibold text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {validIncomeOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada transaksi dengan status pembayaran valid pada filter waktu ini.
                  </td>
                </tr>
              ) : (
                validIncomeOrders.map(order => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        <div>{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-700 max-w-sm">
                        {order.items.map((it, i) => (
                          <div key={i} className="truncate">
                            • <strong>{it.productName}</strong> ({it.size}, {it.material}) - {it.quantity}x
                          </div>
                        ))}
                      </td>
                      <td className="px-5 py-4 text-center font-semibold text-slate-800">
                        {totalItems}
                      </td>
                      <td className="px-5 py-4 text-right font-extrabold text-slate-900 font-mono tabular-nums">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {validIncomeOrders.length > 0 && (
              <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                <tr>
                  <td colSpan={4} className="px-5 py-3.5 text-slate-800 uppercase tracking-wider text-right">
                    Total Keseluruhan Pemasukan:
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-900 font-bold">
                    {validIncomeOrders.reduce((sum, ord) => sum + ord.items.reduce((s, it) => s + it.quantity, 0), 0)} pcs
                  </td>
                  <td className="px-5 py-3.5 text-right font-black text-slate-900 font-mono tabular-nums text-sm">
                    Rp {totalRevenue.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* PRINT-ONLY OFFICIAL DOCUMENT HEADER */}
      <div className="print-only p-8 text-black space-y-4">
        <div className="text-center border-b-2 border-black pb-4">
          <h2 className="text-2xl font-black">BANTEN DIGITAL PRINTING</h2>
          <p className="text-xs">Pusat Percetakan Spanduk, Stiker, Kartu Nama & Offset Digital</p>
          <p className="text-xs">Jl. Ahmad Yani No. 45, Cipocok Jaya, Kota Serang, Banten · Telp: 0812-9876-5432</p>
        </div>
        <div className="flex justify-between text-xs py-2">
          <span>Dicetak Pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</span>
          <span>Diverifikasi oleh: Tim Finance & Accounting</span>
        </div>
      </div>
    </div>
  );
};
