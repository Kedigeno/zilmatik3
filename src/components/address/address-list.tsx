"use client";

import type { Address } from '@/lib/types';
import AddressCard from './address-card';
import { FileText } from 'lucide-react';

interface AddressListProps {
  addresses: Address[];
  onUpdateAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
}

export default function AddressList({ addresses, onUpdateAddress, onDeleteAddress }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-xl bg-muted/20">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium text-muted-foreground">Kayıtlı adres bulunamadı.</p>
        <p className="text-sm text-muted-foreground">"Yeni Adres Ekle" sekmesinden adreslerinizi ekleyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <AddressCard 
          key={address.id} 
          address={address} 
          onUpdate={onUpdateAddress}
          onDelete={onDeleteAddress}
        />
      ))}
    </div>
  );
}
