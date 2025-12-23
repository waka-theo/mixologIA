# MixologIA: Complete Futuristic Speakeasy-Themed Cocktail Discovery Web App

## ⚡ CRITICAL IMPLEMENTATION ORDER (follow this sequence)

### 1. FOUNDATION FIRST
- Set up Bolt Database with all tables
- Create anonymous user system (UUID in sessionStorage key: `mixologia_user_id`)
- Implement age verification gate (blocking modal on first visit)
- Build API service with caching (30min TTL) and retry logic (3 attempts, exponential backoff)

### 2. CORE FEATURES NEXT
- Home view with navigation
- Cocktail detail view with favorites
- Ingredient search (My Bar)
- Random slot machine (Shaker Slot)
- Favorites collection view

### 3. GAMIFICATION LAYER
- Badge system with progress tracking
- Challenge system with countdown timer
- Toast notifications for achievements

### 4. POLISH & UX
- French translations with caching
- Imperial to metric conversions
- Loading states and error handling
- Responsive mobile-first design

---

## 📊 DATABASE SCHEMA (Bolt Database - create all tables)

### users
- `id` (uuid, primary key)
- `created_at` (timestamp)
- `age_verified` (boolean, default false)
- `last_visit` (timestamp)

### favorites
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `cocktail_id` (text)
- `cocktail_name` (text)
- `cocktail_image` (text)
- `created_at` (timestamp)

### badges
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `badge_type` (text) -- values: `premiere_gorgee`, `apprenti_barman`, `maitre_mixologue`, `aventurier_hasard`, `collectionneur`
- `progress` (integer)
- `unlocked_at` (timestamp, nullable)

### challenges
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users)
- `cocktail_id` (text)
- `cocktail_name` (text)
- `status` (text) -- values: `accepted`, `completed`, `failed`
- `started_at` (timestamp)
- `completed_at` (timestamp, nullable)

### api_cache
- `id` (uuid, primary key)
- `endpoint` (text)
- `params` (text)
- `response` (jsonb)
- `cached_at` (timestamp)

### translations
- `id` (uuid, primary key)
- `original_text` (text, unique)
- `translated_text` (text)
- `created_at` (timestamp)

---

## 🎨 DESIGN SYSTEM

### THEME
Futuristic speakeasy with Art Deco influences

### COLORS
- **Background**: Deep black (`#0a0a0a`) with subtle grid pattern
- **Primary accent**: Electric cyan (`#00d9ff`)
- **Secondary accent**: Neon purple (`#b040ff`)
- **Gold highlights**: `#ffd700` for premium elements
- **Glass morphism**: `rgba(255,255,255,0.05)` with backdrop-blur

### TYPOGRAPHY
- **Headers**: Bold, uppercase, tracking-wide
- **Body**: Clean sans-serif, good contrast
- **Measurements**: Monospace font

### ANIMATIONS
- Smooth 300ms transitions
- Slot machine: 3-reel spin animation with easing
- Card hovers: Lift + glow effect
- Badge unlocks: Scale + sparkle animation
- Toast: Slide-in from top-right

### LAYOUT
- Mobile-first responsive (320px → 1920px)
- Fixed header with logo + user stats
- Bottom navigation bar on mobile
- Sidebar navigation on desktop (1024px+)

---

## 🏗️ APPLICATION STRUCTURE

### TECH STACK
- React 18 + TypeScript + Vite
- Tailwind CSS (custom dark theme configuration)
- Lucide React icons
- Bolt Database for ALL persistence
- External API: TheCocktailDB (`https://www.thecocktaildb.com/api/json/v1/1/`)

### GLOBAL STATE (React Context)
- `currentView` (string)
- `userId` (string | null)
- `ageVerified` (boolean)
- `selectedCocktail` (object | null)
- `favorites` (array)
- `badges` (array)
- `activeChallenge` (object | null)
- `viewedCocktails` (Set for tracking)
- `slotUsageCount` (number)
- `toasts` (array)

---

## 📱 VIEWS & FEATURES (implement all 6 views)

### 1. AGE VERIFICATION MODAL (blocking, first visit only)
- Centered modal with backdrop blur
- Question: "Avez-vous 18 ans ou plus ?"
- Two buttons: "Oui, j'ai 18 ans" (green) / "Non" (red)
- If NO: show message "Accès refusé" + close button (no app access)
- If YES: persist to database, dismiss modal, show HomeView
- Store verification status in `users.age_verified`

### 2. HOME VIEW
- Animated glowing logo (MixologIA with neon outline)
- Welcome message with user stats:
  - "X badges débloqués"
  - "X cocktails favoris"
- Two large action cards:
  - **A) "Mon Bar Virtuel"** → navigate to MyBarView
    - Icon: Flask, description: "Cherchez par ingrédients"
  - **B) "Machine à Sous"** → navigate to ShakerSlotView
    - Icon: Dices, description: "Cocktail aléatoire"
- Footer: "Découvrez, collectionnez, maîtrisez l'art du cocktail"

### 3. MY BAR VIEW (Ingredient Search)
- Search input with autocomplete (fetch from TheCocktailDB `/list.php?i=list`)
- Multi-select ingredient chips (add/remove with X icon)
- Search button: "Trouver des cocktails"
- Results grid showing:
  - Cocktail card with image
  - Name
  - Match percentage badge (e.g., "87% - Il vous manque 2 ingrédients")
  - Tap card → navigate to CocktailDetailView
- Empty state: "Sélectionnez des ingrédients pour commencer"

### 4. SHAKER SLOT VIEW (Random Slot Machine)
- Three vertical spinning reels with cocktail icons
- Big "SPIN" button (glowing, pulsing animation)
- On spin:
  - Animate reels for 2 seconds (staggered stop)
  - Fetch random cocktail from API
  - Display result card with:
    - Cocktail image (large)
    - Name
    - "Voir la recette" button → CocktailDetailView
    - "Défi 5 minutes" button → start challenge
- Track usage count for `aventurier_hasard` badge
- Show spin counter: "Tirages effectués: X"

### 5. COCKTAIL DETAIL VIEW
- Full-width hero image with gradient overlay
- Floating favorite heart icon (top-right, toggles on/off)
- Content sections:
  - **A) INGREDIENTS** (translated to French):
    - List with bullet points
    - Measurements converted to metric (oz → ml, etc.)
    - Highlight missing ingredients if coming from My Bar
  - **B) GLASS TYPE** (translated, with icon)
  - **C) INSTRUCTIONS** (translated, numbered steps)

- If active challenge for this cocktail:
  - Show countdown timer (MM:SS)
  - Two buttons: "J'ai réussi !" (green) / "J'abandonne" (red)
  - On success: complete challenge, show toast, check badges
  - On fail: mark challenge as failed

- Back button to previous view
- Check and unlock badges after viewing:
  - `premiere_gorgee`: first favorite added
  - `apprenti_barman`: 5 unique cocktails viewed
  - `maitre_mixologue`: 20 favorites total

### 6. FAVORITES VIEW
- Grid of favorited cocktails (load from Bolt Database)
- Each card:
  - Cocktail image
  - Name
  - Remove button (trash icon, confirm with toast)
  - Tap → navigate to CocktailDetailView
- Empty state: "Aucun favori pour l'instant. Explorez des cocktails !"
- Sort by: most recent first

### 7. BADGES VIEW
Display all 5 badge types in cards:

**BADGE 1: Première Gorgée**
- Icon: Droplet
- Description: "Ajoutez votre premier cocktail favori"
- Progress: 0/1 or UNLOCKED

**BADGE 2: Apprenti Barman**
- Icon: GraduationCap
- Description: "Consultez 5 cocktails différents"
- Progress: X/5

**BADGE 3: Maître Mixologue**
- Icon: Trophy
- Description: "Collectionnez 20 favoris"
- Progress: X/20

**BADGE 4: Aventurier du Hasard**
- Icon: Shuffle
- Description: "Utilisez la machine à sous 10 fois"
- Progress: X/10

**BADGE 5: Collectionneur**
- Icon: Library
- Description: "Découvrez tous les types de cocktails"
- Progress: X/11 (11 categories in TheCocktailDB)

**Visual:**
- Locked badges: grayscale with lock icon
- Unlocked badges: full color with glow effect
- Progress bar below each badge
- Show unlock date for completed badges

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### API SERVICE (cocktailAPI.ts logic)

**Base URL**: `https://www.thecocktaildb.com/api/json/v1/1/`

**Methods needed:**
- `searchByName(query)` → `/search.php?s={query}`
- `getRandomCocktail()` → `/random.php`
- `filterByIngredient(ingredient)` → `/filter.php?i={ingredient}`
- `getCocktailDetails(id)` → `/lookup.php?i={id}`
- `getIngredientsList()` → `/list.php?i=list`
- `getCategoriesList()` → `/list.php?c=list`

**Error handling:**
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- Show error toast on failure
- Fallback to cached data if available

**Response caching:**
- Check `api_cache` table before fetching
- If `cached_at` > 30 minutes ago: fetch fresh data
- Store response in `api_cache` as JSONB
- Cache key: `${endpoint}:${params}`

### DATABASE SERVICE (supabaseService.ts logic)

**Auto-create user on first load:**
- Check sessionStorage for `mixologia_user_id`
- If exists: fetch user from DB
- If not: INSERT new user, store UUID in sessionStorage

**Favorites operations:**
- `addFavorite(userId, cocktailId, name, image)`
- `removeFavorite(id)` → DELETE from favorites
- `getFavorites(userId)` → SELECT * WHERE user_id

**Badge operations:**
- `getBadges(userId)` → SELECT * WHERE user_id
- `updateBadgeProgress(userId, badgeType, progress)`
- `unlockBadge(userId, badgeType)` → SET unlocked_at = NOW()
- Check unlock conditions after each relevant action

**Challenge operations:**
- `createChallenge(userId, cocktailId, name)`
- `updateChallengeStatus(id, status, completed_at)`
- `getActiveChallenge(userId)` → SELECT WHERE status = 'accepted'

### TRANSLATION SERVICE (translationService.ts logic)

**Ingredient dictionary (87 entries, examples):**
- "Vodka" → "Vodka"
- "Light rum" → "Rhum blanc"
- "Lime juice" → "Jus de citron vert"
- "Sugar syrup" → "Sirop de sucre"
- [Include most common cocktail ingredients]

**Glass dictionary (16 entries):**
- "Cocktail glass" → "Verre à cocktail"
- "Highball glass" → "Verre highball"
- "Old-fashioned glass" → "Verre old-fashioned"
- "Martini glass" → "Verre à martini"

**Measurement conversion:**
- oz → ml (1 oz = 30 ml)
- cups → cl (1 cup = 24 cl)
- tsp → ml (1 tsp = 5 ml)
- tbsp → ml (1 tbsp = 15 ml)

**Translation flow:**
1. Check `translations` table for `original_text`
2. If found: return `translated_text`
3. If not: use dictionary or keep original
4. Store new translation in database for future use

### BADGE CHECK LOGIC (after each action)

**After adding favorite:**
- Check `premiere_gorgee` (1 favorite)
- Check `maitre_mixologue` (20 favorites)

**After viewing cocktail detail:**
- Add to `viewedCocktails` Set
- Check `apprenti_barman` (5 unique views)
- Track category, check `collectionneur` (all 11 categories)

**After slot machine spin:**
- Increment `slotUsageCount`
- Check `aventurier_hasard` (10 spins)

### TOAST NOTIFICATIONS

- **Position**: fixed top-right, stack vertically
- **Auto-dismiss**: 5 seconds
- **Types:**
  - Success (green): "Favori ajouté !", "Badge débloqué !"
  - Info (blue): "Défi accepté", "Temps écoulé"
  - Error (red): "Erreur API", "Connexion perdue"
- Show icon + message + close button

---

## 🎯 UI COMPONENTS TO CREATE

### `<Button>`
- **Variants**: primary (cyan), secondary (purple), success (green), danger (red)
- **Sizes**: sm, md, lg
- **States**: default, hover, active, disabled, loading
- Loading state shows spinner icon

### `<Input>`
- With icon support (left/right)
- Placeholder styling
- Focus state with glow effect
- Error state with red border

### `<Card>`
- Glass morphism background
- Border with gradient
- Hover: lift + glow animation
- Click: scale down effect

### `<Modal>`
- Centered with backdrop blur
- Close on backdrop click (optional)
- Close button (X icon top-right)
- Smooth fade-in animation

### `<CocktailCard>`
- Image with aspect ratio 1:1
- Overlay with name on hover
- Favorite heart icon (absolute top-right)
- Click: navigate to detail

### `<Badge>`
- Icon + title + description
- Progress bar
- Locked/unlocked states
- Unlock animation: scale + rotate + glow

### `<Toast>`
- Icon + message + close button
- Slide-in animation from right
- Auto-dismiss progress bar at bottom

### `<Spinner>`
- Rotating cocktail glass icon or circular spinner
- Size variants: sm, md, lg

### `<ProgressBar>`
- Percentage-based fill
- Smooth animation on value change
- Gradient fill (cyan to purple)

---

## ⚠️ CRITICAL REQUIREMENTS (DO NOT SKIP)

1. **NEVER use localStorage or sessionStorage for data persistence**
   - Use Bolt Database for: users, favorites, badges, challenges, cache, translations
   - ONLY use sessionStorage for: `mixologia_user_id` (user identification)

2. **ALL database operations must use Bolt Database**
   - No mock data
   - No in-memory state for persistent data
   - Every favorite, badge, challenge must be in database

3. **API caching is MANDATORY**
   - Check `api_cache` table before every external API call
   - 30-minute TTL strictly enforced
   - Store full response as JSONB

4. **Error handling everywhere**
   - Show loading spinners during async operations
   - Display error toasts with retry option
   - Graceful fallbacks (empty states, cached data)

5. **Mobile-first responsive**
   - Test at 375px width minimum
   - Touch-friendly buttons (min 44px tap targets)
   - Bottom navigation on mobile, sidebar on desktop

6. **Performance**
   - Lazy load images
   - Debounce search inputs (300ms)
   - Memoize expensive computations
   - Limit API calls with backoff

7. **Badge unlocking must be automatic**
   - Check conditions after every relevant action
   - Show toast notification immediately
   - Update database with `unlocked_at` timestamp
   - Visual animation on badges view

8. **Challenge timer must be precise**
   - Use `setInterval` for countdown
   - Persist remaining time in state
   - Show MM:SS format
   - Auto-fail when timer reaches 00:00

---

## 📋 TESTING CHECKLIST (verify after build)

- [ ] Age verification blocks access if refused
- [ ] Anonymous user created automatically with UUID
- [ ] Favorites persist after page refresh
- [ ] Badge progress saves to database
- [ ] API responses cached for 30 minutes
- [ ] Slot machine animation is smooth
- [ ] Challenge countdown timer works correctly
- [ ] Translations stored and reused from database
- [ ] All 6 views navigate correctly
- [ ] Mobile responsive at 375px width
- [ ] Error handling shows appropriate messages
- [ ] Toast notifications auto-dismiss after 5s

---

## 🚀 FINAL NOTES

This is a **COMPLETE production-ready application**. Build EVERYTHING described above in a single implementation. Follow the implementation order but deliver all features. Use Bolt Database exclusively for persistence. Create a stunning, futuristic UI that feels like a premium speakeasy experience. Make it smooth, responsive, and delightful to use.

**Generate the complete application now.**
