export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  address?: string;
}

export interface ProductSpecSize {
  id: string;
  label: string;
  multiplier: number;
  description?: string;
}

export interface ProductSpecMaterial {
  id: string;
  label: string;
  priceAdd: number;
  description?: string;
}

export interface ProductSpecFinishing {
  id: string;
  label: string;
  priceAdd: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Spanduk & Banner' | 'Stiker & Label' | 'Brosur & Flyer' | 'Kartu Nama & Dokumen' | 'Merchandise & Sablon' | 'Lainnya';
  description: string;
  features: string[];
  basePrice: number;
  unit: string;
  minQty: number;
  image: string;
  sizes: ProductSpecSize[];
  materials: ProductSpecMaterial[];
  finishings: ProductSpecFinishing[];
  allowCustomDimensions?: boolean; // For banner/spanduk (P x L meter)
  estimatedDays: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  material: string;
  finishing: string;
  customWidth?: number; // in meters if applicable
  customHeight?: number; // in meters if applicable
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  notes?: string;
}

export type PaymentStatus = 
  | 'Belum Bayar' 
  | 'Menunggu Validasi' 
  | 'Pembayaran Valid' 
  | 'Pembayaran Ditolak';

export type OrderStatus = 
  | 'Menunggu Validasi' 
  | 'Diproses' 
  | 'Dicetak' 
  | 'Selesai' 
  | 'Ditolak';

export interface OrderTimelineEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string; // e.g. BDP-2026-1042
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'QRIS';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string;
  paymentProofName?: string;
  paymentSubmittedAt?: string;
  paymentRejectionReason?: string;
  orderRejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
