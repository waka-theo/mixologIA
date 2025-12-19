/*
  # MixologIA Database Schema
  
  Creates all tables needed for the MixologIA cocktail discovery app.
  
  ## Tables Created
  
  1. **users** - Stores anonymous user data
     - `id` (uuid, primary key) - Unique user identifier
     - `created_at` (timestamptz) - Account creation timestamp
     - `age_verified` (boolean) - Whether user has verified they are 18+
     - `last_visit` (timestamptz) - Last time user accessed the app
  
  2. **favorites** - Stores user's favorite cocktails
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key → users)
     - `cocktail_id` (text) - External API cocktail ID
     - `cocktail_name` (text) - Cocktail name for display
     - `cocktail_image` (text) - URL to cocktail image
     - `created_at` (timestamptz) - When favorite was added
  
  3. **badges** - Tracks user achievement progress
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key → users)
     - `badge_type` (text) - Badge identifier (premiere_gorgee, apprenti_barman, etc.)
     - `progress` (integer) - Current progress toward unlock
     - `unlocked_at` (timestamptz, nullable) - When badge was unlocked
  
  4. **challenges** - Stores 5-minute cocktail challenges
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key → users)
     - `cocktail_id` (text) - Challenge cocktail ID
     - `cocktail_name` (text) - Cocktail name
     - `status` (text) - Challenge status: accepted, completed, failed
     - `started_at` (timestamptz) - Challenge start time
     - `completed_at` (timestamptz, nullable) - When challenge was completed/failed
  
  5. **api_cache** - Caches external API responses
     - `id` (uuid, primary key)
     - `endpoint` (text) - API endpoint called
     - `params` (text) - Query parameters used
     - `response` (jsonb) - Cached API response
     - `cached_at` (timestamptz) - Cache timestamp for TTL checking
  
  6. **translations** - Stores French translations
     - `id` (uuid, primary key)
     - `original_text` (text, unique) - English source text
     - `translated_text` (text) - French translation
     - `created_at` (timestamptz) - Translation creation time
  
  ## Security
  
  All tables have RLS enabled with policies allowing anonymous access.
  This app uses anonymous users identified by UUIDs stored in sessionStorage.
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  age_verified boolean DEFAULT false,
  last_visit timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to users"
  ON users FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cocktail_id text NOT NULL,
  cocktail_name text NOT NULL,
  cocktail_image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_cocktail_id ON favorites(cocktail_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to favorites"
  ON favorites FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  progress integer DEFAULT 0,
  unlocked_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_badges_user_badge ON badges(user_id, badge_type);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to badges"
  ON badges FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cocktail_id text NOT NULL,
  cocktail_name text NOT NULL,
  status text NOT NULL DEFAULT 'accepted',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to challenges"
  ON challenges FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create api_cache table
CREATE TABLE IF NOT EXISTS api_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  params text NOT NULL,
  response jsonb NOT NULL,
  cached_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_api_cache_endpoint_params ON api_cache(endpoint, params);

ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to api_cache"
  ON api_cache FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text text UNIQUE NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_translations_original ON translations(original_text);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to translations"
  ON translations FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);