import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Product } from '@shared/types';
import { toast } from 'sonner';
const productSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  reference: z.string().min(2, 'La référence est requise'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  stockQuantity: z.coerce.number({ invalid_type_error: 'Doit être un nombre' }).int().min(0, 'Le stock doit être positif'),
  priceSale: z.coerce.number({ invalid_type_error: 'Doit être un nombre' }).min(0, 'Le prix doit être positif'),
  pricePurchase: z.coerce.number({ invalid_type_error: 'Doit être un nombre' }).min(0, 'Le prix doit être positif'),
  status: z.enum(['active', 'inactive', 'archived']),
});
type ProductFormValues = z.infer<typeof productSchema>;
interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product?: Product;
  onSuccess: () => void;
}
export function ProductForm({ isOpen, onOpenChange, product, onSuccess }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      reference: '',
      categoryId: '',
      stockQuantity: 0,
      priceSale: 0,
      pricePurchase: 0,
      status: 'active',
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (product) {
        form.reset(product);
      } else {
        form.reset({
          name: '',
          reference: '',
          categoryId: '',
          stockQuantity: 0,
          priceSale: 0,
          pricePurchase: 0,
          status: 'active',
        });
      }
    }
  }, [product, form, isOpen]);
  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (product) {
        await api<Product>(`/api/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Produit mis à jour avec succès!');
      } else {
        await api<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Produit créé avec succès!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Erreur lors de la ${product ? 'mise à jour' : 'création'} du produit.`);
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour {product ? 'modifier' : 'créer'} un produit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: TSHIRT-BLK-L" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: Fetch categories dynamically */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cat-1">Électronique</SelectItem>
                      <SelectItem value="cat-2">Vêtements</SelectItem>
                      <SelectItem value="cat-3">Maison & Jardin</SelectItem>
                      <SelectItem value="cat-4">Smartphones</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceSale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de vente</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePurchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix d'achat</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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