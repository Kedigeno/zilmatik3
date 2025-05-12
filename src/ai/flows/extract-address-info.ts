'use server';

/**
 * @fileOverview Extracts address and entry code information from an image using OCR.
 *
 * - extractAddressInfo - A function that handles the address information extraction process.
 * - ExtractAddressInfoInput - The input type for the extractAddressInfo function.
 * - ExtractAddressInfoOutput - The return type for the extractAddressInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractAddressInfoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document (like a receipt or a handwritten note) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractAddressInfoInput = z.infer<typeof ExtractAddressInfoInputSchema>;

const ExtractAddressInfoOutputSchema = z.object({
  address: z.string().describe('The extracted address from the image.'),
  entryCode: z.string().describe('The extracted entry code from the image, if available.'),
});
export type ExtractAddressInfoOutput = z.infer<typeof ExtractAddressInfoOutputSchema>;

export async function extractAddressInfo(input: ExtractAddressInfoInput): Promise<ExtractAddressInfoOutput> {
  return extractAddressInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractAddressInfoPrompt',
  input: {schema: ExtractAddressInfoInputSchema},
  output: {schema: ExtractAddressInfoOutputSchema},
  prompt: `You are an expert OCR reader, tasked with extracting address and entry code information from images of documents.

  Analyze the image and extract the address and any entry codes (like building codes, access codes, etc.) present.

  Image: {{media url=photoDataUri}}
  `,
});

const extractAddressInfoFlow = ai.defineFlow(
  {
    name: 'extractAddressInfoFlow',
    inputSchema: ExtractAddressInfoInputSchema,
    outputSchema: ExtractAddressInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
