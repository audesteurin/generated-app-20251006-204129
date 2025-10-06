import { IndexedEntity } from "./core-utils";
import type { Product, Category, Client, Sale, SaleItem, Supplier, SupplierOrder, SupplierOrderItem, Transaction, TransactionCategory, User, Role, Permission, ProductMovement } from "@shared/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_CLIENTS, MOCK_SALES, MOCK_SALE_ITEMS, MOCK_SUPPLIERS, MOCK_SUPPLIER_ORDERS, MOCK_SUPPLIER_ORDER_ITEMS, MOCK_TRANSACTIONS, MOCK_TRANSACTION_CATEGORIES, MOCK_USERS, MOCK_ROLES, MOCK_PERMISSIONS, MOCK_PRODUCT_MOVEMENTS } from "@shared/mock-data";
export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = {
    id: "", name: "", reference: "", categoryId: "", stockQuantity: 0, unit: "piece", priceSale: 0, pricePurchase: 0, status: "inactive", createdAt: "", updatedAt: "", createdBy: "", updatedBy: "",
  };
  static seedData = MOCK_PRODUCTS;
}
export class CategoryEntity extends IndexedEntity<Category> {
  static readonly entityName = "category";
  static readonly indexName = "categories";
  static readonly initialState: Category = { id: "", name: "", createdAt: "", updatedAt: "" };
  static seedData = MOCK_CATEGORIES;
}
export class ClientEntity extends IndexedEntity<Client> {
  static readonly entityName = "client";
  static readonly indexName = "clients";
  static readonly initialState: Client = {
    id: "", firstName: "", lastName: "", email: "", clientType: "individual", registrationDate: "", createdAt: "", updatedAt: "", createdBy: "", updatedBy: "",
  };
  static seedData = MOCK_CLIENTS;
}
export class SaleEntity extends IndexedEntity<Sale> {
  static readonly entityName = "sale";
  static readonly indexName = "sales";
  static readonly initialState: Sale = {
    id: "", saleNumber: "", clientId: "", userId: "", date: "", totalAmount: 0, status: "pending", paymentMethod: "", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_SALES;
}
export class SaleItemEntity extends IndexedEntity<SaleItem> {
  static readonly entityName = "saleItem";
  static readonly indexName = "saleItems";
  static readonly initialState: SaleItem = {
    id: "", saleId: "", productId: "", quantity: 0, unitPrice: 0, totalPrice: 0, createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_SALE_ITEMS;
}
export class SupplierEntity extends IndexedEntity<Supplier> {
  static readonly entityName = "supplier";
  static readonly indexName = "suppliers";
  static readonly initialState: Supplier = {
    id: "", companyName: "", email: "", status: "inactive", createdAt: "", updatedAt: "", createdBy: "", updatedBy: "",
  };
  static seedData = MOCK_SUPPLIERS;
}
export class SupplierOrderEntity extends IndexedEntity<SupplierOrder> {
  static readonly entityName = "supplierOrder";
  static readonly indexName = "supplierOrders";
  static readonly initialState: SupplierOrder = {
    id: "", supplierId: "", orderNumber: "", orderDate: "", totalAmount: 0, status: "draft", createdBy: "", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_SUPPLIER_ORDERS;
}
export class SupplierOrderItemEntity extends IndexedEntity<SupplierOrderItem> {
  static readonly entityName = "supplierOrderItem";
  static readonly indexName = "supplierOrderItems";
  static readonly initialState: SupplierOrderItem = {
    id: "", supplierOrderId: "", productId: "", quantity: 0, unitPrice: 0, totalPrice: 0, createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_SUPPLIER_ORDER_ITEMS;
}
export class TransactionEntity extends IndexedEntity<Transaction> {
  static readonly entityName = "transaction";
  static readonly indexName = "transactions";
  static readonly initialState: Transaction = {
    id: "", reference: "", type: "expense", categoryId: "", description: "", amount: 0, paymentMethod: "", date: "", status: "pending", createdBy: "", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_TRANSACTIONS;
}
export class TransactionCategoryEntity extends IndexedEntity<TransactionCategory> {
  static readonly entityName = "transactionCategory";
  static readonly indexName = "transactionCategories";
  static readonly initialState: TransactionCategory = {
    id: "", name: "", type: "expense", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_TRANSACTION_CATEGORIES;
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = {
    id: "", firstName: "", lastName: "", email: "", passwordHash: "", roleId: "", status: "inactive", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_USERS;
}
export class RoleEntity extends IndexedEntity<Role> {
  static readonly entityName = "role";
  static readonly indexName = "roles";
  static readonly initialState: Role = {
    id: "", name: "", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_ROLES;
}
export class PermissionEntity extends IndexedEntity<Permission> {
  static readonly entityName = "permission";
  static readonly indexName = "permissions";
  static readonly initialState: Permission = {
    id: "", roleId: "", module: "", canCreate: false, canRead: false, canUpdate: false, canDelete: false, createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_PERMISSIONS;
}
export class ProductMovementEntity extends IndexedEntity<ProductMovement> {
  static readonly entityName = "productMovement";
  static readonly indexName = "productMovements";
  static readonly initialState: ProductMovement = {
    id: "", productId: "", type: "adjustment", quantity: 0, date: "", userId: "", createdAt: "", updatedAt: "",
  };
  static seedData = MOCK_PRODUCT_MOVEMENTS;
}