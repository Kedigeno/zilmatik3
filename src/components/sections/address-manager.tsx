"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Address } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Home, Search } from "lucide-react";
import AddressForm from '@/components/address/address-form';
import AddressList from '@/components/address/address-list';

const LOCAL_STORAGE_KEY = 'zilmatik_addresses';

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedAddresses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
    }
  }, [addresses, isClient]);


  const addAddress = (newAddress: Omit<Address, 'id'>) => {
    const addressWithId = { ...newAddress, id: crypto.randomUUID() };
    setAddresses(prev => [addressWithId, ...prev]);
  };

  const updateAddress = (updatedAddress: Address) => {
    setAddresses(prev => prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const filteredAddresses = useMemo(() => {
    if (!searchTerm) return addresses;
    return addresses.filter(addr =>
      addr.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.internalCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.externalCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.fullAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [addresses, searchTerm]);

  if (!isClient) {
    // Render a loading state or null during SSR to avoid hydration mismatch
    return (
      <Card className="w-full shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-semibold">Adres Yönetimi</CardTitle>
          </div>
          <CardDescription>Adresleri kaydedin, arayın ve yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-semibold">Adres Yönetimi</CardTitle>
        </div>
        <CardDescription>Adresleri kaydedin, arayın ve yönetin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
            <TabsTrigger value="list" className="text-base">Kayıtlı Adresler</TabsTrigger>
            <TabsTrigger value="add" className="text-base">Yeni Adres Ekle</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Adreslerde ara (Bina adı, kod...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base"
                />
              </div>
              <AddressList 
                addresses={filteredAddresses} 
                onUpdateAddress={updateAddress}
                onDeleteAddress={deleteAddress}
              />
            </div>
          </TabsContent>
          <TabsContent value="add">
            <AddressForm onAddAddress={addAddress} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
