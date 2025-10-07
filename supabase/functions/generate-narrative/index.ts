import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function sanitizeNarrative(text: string): string {
  // Strip noisy titles
  const noisyPatterns = [
    /New Tab/gi,
    /Sign In/gi,
    /Sign Up/gi,
    /Log In/gi,
    /Login/gi,
    /localhost(:\d+)?/gi,
    /127\.0\.0\.1(:\d+)?/gi,
    /\b(http|https):\/\/localhost/gi,
    /\b(http|https):\/\/127\.0\.0\.1/gi,
  ];

  let sanitized = text;
  noisyPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Collapse multiple whitespaces into single space
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

function truncatePreview(text: string, maxWords: number = 18): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { activityName, duration, timestamp } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        max_completion_tokens: 150,
        messages: [
          {
            role: 'system',
            content: 'You are a professional timesheet assistant. Generate clear, concise narratives for work activities. Use strong action verbs and be specific about accomplishments. Keep responses under 100 words.'
          },
          {
            role: 'user',
            content: `Generate a professional narrative for this activity:\nActivity: ${activityName}\nDuration: ${duration}\nTime: ${timestamp}\n\nDescribe what was accomplished in a clear, specific way.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const rawNarrative = data.choices[0].message.content.trim();
    
    // Sanitize the narrative
    const fullNarrative = sanitizeNarrative(rawNarrative);
    const previewNarrative = truncatePreview(fullNarrative, 18);

    return new Response(
      JSON.stringify({ 
        narrative: fullNarrative,
        preview: previewNarrative
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-narrative function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
