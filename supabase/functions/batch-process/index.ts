import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let processed = 0;
    let failed = 0;

    for (const entry of entries) {
      try {
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
                content: 'You are a professional timesheet assistant. Generate clear, concise narratives for work activities. Use strong action verbs and be specific. Keep under 100 words.'
              },
              {
                role: 'user',
                content: `Generate a professional narrative for:\nActivity: ${entry.activityName}\nProject: ${entry.project}\nDuration: ${entry.duration}\n\nBe specific and professional.`
              }
            ],
          }),
        });

        if (response.ok) {
          processed++;
        } else {
          failed++;
          console.error(`Failed to process entry ${entry.id}`);
        }
      } catch (error) {
        failed++;
        console.error(`Error processing entry ${entry.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ processed, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in batch-process function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
