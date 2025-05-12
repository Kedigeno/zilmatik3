"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ScanLine, Copy, AlertCircle, CheckCircle } from "lucide-react";
import { extractAddressInfo, type ExtractAddressInfoOutput } from "@/ai/flows/extract-address-info";
import { useToast } from "@/hooks/use-toast";
import type { OcrData } from '@/lib/types';

export default function OcrProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setOcrResult(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
      };
      reader.onerror = () => {
        setError("Dosya okunurken bir hata oluştu.");
        toast({
          title: "Hata",
          description: "Dosya okunurken bir hata oluştu.",
          variant: "destructive",
        });
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!photoDataUri) {
      setError("Lütfen bir resim dosyası seçin.");
      toast({
        title: "Uyarı",
        description: "Lütfen bir resim dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setOcrResult(null);

    try {
      const result: ExtractAddressInfoOutput = await extractAddressInfo({ photoDataUri });
      setOcrResult(result);
      toast({
        title: "Başarılı",
        description: "Adres bilgileri başarıyla çıkarıldı.",
        className: "bg-green-500 dark:bg-green-700 text-white", // Custom success toast
      });
    } catch (err) {
      console.error("OCR Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      setError(`Adres çıkarılırken hata: ${errorMessage}`);
      toast({
        title: "Hata",
        description: `Adres çıkarılırken hata: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
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
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <ScanLine className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-semibold">Optik Karakter Tanıma (OCR)</CardTitle>
        </div>
        <CardDescription>Notlardan, makbuzlardan veya diğer resim dosyalarından adres ve giriş kodlarını çıkarın.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-base">Resim Dosyası Yükle</Label>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-semibold" />
          </div>
          {photoDataUri && selectedFile && (
            <div className="border p-4 rounded-md bg-muted/50">
              <p className="text-sm font-medium">Seçilen Dosya: {selectedFile.name}</p>
              <img src={photoDataUri} alt="Yüklenen önizleme" className="mt-2 max-h-48 w-auto rounded-md object-contain" data-ai-hint="document receipt"/>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !selectedFile} className="w-full md:w-auto text-base">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Çıkarılıyor...
              </>
            ) : (
              "Adresi Çıkar"
            )}
          </Button>
        </CardFooter>
      </form>
      {ocrResult && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-3 text-primary">Çıkarılan Bilgiler</h3>
          <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
             <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-700 dark:text-green-300">Başarılı!</AlertTitle>
            <AlertDescription className="space-y-2 text-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="block">Adres:</strong>
                  <span>{ocrResult.address || "Bulunamadı"}</span>
                </div>
                {ocrResult.address && <Button variant="ghost" size="sm" onClick={() => copyToClipboard(ocrResult.address, 'Adres')}><Copy className="h-4 w-4 mr-1" /> Kopyala</Button>}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <strong className="block">Giriş Kodu:</strong>
                  <span>{ocrResult.entryCode || "Bulunamadı"}</span>
                </div>
                {ocrResult.entryCode && <Button variant="ghost" size="sm" onClick={() => copyToClipboard(ocrResult.entryCode, 'Giriş Kodu')}><Copy className="h-4 w-4 mr-1" /> Kopyala</Button>}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
