import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, ToastMessage } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/initialData';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  toasts: ToastMessage[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  updateCartNotes: (id: string, notes: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  createOrder: (data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
  }) => Order;
  submitPaymentProof: (orderId: string, proofUrl: string, proofName: string) => boolean;
  adminValidatePayment: (orderId: string, approved: boolean, rejectionReason?: string) => { success: boolean; message: string };
  adminUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, rejectionReason?: string) => { success: boolean; message: string };
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  resetToDummyData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bdp_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bdp_orders_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('bdp_cart_items', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bdp_orders_list', JSON.stringify(orders));
  }, [orders]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: 'cart_' + Date.now() + Math.random().toString(36).substr(2, 4),
    };
    setCart(prev => [...prev, newItem]);
    addToast(`"${item.productName}" berhasil ditambahkan ke keranjang!`, 'success');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const updateCartNotes = (id: string, notes: string) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, notes } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const formatIndoDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = String(date.getDate()).padStart(2, '0');
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d} ${m} ${y}, ${h}:${min} WIB`;
  };

  const createOrder = (data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
  }): Order => {
    const now = new Date();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BDP-${now.getFullYear()}-${randomNum}`;
    const subtotal = data.items.reduce((sum, it) => sum + it.totalPrice, 0);

    const newOrder: Order = {
      id: orderId,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      items: [...data.items],
      subtotal,
      shippingFee: 0,
      totalAmount: subtotal,
      paymentMethod: 'QRIS',
      paymentStatus: 'Belum Bayar',
      orderStatus: 'Menunggu Validasi',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: [
        {
          status: 'Pesanan Dibuat',
          title: 'Pesanan Terdaftar di Sistem',
          description: `Nomor pesanan ${orderId} diterbitkan. Silakan selesaikan pembayaran via QRIS.`,
          timestamp: formatIndoDate(now),
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addToast(`Pesanan #${orderId} berhasil dibuat. Silakan bayar melalui QRIS!`, 'success');
    return newOrder;
  };

  const submitPaymentProof = (orderId: string, proofUrl: string, proofName: string) => {
    const now = new Date();
    let found = false;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          found = true;
          const isReupload = ord.paymentStatus === 'Pembayaran Ditolak';
          return {
            ...ord,
            paymentStatus: 'Menunggu Validasi',
            paymentProofUrl: proofUrl,
            paymentProofName: proofName,
            paymentSubmittedAt: now.toISOString(),
            paymentRejectionReason: undefined,
            updatedAt: now.toISOString(),
            timeline: [
              ...ord.timeline,
              {
                status: 'Menunggu Validasi',
                title: isReupload ? 'Bukti Bayar Diunggah Ulang' : 'Bukti Pembayaran Diunggah',
                description: `Bukti transfer (${proofName}) berhasil diunggah. Menunggu verifikasi tim admin.`,
                timestamp: formatIndoDate(now),
              },
            ],
          };
        }
        return ord;
      })
    );

    if (found) {
      addToast('Bukti pembayaran berhasil diunggah! Status: Menunggu Validasi', 'success');
      return true;
    }
    return false;
  };

  const adminValidatePayment = (orderId: string, approved: boolean, rejectionReason?: string) => {
    const now = new Date();
    let result = { success: false, message: 'Pesanan tidak ditemukan' };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          if (approved) {
            result = { success: true, message: `Pembayaran ${orderId} disetujui (Lunas)` };
            return {
              ...ord,
              paymentStatus: 'Pembayaran Valid',
              updatedAt: now.toISOString(),
              timeline: [
                ...ord.timeline,
                {
                  status: 'Pembayaran Valid',
                  title: 'Pembayaran Valid (Lunas)',
                  description: 'Admin Finance memverifikasi dana transfer telah masuk ke rekening QRIS.',
                  timestamp: formatIndoDate(now),
                },
              ],
            };
          } else {
            if (!rejectionReason || !rejectionReason.trim()) {
              result = { success: false, message: 'Alasan penolakan wajib diisi' };
              return ord;
            }
            result = { success: true, message: `Pembayaran ${orderId} ditolak` };
            return {
              ...ord,
              paymentStatus: 'Pembayaran Ditolak',
              paymentRejectionReason: rejectionReason.trim(),
              updatedAt: now.toISOString(),
              timeline: [
                ...ord.timeline,
                {
                  status: 'Pembayaran Ditolak',
                  title: 'Pembayaran Ditolak',
                  description: `Alasan penolakan: ${rejectionReason.trim()}`,
                  timestamp: formatIndoDate(now),
                },
              ],
            };
          }
        }
        return ord;
      })
    );

    if (result.success) {
      addToast(result.message, approved ? 'success' : 'warning');
    } else {
      addToast(result.message, 'error');
    }

    return result;
  };

  const adminUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, rejectionReason?: string) => {
    const now = new Date();
    let result = { success: false, message: 'Pesanan tidak ditemukan' };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          // Rule check: Pesanan hanya bisa diproses jika pembayaran sudah valid!
          if (['Diproses', 'Dicetak', 'Selesai'].includes(newStatus)) {
            if (ord.paymentStatus !== 'Pembayaran Valid') {
              result = {
                success: false,
                message: 'Gagal! Pesanan hanya bisa diproses jika status pembayaran sudah "Pembayaran Valid" (Lunas).',
              };
              return ord;
            }
          }

          if (newStatus === 'Ditolak') {
            if (!rejectionReason || !rejectionReason.trim()) {
              result = { success: false, message: 'Alasan penolakan pesanan wajib diisi.' };
              return ord;
            }
            result = { success: true, message: `Pesanan ${orderId} berhasil ditolak.` };
            return {
              ...ord,
              orderStatus: 'Ditolak',
              orderRejectionReason: rejectionReason.trim(),
              updatedAt: now.toISOString(),
              timeline: [
                ...ord.timeline,
                {
                  status: 'Ditolak',
                  title: 'Pesanan Ditolak',
                  description: `Alasan: ${rejectionReason.trim()}`,
                  timestamp: formatIndoDate(now),
                },
              ],
            };
          }

          const statusTitles: Record<string, string> = {
            'Diproses': 'Pesanan Sedang Diproses',
            'Dicetak': 'Pesanan Masuk Mesin Cetak',
            'Selesai': 'Pesanan Telah Selesai',
          };

          const statusDescs: Record<string, string> = {
            'Diproses': 'File dicek pre-press, rip file, dan bahan disiapkan oleh operator.',
            'Dicetak': 'Sedang dicetak dengan mesin digital printing beresolusi tinggi.',
            'Selesai': 'Selesai cetak & finishing. Pesanan siap diambil di workshop atau dikirimkan.',
          };

          result = { success: true, message: `Status pesanan ${orderId} diubah menjadi "${newStatus}".` };
          return {
            ...ord,
            orderStatus: newStatus,
            updatedAt: now.toISOString(),
            timeline: [
              ...ord.timeline,
              {
                status: newStatus,
                title: statusTitles[newStatus] || newStatus,
                description: statusDescs[newStatus] || `Status diperbarui menjadi ${newStatus}`,
                timestamp: formatIndoDate(now),
              },
            ],
          };
        }
        return ord;
      })
    );

    if (result.success) {
      addToast(result.message, 'success');
    } else {
      addToast(result.message, 'error');
    }

    return result;
  };

  const resetToDummyData = () => {
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem('bdp_orders_list');
    localStorage.removeItem('bdp_cart_items');
    addToast('Data dummy berhasil di-reset ke kondisi awal.', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        toasts,
        addToCart,
        updateCartQuantity,
        updateCartNotes,
        removeFromCart,
        clearCart,
        createOrder,
        submitPaymentProof,
        adminValidatePayment,
        adminUpdateOrderStatus,
        addToast,
        removeToast,
        resetToDummyData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
