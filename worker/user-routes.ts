import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProductEntity, CategoryEntity, ClientEntity, SaleEntity, SaleItemEntity, SupplierEntity, SupplierOrderEntity, SupplierOrderItemEntity, TransactionEntity, TransactionCategoryEntity, UserEntity, RoleEntity, PermissionEntity, ProductMovementEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Product, Category, Client, Sale, SaleItem, Supplier, SupplierOrder, SupplierOrderItem, Transaction, TransactionCategory, User, Role, Permission } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      ProductEntity.ensureSeed(c.env),
      CategoryEntity.ensureSeed(c.env),
      ClientEntity.ensureSeed(c.env),
      SaleEntity.ensureSeed(c.env),
      SaleItemEntity.ensureSeed(c.env),
      SupplierEntity.ensureSeed(c.env),
      SupplierOrderEntity.ensureSeed(c.env),
      SupplierOrderItemEntity.ensureSeed(c.env),
      TransactionEntity.ensureSeed(c.env),
      TransactionCategoryEntity.ensureSeed(c.env),
      UserEntity.ensureSeed(c.env),
      RoleEntity.ensureSeed(c.env),
      PermissionEntity.ensureSeed(c.env),
      ProductMovementEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // PRODUCTS API
  app.get('/api/products', async (c) => ok(c, await ProductEntity.list(c.env)));
  app.post('/api/products', async (c) => {
    const body = await c.req.json<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>();
    const newProduct: Product = { ...ProductEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'user-1', updatedBy: 'user-1' };
    return ok(c, await ProductEntity.create(c.env, newProduct));
  });
  app.put('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Product>>();
    const entity = new ProductEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Product not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString(), updatedBy: 'user-1' }));
    return ok(c, updated);
  });
  app.delete('/api/products/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await ProductEntity.delete(c.env, id) });
  });
  // CATEGORIES API
  app.get('/api/categories', async (c) => ok(c, await CategoryEntity.list(c.env)));
  // CLIENTS API
  app.get('/api/clients', async (c) => ok(c, await ClientEntity.list(c.env)));
  app.post('/api/clients', async (c) => {
    const body = await c.req.json<Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'registrationDate'>>();
    const newClient: Client = { ...ClientEntity.initialState, ...body, id: crypto.randomUUID(), registrationDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'user-1', updatedBy: 'user-1' };
    return ok(c, await ClientEntity.create(c.env, newClient));
  });
  app.put('/api/clients/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Client>>();
    const entity = new ClientEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Client not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString(), updatedBy: 'user-1' }));
    return ok(c, updated);
  });
  app.delete('/api/clients/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await ClientEntity.delete(c.env, id) });
  });
  // SUPPLIERS API
  app.get('/api/suppliers', async (c) => ok(c, await SupplierEntity.list(c.env)));
  app.post('/api/suppliers', async (c) => {
    const body = await c.req.json<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>();
    const newSupplier: Supplier = { ...SupplierEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'user-1', updatedBy: 'user-1' };
    return ok(c, await SupplierEntity.create(c.env, newSupplier));
  });
  app.put('/api/suppliers/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Supplier>>();
    const entity = new SupplierEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Supplier not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString(), updatedBy: 'user-1' }));
    return ok(c, updated);
  });
  app.delete('/api/suppliers/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await SupplierEntity.delete(c.env, id) });
  });
  // SUPPLIER ORDERS API
  app.get('/api/supplier-orders', async (c) => ok(c, await SupplierOrderEntity.list(c.env)));
  app.get('/api/supplier-orders/:id/items', async (c) => {
    const { id } = c.req.param();
    const allItems = await SupplierOrderItemEntity.list(c.env);
    const orderItems = allItems.items.filter(item => item.supplierOrderId === id);
    return ok(c, { items: orderItems, next: null });
  });
  app.post('/api/supplier-orders', async (c) => {
    const { orderData, itemsData } = await c.req.json<{ orderData: Omit<SupplierOrder, 'id' | 'createdAt' | 'updatedAt'>, itemsData: Omit<SupplierOrderItem, 'id' | 'supplierOrderId'>[] }>();
    const newOrder: SupplierOrder = { ...SupplierOrderEntity.initialState, ...orderData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const createdOrder = await SupplierOrderEntity.create(c.env, newOrder);
    const orderItems: SupplierOrderItem[] = [];
    for (const item of itemsData) {
        const newOrderItem: SupplierOrderItem = { ...SupplierOrderItemEntity.initialState, ...item, id: crypto.randomUUID(), supplierOrderId: newOrder.id };
        await SupplierOrderItemEntity.create(c.env, newOrderItem);
        orderItems.push(newOrderItem);
    }
    return ok(c, { order: createdOrder, items: orderItems });
  });
  app.put('/api/supplier-orders/:id', async (c) => {
    const { id } = c.req.param();
    const { orderData, itemsData } = await c.req.json<{ orderData: Partial<SupplierOrder>, itemsData: Partial<SupplierOrderItem>[] }>();
    const orderEntity = new SupplierOrderEntity(c.env, id);
    if (!await orderEntity.exists()) return notFound(c, 'Supplier order not found');
    const updatedOrder = await orderEntity.mutate(current => ({ ...current, ...orderData, id, updatedAt: new Date().toISOString() }));
    const allItems = await SupplierOrderItemEntity.list(c.env);
    const oldItems = allItems.items.filter(item => item.supplierOrderId === id);
    await SupplierOrderItemEntity.deleteMany(c.env, oldItems.map(item => item.id));
    const newOrderItems: SupplierOrderItem[] = [];
    for (const item of itemsData) {
      const newOrderItem: SupplierOrderItem = { ...SupplierOrderItemEntity.initialState, ...item, id: crypto.randomUUID(), supplierOrderId: id };
      await SupplierOrderItemEntity.create(c.env, newOrderItem);
      newOrderItems.push(newOrderItem);
    }
    return ok(c, { order: updatedOrder, items: newOrderItems });
  });
  app.delete('/api/supplier-orders/:id', async (c) => {
    const { id } = c.req.param();
    const allItems = await SupplierOrderItemEntity.list(c.env);
    const oldItems = allItems.items.filter(item => item.supplierOrderId === id);
    await SupplierOrderItemEntity.deleteMany(c.env, oldItems.map(item => item.id));
    const deleted = await SupplierOrderEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // FINANCIALS API
  app.get('/api/transactions', async (c) => ok(c, await TransactionEntity.list(c.env)));
  app.post('/api/transactions', async (c) => {
    const body = await c.req.json<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>();
    const newTransaction: Transaction = { ...TransactionEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return ok(c, await TransactionEntity.create(c.env, newTransaction));
  });
  app.put('/api/transactions/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Transaction>>();
    const entity = new TransactionEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Transaction not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString() }));
    return ok(c, updated);
  });
  app.delete('/api/transactions/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await TransactionEntity.delete(c.env, id) });
  });
  app.get('/api/transaction-categories', async (c) => ok(c, await TransactionCategoryEntity.list(c.env)));
  // SALES API
  app.get('/api/sales', async (c) => ok(c, await SaleEntity.list(c.env)));
  app.get('/api/sales/:id/items', async (c) => {
    const { id } = c.req.param();
    const allItems = await SaleItemEntity.list(c.env);
    const saleItems = allItems.items.filter(item => item.saleId === id);
    return ok(c, { items: saleItems, next: null });
  });
  app.post('/api/sales', async (c) => {
    const { saleData, itemsData } = await c.req.json<{ saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>, itemsData: Omit<SaleItem, 'id' | 'saleId'>[] }>();
    const newSale: Sale = { ...SaleEntity.initialState, ...saleData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const createdSale = await SaleEntity.create(c.env, newSale);
    const saleItems: SaleItem[] = [];
    for (const item of itemsData) {
        const newSaleItem: SaleItem = { ...SaleItemEntity.initialState, ...item, id: crypto.randomUUID(), saleId: newSale.id };
        await SaleItemEntity.create(c.env, newSaleItem);
        saleItems.push(newSaleItem);
    }
    return ok(c, { sale: createdSale, items: saleItems });
  });
  app.put('/api/sales/:id', async (c) => {
    const { id } = c.req.param();
    const { saleData, itemsData } = await c.req.json<{ saleData: Partial<Sale>, itemsData: Partial<SaleItem>[] }>();
    const saleEntity = new SaleEntity(c.env, id);
    if (!await saleEntity.exists()) return notFound(c, 'Sale not found');
    const updatedSale = await saleEntity.mutate(current => ({ ...current, ...saleData, id, updatedAt: new Date().toISOString() }));
    const allItems = await SaleItemEntity.list(c.env);
    const oldItems = allItems.items.filter(item => item.saleId === id);
    await SaleItemEntity.deleteMany(c.env, oldItems.map(item => item.id));
    const newSaleItems: SaleItem[] = [];
    for (const item of itemsData) {
      const newSaleItem: SaleItem = { ...SaleItemEntity.initialState, ...item, id: crypto.randomUUID(), saleId: id };
      await SaleItemEntity.create(c.env, newSaleItem);
      newSaleItems.push(newSaleItem);
    }
    return ok(c, { sale: updatedSale, items: newSaleItems });
  });
  app.delete('/api/sales/:id', async (c) => {
    const { id } = c.req.param();
    const allItems = await SaleItemEntity.list(c.env);
    const oldItems = allItems.items.filter(item => item.saleId === id);
    await SaleItemEntity.deleteMany(c.env, oldItems.map(item => item.id));
    const deleted = await SaleEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // USERS API
  app.get('/api/users', async (c) => ok(c, await UserEntity.list(c.env)));
  app.post('/api/users', async (c) => {
    const body = await c.req.json<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>();
    const newUser: User = { ...UserEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return ok(c, await UserEntity.create(c.env, newUser));
  });
  app.put('/api/users/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<User>>();
    const entity = new UserEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'User not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString() }));
    return ok(c, updated);
  });
  app.delete('/api/users/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await UserEntity.delete(c.env, id) });
  });
  // ROLES API
  app.get('/api/roles', async (c) => ok(c, await RoleEntity.list(c.env)));
  app.post('/api/roles', async (c) => {
    const body = await c.req.json<Omit<Role, 'id' | 'createdAt' | 'updatedAt'>>();
    const newRole: Role = { ...RoleEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return ok(c, await RoleEntity.create(c.env, newRole));
  });
  app.put('/api/roles/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Role>>();
    const entity = new RoleEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Role not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString() }));
    return ok(c, updated);
  });
  app.delete('/api/roles/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await RoleEntity.delete(c.env, id) });
  });
  // PERMISSIONS API
  app.get('/api/permissions', async (c) => ok(c, await PermissionEntity.list(c.env)));
  app.post('/api/permissions', async (c) => {
    const body = await c.req.json<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>();
    const newPermission: Permission = { ...PermissionEntity.initialState, ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return ok(c, await PermissionEntity.create(c.env, newPermission));
  });
  app.put('/api/permissions/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<Partial<Permission>>();
    const entity = new PermissionEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Permission not found');
    const updated = await entity.mutate(current => ({ ...current, ...body, id, updatedAt: new Date().toISOString() }));
    return ok(c, updated);
  });
  app.delete('/api/permissions/:id', async (c) => {
    const { id } = c.req.param();
    return ok(c, { id, deleted: await PermissionEntity.delete(c.env, id) });
  });
}