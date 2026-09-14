// Supabase Edge Function: Autonomous Receipt & Invoice OCR Processor
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { documentBase64, docType } = await req.json();

    // Simulated Neural OCR parsing logic
    const extractedData = {
      vendorName: docType === 'INVOICE' ? 'Global Microchips Inc' : 'Staples Office Depot',
      totalAmount: docType === 'INVOICE' ? 14200.00 : 349.50,
      confidenceScore: 98.5,
      items: [
        { description: 'Extracted Item Line 1', amount: 200.00 },
        { description: 'Extracted Item Line 2', amount: 149.50 }
      ]
    };

    return new Response(JSON.stringify(extractedData), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
