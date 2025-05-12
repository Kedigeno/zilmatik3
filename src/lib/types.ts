export interface Address {
  id: string;
  buildingName: string;
  internalCode: string;
  externalCode: string;
  fullAddress?: string; // For navigation if OCR provides it
}

export interface OcrData {
  address: string;
  entryCode: string;
}
