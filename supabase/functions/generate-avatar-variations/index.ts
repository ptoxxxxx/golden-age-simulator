import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AGE_GROUPS = [20, 30, 40, 60, 80];
const MOODS = ['neutral', 'sad', 'happy'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { avatarUrl, userAge, userId } = await req.json();
    console.log('Generating avatar variations for user:', userId, 'age:', userAge);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Filter age groups >= user's current age
    const relevantAgeGroups = AGE_GROUPS.filter(age => age >= userAge);
    console.log('Generating for age groups:', relevantAgeGroups);

    // Background task to generate all variations
    const generateAllVariations = async () => {
      const variations = [];

      for (const ageGroup of relevantAgeGroups) {
        for (const mood of MOODS) {
          console.log(`Generating avatar for age ${ageGroup}, mood ${mood}`);

          // CRITICAL: Keep the EXACT same person, only change age and facial expression
          const prompt = `IMPORTANT: This must be the EXACT SAME PERSON, keep their unique identity perfectly.
Age this person to ${ageGroup} years old with a ${mood} facial expression.

PRESERVE COMPLETELY:
- The exact same face structure and features
- Same ethnicity and skin tone
- Same gender
- Same hair color (adjusted for age)
- Same eye color and shape
- Same nose, mouth, and face shape
- Same person's unique characteristics

ONLY CHANGE:
- Age appearance (wrinkles, skin texture appropriate for age ${ageGroup})
- Facial expression: ${mood === 'happy' ? 'subtle natural smile, warm friendly eyes' : mood === 'sad' ? 'contemplative look, slightly downturned mouth, pensive eyes' : 'calm neutral expression, relaxed face'}
- Age-appropriate details (grey hair if older, etc.)

Photorealistic, professional portrait, natural lighting, same background style.`;

          try {
            // Call Lovable AI to edit the image
            const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash-image-preview',
                messages: [
                  {
                    role: 'user',
                    content: [
                      { type: 'text', text: prompt },
                      { type: 'image_url', image_url: { url: avatarUrl } }
                    ]
                  }
                ],
                modalities: ['image', 'text']
              })
            });

            if (!aiResponse.ok) {
              console.error(`AI API error for age ${ageGroup}, mood ${mood}:`, await aiResponse.text());
              continue;
            }

            const aiData = await aiResponse.json();
            const generatedImageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

            if (!generatedImageBase64) {
              console.error('No image generated');
              continue;
            }

            // Extract base64 data
            const base64Data = generatedImageBase64.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

            // Upload to Supabase Storage
            const filename = `${userId}/age_${ageGroup}_${mood}_${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filename, imageBuffer, {
                contentType: 'image/png',
                upsert: false
              });

            if (uploadError) {
              console.error(`Upload error for age ${ageGroup}, mood ${mood}:`, uploadError);
              continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filename);

            // Save to database
            const { error: dbError } = await supabase
              .from('user_avatars')
              .insert({
                user_id: userId,
                avatar_url: publicUrl,
                age_group: ageGroup,
                mood: mood,
              });

            if (dbError) {
              console.error(`Database error for age ${ageGroup}, mood ${mood}:`, dbError);
              continue;
            }

            variations.push({
              age_group: ageGroup,
              mood: mood,
              avatar_url: publicUrl
            });

            console.log(`✓ Generated avatar for age ${ageGroup}, mood ${mood}`);
          } catch (error) {
            console.error(`Error generating variation for age ${ageGroup}, mood ${mood}:`, error);
          }
        }
      }

      console.log(`✓ Completed: Generated ${variations.length} avatar variations`);
      return variations;
    };

    // Start background task and return immediately
    // @ts-ignore - EdgeRuntime is available in Deno Deploy
    EdgeRuntime.waitUntil(generateAllVariations());

    console.log('Avatar generation started in background');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Avatar generation started in background',
        expected_count: relevantAgeGroups.length * MOODS.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-avatar-variations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
