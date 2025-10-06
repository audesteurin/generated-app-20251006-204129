import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Client, Product, Sale, SaleItem, PaginatedResponse } from '@shared/types';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const saleItemSchema = z.object({
  id: z.string().optional(), // Keep track of existing items
  productId: z.string().min(1, "Produit requis"),
  quantity: z.coerce.number().min(1, "Qté > 0"),
  unitPrice: z.coerce.number(),
  totalPrice: z.coerce.number(),
});
const saleSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']),
  paymentMethod: z.string().min(1, "Méthode de paiement requise"),
  items: z.array(saleItemSchema).min(1, "Au moins un article est requis"),
});
type SaleFormValues = z.infer<typeof saleSchema>;
interface SaleFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  clients: Client[];
  products: Product[];
  sale?: Sale;
}
export function SaleForm({ isOpen, onOpenChange, onSuccess, clients, products, sale }: SaleFormProps) {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: '',
      status: 'pending',
      paymentMethod: 'Credit Card',
      items: [],
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);
  const items = form.watch('items');
  const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  useEffect(() => {
    const fetchSaleItems = async (saleId: string) => {
      try {
        const saleItems = await api<PaginatedResponse<SaleItem>>(`/api/sales/${saleId}/items`);
        replace(saleItems.items);
      } catch (error) {
        toast.error("Erreur lors de la récupération des articles de la vente.");
      }
    };
    if (isOpen) {
      if (sale) {
        form.reset({
          clientId: sale.clientId,
          status: sale.status,
          paymentMethod: sale.paymentMethod,
          items: [], // Will be populated by fetch
        });
        fetchSaleItems(sale.id);
      } else {
        form.reset({
          clientId: '',
          status: 'pending',
          paymentMethod: 'Credit Card',
          items: [],
        });
      }
    }
  }, [isOpen, sale, form, replace]);
  const onSubmit = async (data: SaleFormValues) => {
    const saleData = {
      ...data,
      saleNumber: sale?.saleNumber || `VTE-${Date.now()}`,
      userId: 'user-1', // Mock user
      date: new Date().toISOString(),
      totalAmount,
    };
    const { items, ...restOfSaleData } = saleData;
    try {
      if (sale) {
        await api(`/api/sales/${sale.id}`, {
          method: 'PUT',
          body: JSON.stringify({ saleData: restOfSaleData, itemsData: items }),
        });
        toast.success('Vente mise à jour avec succès!');
      } else {
        await api('/api/sales', {
          method: 'POST',
          body: JSON.stringify({ saleData: restOfSaleData, itemsData: items }),
        });
        toast.success('Vente créée avec succès!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erreur lors de la ${sale ? 'mise à jour' : 'création'} de la vente.`);
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{sale ? 'Modifier la vente' : 'Créer une nouvelle vente'}</DialogTitle>
          <DialogDescription>Sélectionnez un client et ajoutez des produits à la vente.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="clientId" render={({ field }) => (
                <FormItem><FormLabel>Client</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger></FormControl><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Statut</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="pending">En attente</SelectItem><SelectItem value="completed">Complétée</SelectItem><SelectItem value="cancelled">Annulée</SelectItem><SelectItem value="refunded">Remboursée</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem><FormLabel>Paiement</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Credit Card">Carte de crédit</SelectItem><SelectItem value="PayPal">PayPal</SelectItem><SelectItem value="Bank Transfer">Virement</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Articles</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead className="w-[100px]">Qté</TableHead><TableHead className="w-[120px]">P.U.</TableHead><TableHead className="w-[120px]">Total</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Controller control={form.control} name={`items.${index}.productId`} render={({ field: controllerField }) => (
                              <Select onValueChange={(value) => {
                                const product = productMap.get(value);
                                if (product) {
                                  form.setValue(`items.${index}.unitPrice`, product.priceSale);
                                  const qty = form.getValues(`items.${index}.quantity`);
                                  form.setValue(`items.${index}.totalPrice`, product.priceSale * qty);
                                }
                                controllerField.onChange(value);
                              }} value={controllerField.value}>
                                <SelectTrigger><SelectValue placeholder="Produit..." /></SelectTrigger>
                                <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                              </Select>
                            )} />
                          </TableCell>
                          <TableCell>
                            <Controller control={form.control} name={`items.${index}.quantity`} render={({ field: controllerField }) => (
                              <Input type="number" {...controllerField} onChange={(e) => {
                                const qty = parseInt(e.target.value, 10) || 0;
                                const unitPrice = form.getValues(`items.${index}.unitPrice`) || 0;
                                form.setValue(`items.${index}.totalPrice`, unitPrice * qty);
                                controllerField.onChange(qty);
                              }} />
                            )} />
                          </TableCell>
                          <TableCell>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(items[index]?.unitPrice || 0)}</TableCell>
                          <TableCell>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(items[index]?.totalPrice || 0)}</TableCell>
                          <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ productId: '', quantity: 1, unitPrice: 0, totalPrice: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un article
              </Button>
              {form.formState.errors.items && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.message || form.formState.errors.items.root?.message}</p>}
            </div>
            <div className="flex justify-end items-center gap-4 pt-4 border-t">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}</span>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Enregistrer la vente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}