import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  created_at: string;
  age_verified: boolean;
  last_visit: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  cocktail_id: string;
  cocktail_name: string;
  cocktail_image: string;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  progress: number;
  unlocked_at: string | null;
}

export interface Challenge {
  id: string;
  user_id: string;
  cocktail_id: string;
  cocktail_name: string;
  status: 'accepted' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
}

export interface ApiCache {
  id: string;
  endpoint: string;
  params: string;
  response: any;
  cached_at: string;
}

export interface Translation {
  id: string;
  original_text: string;
  translated_text: string;
  created_at: string;
}

const USER_ID_KEY = 'mixologia_user_id';

export async function getCurrentUserId(): Promise<string> {
  let userId = sessionStorage.getItem(USER_ID_KEY);

  if (userId) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      return userId;
    }
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ age_verified: false })
    .select()
    .single();

  if (error) throw error;

  userId = data.id;
  sessionStorage.setItem(USER_ID_KEY, userId);

  return userId;
}

export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserAgeVerification(userId: string, verified: boolean): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ age_verified: verified, last_visit: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}

export async function updateUserLastVisit(userId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ last_visit: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}

export async function getFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addFavorite(
  userId: string,
  cocktailId: string,
  cocktailName: string,
  cocktailImage: string
): Promise<Favorite> {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('cocktail_id', cocktailId)
    .maybeSingle();

  if (existing) {
    throw new Error('Already favorited');
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      cocktail_id: cocktailId,
      cocktail_name: cocktailName,
      cocktail_image: cocktailImage
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);

  if (error) throw error;
}

export async function removeFavoriteByCocktailId(userId: string, cocktailId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('cocktail_id', cocktailId);

  if (error) throw error;
}

export async function isFavorite(userId: string, cocktailId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('cocktail_id', cocktailId)
    .maybeSingle();

  return !!data;
}

export async function getBadges(userId: string): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

export async function initializeBadges(userId: string): Promise<void> {
  const badgeTypes = [
    'premiere_gorgee',
    'apprenti_barman',
    'maitre_mixologue',
    'aventurier_hasard',
    'collectionneur'
  ];

  for (const badgeType of badgeTypes) {
    const { data: existing } = await supabase
      .from('badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .maybeSingle();

    if (!existing) {
      await supabase
        .from('badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          progress: 0
        });
    }
  }
}

export async function updateBadgeProgress(
  userId: string,
  badgeType: string,
  progress: number
): Promise<Badge> {
  const { data, error } = await supabase
    .from('badges')
    .update({ progress })
    .eq('user_id', userId)
    .eq('badge_type', badgeType)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlockBadge(userId: string, badgeType: string): Promise<Badge> {
  const { data, error } = await supabase
    .from('badges')
    .update({ unlocked_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('badge_type', badgeType)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveChallenge(userId: string): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createChallenge(
  userId: string,
  cocktailId: string,
  cocktailName: string
): Promise<Challenge> {
  const { data, error } = await supabase
    .from('challenges')
    .insert({
      user_id: userId,
      cocktail_id: cocktailId,
      cocktail_name: cocktailName,
      status: 'accepted'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChallengeStatus(
  challengeId: string,
  status: 'completed' | 'failed'
): Promise<Challenge> {
  const { data, error } = await supabase
    .from('challenges')
    .update({
      status,
      completed_at: new Date().toISOString()
    })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCachedApiResponse(endpoint: string, params: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('api_cache')
    .select('*')
    .eq('endpoint', endpoint)
    .eq('params', params)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  const cachedAt = new Date(data.cached_at);
  const now = new Date();
  const thirtyMinutes = 30 * 60 * 1000;

  if (now.getTime() - cachedAt.getTime() > thirtyMinutes) {
    return null;
  }

  return data.response;
}

export async function cacheApiResponse(
  endpoint: string,
  params: string,
  response: any
): Promise<void> {
  const { error } = await supabase
    .from('api_cache')
    .upsert({
      endpoint,
      params,
      response,
      cached_at: new Date().toISOString()
    }, {
      onConflict: 'endpoint,params'
    });

  if (error) throw error;
}

export async function getTranslation(originalText: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('original_text', originalText)
    .maybeSingle();

  if (error) throw error;
  return data?.translated_text || null;
}

export async function saveTranslation(originalText: string, translatedText: string): Promise<void> {
  const { error } = await supabase
    .from('translations')
    .upsert({
      original_text: originalText,
      translated_text: translatedText
    }, {
      onConflict: 'original_text'
    });

  if (error) throw error;
}
