import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/DataTable';
import { api } from '@/lib/api-client';
import type { Client, PaginatedResponse } from '@shared/types';
import { ClientForm } from './ClientForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await api<PaginatedResponse<Client>>('/api/clients');
      setClients(data.items);
    } catch (error) {
      toast.error('Erreur lors de la récupération des clients.');
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const handleFormSuccess = () => {
    fetchClients();
  };
  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      await api(`/api/clients/${selectedClient.id}`, { method: 'DELETE' });
      toast.success('Client supprimé avec succès!');
      fetchClients();
    } catch (error) {
      toast.error('Erreur lors de la suppression du client.');
      console.error(error);
    } finally {
      setConfirmDeleteDialogOpen(false);
      setSelectedClient(undefined);
    }
  };
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `${row.original.lastName} ${row.original.firstName}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'clientType',
      header: 'Type',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { setSelectedClient(client); setIsFormOpen(true); }}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => { setSelectedClient(client); setConfirmDeleteDialogOpen(true); }}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => { setSelectedClient(undefined); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un client
        </Button>
      </div>
      <DataTable columns={columns} data={clients} />
      <ClientForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        client={selectedClient}
      />
      <DeleteConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer le client"
        description="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
      />
    </div>
  );
}