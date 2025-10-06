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
import type { Transaction, TransactionCategory } from '@shared/types';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
const transactionSchema = z.object({
  description: z.string().min(2, 'La description est requise'),
  amount: z.coerce.number({ invalid_type_error: 'Doit être un nombre' }).positive('Le montant doit être positif'),
  type: z.enum(['revenue', 'expense']),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  status: z.enum(['pending', 'completed', 'failed']),
  date: z.string().min(1, 'La date est requise'),
});
type TransactionFormValues = z.infer<typeof transactionSchema>;
interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transaction?: Transaction;
  onSuccess: () => void;
  categories: TransactionCategory[];
}
export function TransactionForm({ isOpen, onOpenChange, transaction, onSuccess, categories }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? { ...transaction, date: new Date(transaction.date).toISOString().split('T')[0] } : {
      description: '',
      amount: 0,
      type: 'expense',
      categoryId: '',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
    },
  });
  const type = form.watch('type');
  useEffect(() => {
    if (isOpen) {
      form.reset(transaction ? { ...transaction, date: new Date(transaction.date).toISOString().split('T')[0] } : {
        description: '',
        amount: 0,
        type: 'expense',
        categoryId: '',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, form, isOpen]);
  const onSubmit = async (data: TransactionFormValues) => {
    try {
      if (transaction) {
        await api<Transaction>(`/api/transactions/${transaction.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Transaction mise à jour avec succès!');
      } else {
        const payload = {
          ...data,
          reference: `TRANS-${Date.now()}`,
          createdBy: 'user-1',
        };
        await api<Transaction>('/api/transactions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Transaction créée avec succès!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erreur lors de la ${transaction ? 'mise à jour' : 'création'} de la transaction.`);
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? 'Modifier la transaction' : 'Ajouter une transaction'}</DialogTitle>
          <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Montant</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="expense">Dépense</SelectItem><SelectItem value="revenue">Revenu</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>Catégorie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger></FormControl><SelectContent>{categories.filter(c => c.type === type).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem><FormLabel>Paiement</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Bank Transfer">Virement</SelectItem><SelectItem value="Credit Card">Carte</SelectItem><SelectItem value="Cash">Espèces</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Statut</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="completed">Complété</SelectItem><SelectItem value="pending">En attente</SelectItem><SelectItem value="failed">Échoué</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}