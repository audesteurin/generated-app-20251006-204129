import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Supplier } from '@shared/types';
import { toast } from 'sonner';
const supplierSchema = z.object({
  companyName: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  email: z.string().email("L'email est invalide"),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});
type SupplierFormValues = z.infer<typeof supplierSchema>;
interface SupplierFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  supplier?: Supplier;
  onSuccess: () => void;
}
export function SupplierForm({ isOpen, onOpenChange, supplier, onSuccess }: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier || {
      companyName: '',
      email: '',
      phone: '',
      status: 'active',
    },
  });
  useEffect(() => {
    if (supplier) {
      form.reset(supplier);
    } else {
      form.reset({
        companyName: '',
        email: '',
        phone: '',
        status: 'active',
      });
    }
  }, [supplier, form, isOpen]);
  const onSubmit = async (data: SupplierFormValues) => {
    try {
      if (supplier) {
        await api<Supplier>(`/api/suppliers/${supplier.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Fournisseur mis à jour avec succès!');
      } else {
        await api<Supplier>('/api/suppliers', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Fournisseur créé avec succès!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erreur lors de la ${supplier ? 'mise à jour' : 'création'} du fournisseur.`);
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}