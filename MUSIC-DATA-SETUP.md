# Unified Music Data Layer

Playlist generation calls the authenticated `music-knowledge` Supabase Edge Function. AI curation, mood suggestions, and chat call the authenticated `curator` function. AI/provider credentials stay in Supabase secrets; no user enters or receives a provider key. Provider results are normalized before ranking. If music providers are unavailable, the local catalog remains available.

## Deploy

Apply the shared provider throttle migration, then deploy the function:

```sh
supabase link --project-ref mbecdcimfjodnjihfmwz
supabase db push
supabase functions deploy music-knowledge
supabase functions deploy curator
```

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Configure secrets in the Supabase project, never in the HTML or a public `.env` file.

## Shared AI

Set one provider key once for every signed-in user:

```sh
supabase secrets set AI_PROVIDER=openrouter AI_MODEL=google/gemini-3.5-flash-lite OPENROUTER_API_KEY=<provider-secret>
```

Alternatively set `AI_PROVIDER=gemini` and `GEMINI_API_KEY=<provider-secret>`. `AI_ALLOWED_MODELS` is a comma-separated allowlist for admin model changes; if omitted, only `AI_MODEL` is allowed. The two admins are `lebea.delmon@gmail.com` and `deleelebea@gmail.com`; they can select the provider/model for their current browser session, but the server still enforces the model allowlist. Users do not see key/model settings or send provider keys from their browsers.

Regular users are limited to 100 shared-AI requests per UTC day by default. Change this with the `AI_DAILY_REQUESTS_PER_USER` Edge Function secret. Admin AI calls are exempt. The daily counter is atomic and stored in Supabase.

Admin email checks are duplicated in the Edge Function and RLS policies. Change both locations together if admin accounts change. The browser-only role checks control visibility; the Edge Function and database policies are the actual security boundary.

## Feedback and Artist Review

The migrations create `playlist_feedback`, `artist_suggestions`, `artist_catalog`, and a stable `rating_key` for each saved playlist. Each signed-in user can upsert one 1–5-star rating per playlist and submit pending artist suggestions. Only admins can inspect all ratings/suggestions, approve/reject suggestions, and publish approved artists to `artist_catalog`. All signed-in users can read approved catalog additions. New suggestions never enter recommendations until approved.

## Provider Configuration

Every provider defaults to off. Set its `*_TERMS_APPROVED=true` secret only after the account owner has confirmed the current provider terms, attribution, allowed caching, and commercial-use status for The Soft Wave. The flags are operator attestations, not legal approval.

- MusicBrainz: `MUSICBRAINZ_TERMS_APPROVED=true`, `MUSICBRAINZ_CONTACT=<maintainer email or URL>`. The function spaces calls by at least 1.1 seconds and sends a named User-Agent. Commercial products must select the appropriate MetaBrainz account/supporter tier before enabling it.
- Last.fm: `LASTFM_TERMS_APPROVED=true`, `LASTFM_API_KEY=<key>`, `LASTFM_MIN_INTERVAL_MS=<approved interval>`. Last.fm asks commercial API users to contact `partners@last.fm` before use.
- Discogs: `DISCOGS_TERMS_APPROVED=true`, `DISCOGS_TOKEN=<token>`, `DISCOGS_MIN_INTERVAL_MS=1100`, `PROVIDER_CONTACT=<maintainer email or URL>`. Its authenticated limit is 60 requests/minute. Only use permitted fields, do not cache Discogs data longer than necessary or display data older than six hours, and show the required Discogs notices and direct source links.
- Deezer: `DEEZER_TERMS_APPROVED=true`, `DEEZER_MIN_INTERVAL_MS=<approved interval>`. Confirm that API access and the intended catalog, preview, artwork, and commercial use are allowed for the application before enabling it.
- Audius: `AUDIUS_TERMS_APPROVED=true`, `AUDIUS_MIN_INTERVAL_MS=<approved interval>`. `AUDIUS_API_KEY=<key>` is optional for read-only search; without a key, the API has lower limits. The adapter uses `https://api.audius.co/v1` and only links to creator content; it does not rehost audio.
- Credits.fm: `CREDITSFM_TERMS_APPROVED=true`; `CREDITS_FM_API_KEY=<key>` is optional for higher limits. Reads use the documented `/v1/batch` API with `contribute:false`, so lookups do not submit data. The adapter limits each playlist request to one Credits.fm batch lookup and spaces calls by at least 2.2 seconds when no key is configured.

Last.fm, Deezer, and Audius request spacing is intentionally required configuration rather than guessed; set it from the active API plan/terms. The database-backed queue is shared across Edge Function instances and rejects work when a provider's queue is too long. A failed provider is omitted while other sources and the local catalog continue to work.

## Data and Ranking

The function joins MusicBrainz artist/recording identity and ISRCs, Last.fm similarity/tags, Discogs release styles, Deezer catalog tracks, Audius creator tracks, and Credits.fm songwriter/performer records into normalized candidates. It deduplicates by normalized artist and title. The Soft Wave score uses emotional mood/tag fit, a metadata-derived sonic-text match against selected artists' genres/moods/sound descriptions, artist and contributor connections, scene fit, source breadth, discovery novelty, modest popularity, independent status, and local user feedback. Sonic fit currently uses catalog metadata and tags, not waveform/audio analysis. The language model may curate order and wording only from the engine's ranked shortlist; it cannot add tracks.

Credits.fm public lookups can return songwriters, publishers, performers, ISWC, and identifiers; attribution links are shown beside results. Discogs data is linked to its catalog entries and labeled "Data provided by Discogs." This application uses Discogs' API and is not affiliated with, sponsored, or endorsed by Discogs.

## Current API References

- [MusicBrainz API rate limiting and User-Agent](https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting)
- [MetaBrainz commercial and non-commercial account types](https://metabrainz.org/supporters/account-type)
- [Last.fm API and commercial usage](https://www.last.fm/api)
- [Discogs API rate limits](https://www.discogs.com/developers)
- [Discogs API Terms of Use](https://support.discogs.com/hc/articles/360009334593-API-Terms-of-Use)
- [Deezer API documentation](https://developers.deezer.com/api)
- [Audius API documentation](https://docs.audius.co/api)
- [Credits.fm API](https://credits.fm/api) and [interactive reference](https://api.credits.fm/docs)