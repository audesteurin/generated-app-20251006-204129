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
import type { Supplier, Product, SupplierOrder, SupplierOrderItem, PaginatedResponse } from '@shared/types';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Produit requis"),
  quantity: z.coerce.number({ invalid_type_message: 'Doit être un nombre' }).min(1, "Qté > 0"),
  unitPrice: z.coerce.number({ invalid_type_message: 'Doit être un nombre' }),
  totalPrice: z.coerce.number({ invalid_type_message: 'Doit être un nombre' }),
});
const orderSchema = z.object({
  supplierId: z.string().min(1, "Fournisseur requis"),
  status: z.enum(['draft', 'ordered', 'partially_received', 'received', 'cancelled']),
  items: z.array(orderItemSchema).min(1, "Au moins un article est requis"),
});
type OrderFormValues = z.infer<typeof orderSchema>;
interface SupplierOrderFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  suppliers: Supplier[];
  products: Product[];
  order?: SupplierOrder;
}
export function SupplierOrderForm({ isOpen, onOpenChange, onSuccess, suppliers, products, order }: SupplierOrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      supplierId: '',
      status: 'draft',
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
    const fetchOrderItems = async (orderId: string) => {
      try {
        const orderItems = await api<PaginatedResponse<SupplierOrderItem>>(`/api/supplier-orders/${orderId}/items`);
        replace(orderItems.items);
      } catch (error) {
        toast.error("Erreur lors de la récupération des articles de la commande.");
      }
    };
    if (isOpen) {
      if (order) {
        form.reset({
          supplierId: order.supplierId,
          status: order.status,
          items: [],
        });
        fetchOrderItems(order.id);
      } else {
        form.reset({
          supplierId: '',
          status: 'draft',
          items: [],
        });
      }
    }
  }, [isOpen, order, form, replace]);
  const onSubmit = async (data: OrderFormValues) => {
    const orderData = {
      ...data,
      orderNumber: order?.orderNumber || `CMD-F-${Date.now()}`,
      orderDate: new Date().toISOString(),
      totalAmount,
      createdBy: 'user-1',
    };
    const { items, ...restOfOrderData } = orderData;
    try {
      if (order) {
        await api(`/api/supplier-orders/${order.id}`, {
          method: 'PUT',
          body: JSON.stringify({ orderData: restOfOrderData, itemsData: items }),
        });
        toast.success('Commande fournisseur mise à jour avec succès!');
      } else {
        await api('/api/supplier-orders', {
          method: 'POST',
          body: JSON.stringify({ orderData: restOfOrderData, itemsData: items }),
        });
        toast.success('Commande fournisseur créée avec succès!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erreur lors de la ${order ? 'mise à jour' : 'création'} de la commande.`);
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{order ? 'Modifier la commande' : 'Créer une commande fournisseur'}</DialogTitle>
          <DialogDescription>Sélectionnez un fournisseur et ajoutez des produits.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="supplierId" render={({ field }) => (
                <FormItem><FormLabel>Fournisseur</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner un fournisseur" /></SelectTrigger></FormControl><SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.companyName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Statut</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="draft">Brouillon</SelectItem><SelectItem value="ordered">Commandé</SelectItem><SelectItem value="received">Reçu</SelectItem><SelectItem value="cancelled">Annulé</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Articles</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead className="w-[100px]">Qté</TableHead><TableHead className="w-[120px]">P.A.</TableHead><TableHead className="w-[120px]">Total</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller control={form.control} name={`items.${index}.productId`} render={({ field: controllerField }) => (
                            <Select onValueChange={(value) => {
                              const product = productMap.get(value);
                              if (product) {
                                form.setValue(`items.${index}.unitPrice`, product.pricePurchase);
                                const qty = form.getValues(`items.${index}.quantity`);
                                form.setValue(`items.${index}.totalPrice`, product.pricePurchase * qty);
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
                    ))}
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
              <Button type="submit">Enregistrer la commande</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}