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
    const { activities, projects } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const projectList = projects.map((p: any) => p.name).join(', ');
    const activityList = activities.map((a: any) => 
      `${a.id}: ${a.appName} - ${a.windowTitle}`
    ).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        max_completion_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'You analyze activities and suggest which project they belong to. Return JSON array with: activityId, suggestedProject (exact match from list), confidence (0-100), activityName.'
          },
          {
            role: 'user',
            content: `Projects: ${projectList}\n\nUntagged Activities:\n${activityList}\n\nReturn JSON only: [{"activityId": "string", "suggestedProject": "string", "confidence": number, "activityName": "string"}]`
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
    const suggestionsText = data.choices[0].message.content.trim();
    
    // Parse JSON response
    const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in suggest-projects function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
