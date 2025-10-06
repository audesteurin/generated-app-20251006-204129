import { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PlusCircle, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { api } from '@/lib/api-client';
import type { Transaction, TransactionCategory, PaginatedResponse } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TransactionForm } from './TransactionForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
export function FinancialsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const categoryMap = useMemo(() => {
    return new Map(categories.map(c => [c.id, c.name]));
  }, [categories]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [transData, catData] = await Promise.all([
        api<PaginatedResponse<Transaction>>('/api/transactions'),
        api<PaginatedResponse<TransactionCategory>>('/api/transaction-categories'),
      ]);
      setTransactions(transData.items);
      setCategories(catData.items);
    } catch (error) {
      toast.error('Erreur lors de la récupération des donn��es financières.');
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleFormSuccess = () => {
    fetchData();
  };
  const handleDelete = async () => {
    if (!selectedTransaction) return;
    try {
      await api(`/api/transactions/${selectedTransaction.id}`, { method: 'DELETE' });
      toast.success('Transaction supprimée avec succès!');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la transaction.');
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedTransaction(undefined);
    }
  };
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString(),
    },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'categoryId',
      header: 'Catégorie',
      cell: ({ row }) => categoryMap.get(row.getValue('categoryId')) || '-',
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Montant</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const type = row.original.type;
        const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
        return (
          <div className={cn("text-right font-medium", type === 'revenue' ? 'text-green-600' : 'text-red-600')}>
            {type === 'revenue' ? '+' : '-'} {formatted}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setSelectedTransaction(transaction); setIsFormOpen(true); }}>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedTransaction(transaction); setConfirmDeleteDialogOpen(true); }}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Finances</h1>
        <Button onClick={() => { setSelectedTransaction(undefined); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Transaction
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
            <span className="h-4 w-4 text-muted-foreground font-bold">€</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRevenue - totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable columns={columns} data={transactions} />
      )}
      <TransactionForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        categories={categories}
        transaction={selectedTransaction}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer la transaction"
        description="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      />
    </div>
  );
}