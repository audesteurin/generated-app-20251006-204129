import { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/DataTable';
import { api } from '@/lib/api-client';
import type { Supplier, SupplierOrder, Product, PaginatedResponse } from '@shared/types';
import { SupplierForm } from './SupplierForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierOrderForm } from './SupplierOrderForm';
function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await api<PaginatedResponse<Supplier>>('/api/suppliers');
      setSuppliers(data.items);
    } catch (error) {
      toast.error('Erreur lors de la récupération des fournisseurs.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);
  const handleFormSuccess = () => fetchSuppliers();
  const handleDelete = async () => {
    if (!selectedSupplier) return;
    try {
      await api(`/api/suppliers/${selectedSupplier.id}`, { method: 'DELETE' });
      toast.success('Fournisseur supprimé avec succès!');
      fetchSuppliers();
    } catch (error) {
      toast.error('Erreur lors de la suppression du fournisseur.');
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedSupplier(undefined);
    }
  };
  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'companyName',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Nom de l'entreprise <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Téléphone' },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { setSelectedSupplier(supplier); setIsFormOpen(true); }}>Modifier</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedSupplier(supplier); setConfirmDeleteDialogOpen(true); }}>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (loading) return <Skeleton className="h-96 w-full" />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => { setSelectedSupplier(undefined); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un fournisseur
        </Button>
      </div>
      <DataTable columns={columns} data={suppliers} />
      <SupplierForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={handleFormSuccess} supplier={selectedSupplier} />
      <DeleteConfirmationDialog isOpen={isConfirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen} onConfirm={handleDelete} title="Supprimer le fournisseur" description="Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible." />
    </div>
  );
}
function SupplierOrdersList() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderFormOpen, setOrderFormOpen] = useState(false);
  const supplierMap = useMemo(() => {
    return new Map(suppliers.map(s => [s.id, s.companyName]));
  }, [suppliers]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, suppliersData, productsData] = await Promise.all([
        api<PaginatedResponse<SupplierOrder>>('/api/supplier-orders'),
        api<PaginatedResponse<Supplier>>('/api/suppliers'),
        api<PaginatedResponse<Product>>('/api/products')
      ]);
      setOrders(ordersData.items);
      setSuppliers(suppliersData.items);
      setProducts(productsData.items);
    } catch (error) {
      toast.error("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOrderFormSuccess = () => {
    fetchData();
  };
  const columns: ColumnDef<SupplierOrder>[] = [
    { accessorKey: 'orderNumber', header: 'Numéro' },
    {
      accessorKey: 'supplierId',
      header: 'Fournisseur',
      cell: ({ row }) => supplierMap.get(row.getValue('supplierId')) || row.getValue('supplierId'),
    },
    {
      accessorKey: 'orderDate',
      header: 'Date',
      cell: ({ row }) => new Date(row.getValue('orderDate')).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge>,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(row.getValue('totalAmount')),
    },
  ];
  if (loading) return <Skeleton className="h-96 w-full" />;
  return (
    <div className="space-y-4">
       <div className="flex items-center justify-end">
        <Button onClick={() => setOrderFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle commande
        </Button>
      </div>
      <DataTable columns={columns} data={orders} />
      <SupplierOrderForm
        isOpen={isOrderFormOpen}
        onOpenChange={setOrderFormOpen}
        onSuccess={handleOrderFormSuccess}
        suppliers={suppliers}
        products={products}
      />
    </div>
  );
}
export function SuppliersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Fournisseurs</h1>
      <Tabs defaultValue="suppliers">
        <TabsList>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes Fournisseurs</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers" className="mt-4">
          <SuppliersList />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <SupplierOrdersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}