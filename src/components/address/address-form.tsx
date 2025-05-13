
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Address } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const addressSchema = z.object({
  buildingName: z.string().min(2, "Bina adı en az 2 karakter olmalıdır.").max(100, "Bina adı en fazla 100 karakter olabilir."),
  internalCode: z.string().max(50, "Dahili kod en fazla 50 karakter olabilir.").optional().or(z.literal('')),
  externalCode: z.string().max(50, "Harici kod en fazla 50 karakter olabilir.").optional().or(z.literal('')),
  fullAddress: z.string().max(200, "Tam adres en fazla 200 karakter olabilir.").optional().or(z.literal('')),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onAddAddress: (address: Omit<Address, 'id'>) => void;
  initialData?: Partial<AddressFormData>; // For editing
  onUpdateAddress?: (address: Address) => void; // For editing
  addressIdToUpdate?: string; // For editing
  onClose?: () => void; // For closing dialog after edit
}

export default function AddressForm({ onAddAddress, initialData, onUpdateAddress, addressIdToUpdate, onClose }: AddressFormProps) {
  const { toast } = useToast();
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      buildingName: "",
      internalCode: "",
      externalCode: "",
      fullAddress: "",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const addressData = {
      buildingName: data.buildingName,
      internalCode: data.internalCode || "",
      externalCode: data.externalCode || "",
      fullAddress: data.fullAddress || "",
    };

    if (addressIdToUpdate && onUpdateAddress) {
      onUpdateAddress({ id: addressIdToUpdate, ...addressData });
      toast({
        title: "Başarılı",
        description: "Adres başarıyla güncellendi.",
        className: "bg-green-500 dark:bg-green-700 text-white",
      });
      if (onClose) onClose();
    } else {
      onAddAddress(addressData);
      toast({
        title: "Başarılı",
        description: "Yeni adres başarıyla eklendi.",
        className: "bg-green-500 dark:bg-green-700 text-white",
      });
      form.reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="buildingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Bina Adı / Konum Adı</FormLabel>
              <FormControl>
                <Input placeholder="Örn: Yıldız Apartmanı, Ofis A" {...field} className="text-base" />
              </FormControl>
              <FormDescription>Tanımlayıcı bir ad girin.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="internalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Dahili Kod (Zil Kodu)</FormLabel>
              <FormControl>
                <Input placeholder="Örn: 1234#, Daire 5" {...field} className="text-base" />
              </FormControl>
              <FormDescription>Binanın içindeki daireye veya ofise ait zil kodu.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="externalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Harici Kod (Bina Giriş Kodu)</FormLabel>
              <FormControl>
                <Input placeholder="Örn: 5678*, Kapı Şifresi" {...field} className="text-base" />
              </FormControl>
              <FormDescription>Bina ana giriş kapısı şifresi veya kodu.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="fullAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Tam Adres (Navigasyon için)</FormLabel>
              <FormControl>
                <Textarea placeholder="Örn: Cumhuriyet Mah. Atatürk Cad. No:12 D:5, Çankaya/Ankara" {...field} className="text-base min-h-[100px]" />
              </FormControl>
              <FormDescription>Google Haritalar'da navigasyon için kullanılacak tam adres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto text-base">
          <PlusCircle className="mr-2 h-5 w-5" />
          {addressIdToUpdate ? "Adresi Güncelle" : "Adresi Kaydet"}
        </Button>
      </form>
    </FormProvider>
  );
}
