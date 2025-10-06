import type { Product, Category, User, Client, Sale, SaleItem, Supplier, SupplierOrder, SupplierOrderItem, Transaction, TransactionCategory } from './types';
export const MOCK_USER: User = {
  id: 'user-1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@nexus.com',
  passwordHash: '',
  roleId: 'role-1',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Électronique', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Vêtements', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Maison & Jardin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Smartphones', parentId: 'cat-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Smartphone X-1000',
    reference: 'NEX-X1000',
    categoryId: 'cat-4',
    stockQuantity: 150,
    unit: 'piece',
    priceSale: 799.99,
    pricePurchase: 450.00,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'prod-2',
    name: 'T-Shirt Classique',
    reference: 'NEX-TSHIRT-BLK',
    categoryId: 'cat-2',
    stockQuantity: 500,
    unit: 'piece',
    priceSale: 29.99,
    pricePurchase: 12.50,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
];
export const MOCK_CLIENTS: Client[] = [
    {
        id: 'client-1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        clientType: 'individual',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
    },
    {
        id: 'client-2',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@science.com',
        clientType: 'individual',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
    }
];
export const MOCK_SALES: Sale[] = [
    {
        id: 'sale-1',
        saleNumber: 'VTE-2024-001',
        clientId: 'client-1',
        userId: 'user-1',
        date: new Date().toISOString(),
        totalAmount: 829.98,
        status: 'completed',
        paymentMethod: 'Credit Card',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
export const MOCK_SALE_ITEMS: SaleItem[] = [
    {
        id: 'sitem-1',
        saleId: 'sale-1',
        productId: 'prod-1',
        quantity: 1,
        unitPrice: 799.99,
        totalPrice: 799.99,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'sitem-2',
        saleId: 'sale-1',
        productId: 'prod-2',
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    companyName: 'ElectroFournisseur Inc.',
    email: 'contact@electrofournisseur.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
  {
    id: 'sup-2',
    companyName: 'Textile World',
    email: 'sales@textileworld.com',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  }
];
export const MOCK_SUPPLIER_ORDERS: SupplierOrder[] = [
  {
    id: 'supord-1',
    supplierId: 'sup-1',
    orderNumber: 'CMD-F-2024-001',
    orderDate: new Date().toISOString(),
    totalAmount: 45000,
    status: 'ordered',
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
export const MOCK_SUPPLIER_ORDER_ITEMS: SupplierOrderItem[] = [
  {
    id: 'suporditem-1',
    supplierOrderId: 'supord-1',
    productId: 'prod-1',
    quantity: 100,
    unitPrice: 450,
    totalPrice: 45000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
export const MOCK_TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { id: 'tcat-1', name: 'Ventes de produits', type: 'revenue', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'tcat-2', name: 'Achat de marchandises', type: 'expense', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'tcat-3', name: 'Marketing', type: 'expense', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'trans-1',
    reference: 'VTE-2024-001',
    type: 'revenue',
    sourceType: 'sale',
    sourceId: 'sale-1',
    categoryId: 'tcat-1',
    description: 'Vente de Smartphone et T-Shirt',
    amount: 829.98,
    paymentMethod: 'Credit Card',
    date: new Date().toISOString(),
    status: 'completed',
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'trans-2',
    reference: 'CMD-F-2024-001',
    type: 'expense',
    sourceType: 'supplier_order',
    sourceId: 'supord-1',
    categoryId: 'tcat-2',
    description: 'Achat de 100 Smartphones X-1000',
    amount: 45000,
    paymentMethod: 'Bank Transfer',
    date: new Date().toISOString(),
    status: 'completed',
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];