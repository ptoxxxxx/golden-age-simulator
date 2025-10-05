import { supabase } from "@/integrations/supabase/client";

/**
 * Determines mood based on player's overall wellbeing
 * Calculated from health, career, education_level, entertainment, and relationships
 */
export const getMoodFromStats = (
  health: number, 
  career: number,
  education_level: number,
  entertainment: number,
  relationships: number
): string => {
  const avg = (health + career + education_level + entertainment + relationships) / 5;
  
  if (avg >= 70) return "happy";
  if (avg >= 40) return "neutral";
  return "sad";
};

/**
 * Maps player age to age group used in avatar variations
 */
export const getAgeGroup = (age: number): number => {
  if (age < 25) return 20;
  if (age < 35) return 30;
  if (age < 50) return 40;
  if (age < 70) return 60;
  return 80;
};

/**
 * Fetches the most appropriate avatar for the player's current state
 * Falls back to base avatar or null if no variations exist
 */
export const getAvatarForState = async (
  userId: string,
  age: number,
  health: number,
  career: number,
  education_level: number,
  entertainment: number,
  relationships: number
): Promise<string | null> => {
  const ageGroup = getAgeGroup(age);
  const mood = getMoodFromStats(health, career, education_level, entertainment, relationships);

  // Try to find exact match
  const { data: exactMatch } = await supabase
    .from("user_avatars")
    .select("avatar_url")
    .eq("user_id", userId)
    .eq("age_group", ageGroup)
    .eq("mood", mood)
    .maybeSingle();

  if (exactMatch?.avatar_url) return exactMatch.avatar_url;

  // Fallback to same age, any mood
  const { data: sameAge } = await supabase
    .from("user_avatars")
    .select("avatar_url")
    .eq("user_id", userId)
    .eq("age_group", ageGroup)
    .not("mood", "is", null)
    .limit(1)
    .maybeSingle();

  if (sameAge?.avatar_url) return sameAge.avatar_url;

  // Fallback to base avatar (no age_group, no mood)
  const { data: baseAvatar } = await supabase
    .from("user_avatars")
    .select("avatar_url")
    .eq("user_id", userId)
    .is("age_group", null)
    .is("mood", null)
    .maybeSingle();

  if (baseAvatar?.avatar_url) return baseAvatar.avatar_url;

  // Last resort: get any avatar for this user
  const { data: anyAvatar } = await supabase
    .from("user_avatars")
    .select("avatar_url")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  return anyAvatar?.avatar_url || null;
};
