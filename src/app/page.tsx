import Header from '@/components/layout/header';
import OcrProcessor from '@/components/sections/ocr-processor';
import AddressManager from '@/components/sections/address-manager';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 space-y-10">
        <OcrProcessor />
        <AddressManager />
      </main>
      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Zilmatik. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
