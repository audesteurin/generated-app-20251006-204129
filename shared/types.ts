export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Base Timestamps and User Tracking
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
interface UserTracked {
  createdBy: string; // UserId
  updatedBy: string; // UserId
}
// 1. Products
export interface Product extends BaseEntity, UserTracked {
  name: string;
  reference: string;
  descriptionShort?: string;
  descriptionLong?: string;
  categoryId: string;
  stockQuantity: number;
  unit: string; // e.g., 'piece', 'kg', 'm'
  priceSale: number;
  pricePurchase: number;
  status: 'active' | 'inactive' | 'archived';
  images?: string[]; // URLs
}
export interface Category extends BaseEntity {
  name: string;
  parentId?: string | null;
}
export interface ProductMovement extends BaseEntity {
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  date: string;
  userId: string;
}
// 2. Sales
export interface Sale extends BaseEntity {
  saleNumber: string;
  clientId: string;
  userId: string;
  date: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  notes?: string;
}
export interface SaleItem extends BaseEntity {
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface SalePayment extends BaseEntity {
  saleId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  userId: string;
}
// 3. Clients
export interface Client extends BaseEntity, UserTracked {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  clientType: 'individual' | 'company';
  registrationDate: string;
  notes?: string;
}
export interface ClientInteraction extends BaseEntity {
  clientId: string;
  interaction: string;
  userId: string;
  date: string;
}
// 4. Suppliers
export interface Supplier extends BaseEntity, UserTracked {
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  notes?: string;
  status: 'active' | 'inactive';
}
export interface SupplierOrder extends BaseEntity {
  supplierId: string;
  orderNumber: string;
  orderDate: string;
  expectedDate?: string;
  totalAmount: number;
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  createdBy: string; // UserId
}
export interface SupplierOrderItem extends BaseEntity {
  supplierOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
// 5. Recettes & Dépenses (Transactions)
export interface Transaction extends BaseEntity {
  reference: string;
  type: 'revenue' | 'expense';
  sourceType?: 'sale' | 'supplier_order' | 'other';
  sourceId?: string;
  categoryId: string;
  description: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  createdBy: string; // UserId
}
export interface TransactionCategory extends BaseEntity {
  name: string;
  type: 'revenue' | 'expense';
  description?: string;
}
// 6. Accounts
export interface Account extends BaseEntity {
  name: string;
  balance: number;
  type: 'bank' | 'cash' | 'other';
}
export interface AccountMovement extends BaseEntity {
  accountId: string;
  transactionId?: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  userId: string;
}
// 7. Users & Permissions
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string; // Should not be sent to client
  roleId: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
}
export interface Role extends BaseEntity {
  name: string;
  description?: string;
}
export interface Permission extends BaseEntity {
  roleId: string;
  module: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
export interface UserLog extends BaseEntity {
  userId: string;
  action: string;
  module: string;
  timestamp: string;
}
// Generic type for paginated API responses
export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}