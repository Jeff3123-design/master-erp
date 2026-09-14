// Supabase Edge Function: Secure Audit Logger
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
    const { userId, userName, action, module, recordId, previousValue, newValue } = await req.json();

    const auditEntry = {
      id: `aud-${Date.now()}`,
      userId,
      userName,
      action,
      module,
      recordId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ success: true, auditEntry }), {
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
