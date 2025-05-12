"use client";

import { useState } from 'react';
import type { Address } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Navigation, Edit3, Trash2, Copy, Building, KeyRound, DoorOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddressForm from './address-form';

interface AddressCardProps {
  address: Address;
  onUpdate: (updatedAddress: Address) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, onUpdate, onDelete }: AddressCardProps) {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleNavigation = () => {
    const query = address.fullAddress || address.buildingName;
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`, '_blank');
  };

  const copyToClipboard = (text: string | undefined, fieldName: string) => {
    if (!text) {
      toast({ title: "Bilgi Yok", description: `${fieldName} için kopyalanacak değer bulunamadı.`, variant: "destructive"});
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Kopyalandı",
        description: `${fieldName} panoya kopyalandı.`,
      });
    }).catch(err => {
      toast({
        title: "Hata",
        description: "Panoya kopyalanamadı.",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="flex flex-col justify-between h-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex items-center space-x-3">
          <Building className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold truncate" title={address.buildingName}>
            {address.buildingName}
          </CardTitle>
        </div>
        {address.fullAddress && (
          <CardDescription className="text-xs mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span className="truncate" title={address.fullAddress}>{address.fullAddress}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-sm flex-grow">
        {address.internalCode && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center">
              <KeyRound className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Dahili Kod: <strong>{address.internalCode}</strong></span>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(address.internalCode, 'Dahili Kod')}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {address.externalCode && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center">
              <DoorOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Harici Kod: <strong>{address.externalCode}</strong></span>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(address.externalCode, 'Harici Kod')}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {!address.internalCode && !address.externalCode && (
            <p className="text-muted-foreground itaic">Ek kod bilgisi bulunmamaktadır.</p>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-muted/20 border-t flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <Button onClick={handleNavigation} variant="outline" size="sm" className="w-full sm:w-auto">
          <Navigation className="mr-2 h-4 w-4" />
          Haritada Aç
        </Button>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Edit3 className="mr-2 h-4 w-4" /> Düzenle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adresi Düzenle</DialogTitle>
                <DialogDescription>
                  "{address.buildingName}" adres bilgilerini güncelleyin.
                </DialogDescription>
              </DialogHeader>
              <AddressForm 
                initialData={address} 
                onUpdateAddress={onUpdate}
                addressIdToUpdate={address.id}
                onClose={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                <Trash2 className="mr-2 h-4 w-4" /> Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{address.buildingName}" adresini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(address.id)} className="bg-destructive hover:bg-destructive/90">
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
