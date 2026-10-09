import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const adminEmails = new Set(['lebea.delmon@gmail.com', 'deleelebea@gmail.com']);

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405, headers: corsHeaders });

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Sign in to use Soft WAV curation.' }, { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: authorization } } });
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return Response.json({ error: 'Sign in to use Soft WAV curation.' }, { status: 401, headers: corsHeaders });
  const isAdmin = adminEmails.has(String(auth.user.email ?? '').toLowerCase());

  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const totalContentLength = messages.reduce((total: number, message: any) => total + (typeof message?.content === 'string' ? message.content.length : 0), 0);
    if (!messages.length || messages.length > 24 || totalContentLength > 180000 || messages.some((message: any) =>
      !['system', 'user', 'assistant'].includes(message?.role) || typeof message?.content !== 'string' || message.content.length > 120000
    )) return Response.json({ error: 'Invalid curation request. The request must contain at most 180,000 characters.' }, { status: 400, headers: corsHeaders });

    if (!isAdmin) {
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (!serviceRoleKey) return Response.json({ error: 'AI usage limits are not configured.' }, { status: 503, headers: corsHeaders });
      const serviceClient = createClient(supabaseUrl, serviceRoleKey);
      const dailyLimit = Math.max(1, Number(Deno.env.get('AI_DAILY_REQUESTS_PER_USER')) || 100);
      const { data: withinLimit, error: limitError } = await serviceClient.rpc('claim_ai_request', {
        p_user_id: auth.user.id,
        p_daily_limit: dailyLimit,
      });
      if (limitError) return Response.json({ error: 'AI usage limits are temporarily unavailable.' }, { status: 503, headers: corsHeaders });
      if (!withinLimit) return Response.json({ error: `Daily AI request limit reached (${dailyLimit}). Try again tomorrow.` }, { status: 429, headers: corsHeaders });
    }

    const provider = isAdmin && ['openrouter', 'gemini'].includes(body.provider) ? body.provider : (Deno.env.get('AI_PROVIDER') || 'openrouter');
    const defaultModel = Deno.env.get('AI_MODEL') || (provider === 'gemini' ? 'gemini-1.5-flash' : 'google/gemini-3.5-flash-lite');
    const requestedModel = isAdmin && typeof body.model === 'string' ? body.model : defaultModel;
    const allowlist = new Set([defaultModel, ...(Deno.env.get('AI_ALLOWED_MODELS') || '').split(',').map((model) => model.trim()).filter(Boolean)]);
    if (!allowlist.has(requestedModel)) return Response.json({ error: 'That model is not enabled for this app.' }, { status: 403, headers: corsHeaders });
    const temperature = Math.max(0, Math.min(1, Number(body.temperature) || 0.35));

    if (provider === 'openrouter') {
      const key = Deno.env.get('OPENROUTER_API_KEY');
      if (!key) return Response.json({ error: 'The shared AI service is not configured yet.' }, { status: 503, headers: corsHeaders });
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'X-Title': 'The Soft Wave' },
        body: JSON.stringify({ model: requestedModel, messages, temperature, max_tokens: 2500 }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return Response.json({ error: data.error?.message || `AI provider returned HTTP ${response.status}.` }, { status: 502, headers: corsHeaders });
      const text = data.choices?.[0]?.message?.content;
      if (typeof text !== 'string' || !text.trim()) return Response.json({ error: 'The AI returned no text.' }, { status: 502, headers: corsHeaders });
      return Response.json({ text }, { headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
    }

    if (provider === 'gemini') {
      const key = Deno.env.get('GEMINI_API_KEY');
      if (!key) return Response.json({ error: 'The shared AI service is not configured yet.' }, { status: 503, headers: corsHeaders });
      const prompt = messages.map((message: any) => `${message.role.toUpperCase()}: ${message.content}`).join('\n\n');
      const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(requestedModel)}:generateContent`);
      url.searchParams.set('key', key);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature, maxOutputTokens: 2500 } }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return Response.json({ error: data.error?.message || `AI provider returned HTTP ${response.status}.` }, { status: 502, headers: corsHeaders });
      const text = data.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('').trim();
      if (!text) return Response.json({ error: 'The AI returned no text.' }, { status: 502, headers: corsHeaders });
      return Response.json({ text }, { headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
    }

    return Response.json({ error: 'The configured AI provider is unsupported.' }, { status: 503, headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400, headers: corsHeaders });
  }
});