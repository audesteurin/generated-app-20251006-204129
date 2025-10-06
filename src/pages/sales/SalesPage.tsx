import { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/DataTable';
import { api } from '@/lib/api-client';
import type { Sale, Client, Product, PaginatedResponse } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SaleForm } from './SaleForm';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
const statusVariantMap: { [key in Sale['status']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  pending: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
  refunded: 'outline',
};
export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);
  const clientMap = useMemo(() => {
    return new Map(clients.map(c => [c.id, `${c.firstName} ${c.lastName}`]));
  }, [clients]);
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [salesData, clientsData, productsData] = await Promise.all([
        api<PaginatedResponse<Sale>>('/api/sales'),
        api<PaginatedResponse<Client>>('/api/clients'),
        api<PaginatedResponse<Product>>('/api/products'),
      ]);
      setSales(salesData.items);
      setClients(clientsData.items);
      setProducts(productsData.items);
    } catch (error) {
      toast.error('Erreur lors de la récupération des données de ventes.');
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesData();
  }, []);
  const handleFormSuccess = () => {
    fetchSalesData();
  };
  const handleDelete = async () => {
    if (!selectedSale) return;
    try {
      await api(`/api/sales/${selectedSale.id}`, { method: 'DELETE' });
      toast.success('Vente supprimée avec succès!');
      fetchSalesData();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la vente.');
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedSale(undefined);
    }
  };
  const columns: ColumnDef<Sale>[] = [
    { accessorKey: 'saleNumber', header: 'Numéro' },
    {
      accessorKey: 'clientId',
      header: 'Client',
      cell: ({ row }) => clientMap.get(row.getValue('clientId')) || row.getValue('clientId'),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as Sale['status'];
        return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'totalAmount',
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalAmount'));
        const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const sale = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedSale(sale); setIsFormOpen(true); }}>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedSale(sale); setConfirmDeleteDialogOpen(true); }}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ventes</h1>
        <Button onClick={() => { setSelectedSale(undefined); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle vente
        </Button>
      </div>
      <DataTable columns={columns} data={sales} />
      <SaleForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        clients={clients}
        products={products}
        sale={selectedSale}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer la vente"
        description="Êtes-vous sûr de vouloir supprimer cette vente ? Cette action est irréversible."
      />
    </div>
  );
}