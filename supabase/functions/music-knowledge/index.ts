import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type SeedArtist = { id?: string; name: string; genre?: string; moods?: string[]; sound?: string; tracks?: string[] };
type Candidate = {
  artist: string;
  track: string;
  trackId: string;
  sources: Record<string, unknown>;
  sourceCount: number;
  genres: string[];
  tags: string[];
  popularity: number | null;
  independent: boolean;
  identifiers: Record<string, string>;
  links: Record<string, string>;
  preview: string | null;
  artwork: string | null;
  softWaveScore: number;
  scoreSignals: Record<string, number>;
};

const approved = (provider: string) => Deno.env.get(`${provider.toUpperCase()}_TERMS_APPROVED`) === 'true';

async function getJson(url: URL, options: RequestInit = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function providerJson(provider: string, url: URL, options: RequestInit, rateLimiter: ReturnType<typeof createClient> | null) {
  if (!rateLimiter) throw new Error('Shared provider throttle is not configured.');
  const configuredInterval = Number(Deno.env.get(`${provider.toUpperCase()}_MIN_INTERVAL_MS`));
  const interval = provider === 'musicbrainz' ? 1100 : provider === 'creditsfm' ? 2200 : configuredInterval;
  if (!Number.isInteger(interval) || interval < 1) throw new Error(`Missing ${provider.toUpperCase()}_MIN_INTERVAL_MS rate policy.`);
  const { data: waitMs, error } = await rateLimiter.rpc('claim_music_provider_slot', {
    p_provider: provider,
    p_interval_ms: interval,
    p_max_wait_ms: 5000,
  });
  if (error) throw new Error(`Shared ${provider} throttle failed: ${error.message}`);
  if (Number(waitMs) < 0) throw new Error(`${provider} request deferred by shared rate limit.`);
  if (Number(waitMs) > 0) await new Promise(resolve => setTimeout(resolve, Number(waitMs)));
  return getJson(url, options);
}

function normalized(value: unknown) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function terms(value: string) {
  return normalized(value).split(' ').filter(word => word.length > 2);
}

function overlap(left: string[], right: string[]) {
  if (!left.length || !right.length) return 0;
  const rightSet = new Set(right.map(normalized));
  return left.filter(item => rightSet.has(normalized(item))).length / Math.max(left.length, 1);
}

function addCandidate(map: Map<string, Candidate>, candidate: Partial<Candidate> & { artist: string; track: string }, source: string) {
  if (!candidate.artist || !candidate.track) return;
  const key = `${normalized(candidate.artist)}::${normalized(candidate.track)}`;
  let current = map.get(key);
  if (!current) {
    current = {
      artist: candidate.artist,
      track: candidate.track,
      trackId: `provider::${key}`,
      sources: {},
      sourceCount: 0,
      genres: [],
      tags: [],
      popularity: null,
      independent: false,
      identifiers: {},
      links: {},
      preview: null,
      artwork: null,
      softWaveScore: 0,
      scoreSignals: {},
    };
    map.set(key, current);
  }
  current.sources[source] = candidate.sources?.[source] ?? true;
  current.sourceCount = Object.keys(current.sources).length;
  current.genres = [...new Set([...current.genres, ...(candidate.genres ?? [])])];
  current.tags = [...new Set([...current.tags, ...(candidate.tags ?? [])])];
  current.popularity = candidate.popularity ?? current.popularity;
  current.independent ||= candidate.independent === true;
  Object.assign(current.identifiers, candidate.identifiers ?? {});
  Object.assign(current.links, candidate.links ?? {});
  current.preview ??= candidate.preview ?? null;
  current.artwork ??= candidate.artwork ?? null;
}

function candidateSongwriters(candidate: Candidate) {
  const credits = candidate.sources.creditsfm as { songwriters?: { name: string }[] } | undefined;
  return credits?.songwriters ?? [];
}

async function musicBrainz(seed: SeedArtist, rateLimiter: ReturnType<typeof createClient> | null) {
  if (!approved('musicbrainz')) return { state: 'terms_not_approved', data: null, relationships: [], recordings: [] };
  const contact = Deno.env.get('MUSICBRAINZ_CONTACT');
  if (!contact) return { state: 'missing_contact', data: null, relationships: [], recordings: [] };
  try {
    const url = new URL('https://musicbrainz.org/ws/2/artist/');
    url.search = new URLSearchParams({ query: `artist:"${seed.name}"`, fmt: 'json', limit: '5' }).toString();
    const data = await providerJson('musicbrainz', url, { headers: { 'User-Agent': `TheSoftWave/1.0 (${contact})` } }, rateLimiter);
    const best = (data.artists ?? []).sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))[0];
    let relationships: unknown[] = [];
    if (best?.id) {
      try {
        const detailUrl = new URL(`https://musicbrainz.org/ws/2/artist/${encodeURIComponent(best.id)}`);
        detailUrl.search = new URLSearchParams({ inc: 'artist-rels+tags', fmt: 'json' }).toString();
        const details = await providerJson('musicbrainz', detailUrl, { headers: { 'User-Agent': `TheSoftWave/1.0 (${contact})` } }, rateLimiter);
        relationships = (details.relations ?? []).map((relation: any) => ({
          type: relation.type,
          direction: relation.direction,
          artist: relation.artist?.name ?? relation.target,
          id: relation.artist?.id ?? null,
        })).filter((relation: any) => relation.artist);
      } catch {}
    }
    const recordings: any[] = [];
    for (const track of (seed.tracks ?? []).slice(0, 2)) {
      const recordingUrl = new URL('https://musicbrainz.org/ws/2/recording/');
      recordingUrl.search = new URLSearchParams({ query: `recording:"${track}" AND artist:"${seed.name}"`, fmt: 'json', limit: '3' }).toString();
      try {
        const recordingData = await providerJson('musicbrainz', recordingUrl, { headers: { 'User-Agent': `TheSoftWave/1.0 (${contact})` } }, rateLimiter);
        const recording = (recordingData.recordings ?? []).sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))[0];
        if (recording) recordings.push({ id: recording.id, title: recording.title, score: recording.score, isrcs: recording.isrcs ?? [], artists: (recording['artist-credit'] ?? []).map((credit: any) => credit.name ?? credit.artist?.name), releases: (recording.releases ?? []).map((release: any) => ({ id: release.id, title: release.title, date: release.date })) });
      } catch {}
    }
    return { state: 'ok', data: best ? { id: best.id, name: best.name, score: best.score, type: best.type, country: best.country, tags: (best.tags ?? []).map((tag: any) => tag.name) } : null, relationships, recordings };
  } catch (error) {
    return { state: 'unavailable', error: String(error), data: null, relationships: [], recordings: [] };
  }
}

async function lastFm(seed: SeedArtist, rateLimiter: ReturnType<typeof createClient> | null) {
  const apiKey = Deno.env.get('LASTFM_API_KEY');
  if (!apiKey || !approved('lastfm')) return { state: apiKey ? 'terms_not_approved' : 'missing_key', similar: [], deeper: [], tags: [], similarTracks: [] };
  try {
    const request = async (method: string, name: string) => {
      const url = new URL('https://ws.audioscrobbler.com/2.0/');
      url.search = new URLSearchParams({ method, artist: name, api_key: apiKey, format: 'json', limit: '15' }).toString();
      return providerJson('lastfm', url, {}, rateLimiter);
    };
    const [similarData, tagData] = await Promise.all([
      request('artist.getsimilar', seed.name),
      request('artist.gettoptags', seed.name),
    ]);
    const similar = (similarData.similarartists?.artist ?? []).map((artist: any) => ({ name: artist.name, match: Number(artist.match) || 0, url: artist.url, hop: 1 }));
    const tags = (tagData.toptags?.tag ?? []).map((tag: any) => ({ name: tag.name, count: Number(tag.count) || 0 }));
    const similarTracks: any[] = [];
    for (const track of (seed.tracks ?? []).slice(0, 2)) {
      const url = new URL('https://ws.audioscrobbler.com/2.0/');
      url.search = new URLSearchParams({ method: 'track.getsimilar', artist: seed.name, track, api_key: apiKey, format: 'json', limit: '8' }).toString();
      const data = await providerJson('lastfm', url, {}, rateLimiter);
      similarTracks.push(...(data.similartracks?.track ?? []).map((item: any) => ({
        artist: item.artist?.name ?? item.artist,
        track: item.name,
        match: Number(item.match) || 0,
        url: item.url,
      })));
    }
    const deeper: any[] = [];
    for (const artist of similar.slice(0, 2)) {
      const data = await request('artist.getsimilar', artist.name);
      deeper.push(...(data.similarartists?.artist ?? []).slice(0, 5).map((item: any) => ({ name: item.name, match: Number(item.match) || 0, url: item.url, hop: 2, via: artist.name })));
    }
    return { state: 'ok', similar, deeper, tags, similarTracks };
  } catch (error) {
    return { state: 'unavailable', error: String(error), similar: [], deeper: [], tags: [], similarTracks: [] };
  }
}

async function discogs(seed: SeedArtist, rateLimiter: ReturnType<typeof createClient> | null) {
  const token = Deno.env.get('DISCOGS_TOKEN');
  const contact = Deno.env.get('PROVIDER_CONTACT');
  if (!token || !approved('discogs')) return { state: token ? 'terms_not_approved' : 'missing_token', genres: [], styles: [], releases: [] };
  if (!contact) return { state: 'missing_contact', genres: [], styles: [], releases: [] };
  try {
    const url = new URL('https://api.discogs.com/database/search');
    url.search = new URLSearchParams({ q: seed.name, type: 'release', per_page: '5' }).toString();
    const data = await providerJson('discogs', url, {
      headers: { 'User-Agent': `TheSoftWave/1.0 (${contact})`, 'Authorization': `Discogs token=${token}` },
    }, rateLimiter);
    const results = (data.results ?? []).slice(0, 5).map((item: any) => ({
      title: item.title,
      genres: item.genre ?? [],
      styles: item.style ?? [],
      labels: item.label ?? [],
      url: item.uri ? `https://www.discogs.com${item.uri}` : '',
    }));
    return { state: 'ok', genres: [...new Set(results.flatMap((item: any) => item.genres))], styles: [...new Set(results.flatMap((item: any) => item.styles))], releases: results };
  } catch (error) {
    return { state: 'unavailable', error: String(error), genres: [], styles: [], releases: [] };
  }
}

async function deezer(query: string, candidates: Map<string, Candidate>, rateLimiter: ReturnType<typeof createClient> | null) {
  if (!approved('deezer')) return 'terms_not_approved';
  try {
    const url = new URL('https://api.deezer.com/search');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '10');
    const data = await providerJson('deezer', url, {}, rateLimiter);
    for (const item of data.data ?? []) addCandidate(candidates, {
      artist: item.artist?.name,
      track: item.title,
      genres: [],
      popularity: Number(item.rank) || null,
      links: { deezer: item.link },
      preview: item.preview || null,
      artwork: item.album?.cover_medium || null,
      identifiers: { deezerTrackId: String(item.id), ...(item.isrc ? { isrc: item.isrc } : {}) },
      sources: { deezer: { album: item.album?.title, duration: item.duration } },
    }, 'deezer');
    return 'ok';
  } catch (error) { return `unavailable: ${String(error)}`; }
}

async function audius(query: string, candidates: Map<string, Candidate>, rateLimiter: ReturnType<typeof createClient> | null) {
  const apiKey = Deno.env.get('AUDIUS_API_KEY');
  const base = Deno.env.get('AUDIUS_API_URL') || 'https://api.audius.co';
  if (!approved('audius')) return 'terms_not_approved';
  try {
    const url = new URL('/v1/tracks/search', base);
    url.search = new URLSearchParams({ query, app_name: 'TheSoftWave', limit: '10' }).toString();
    const data = await providerJson('audius', url, { headers: apiKey ? { 'X-API-Key': apiKey } : {} }, rateLimiter);
    for (const item of data.data ?? []) addCandidate(candidates, {
      artist: item.user?.name,
      track: item.title,
      independent: true,
      popularity: Number(item.play_count) || null,
      links: { audius: item.permalink ? `https://audius.co${item.permalink}` : '' },
      artwork: item.artwork?.['480x480'] || item.artwork?.['150x150'] || null,
      identifiers: { audiusTrackId: String(item.id) },
      sources: { audius: { genre: item.genre, mood: item.mood, duration: item.duration } },
      genres: item.genre ? [item.genre] : [],
      tags: item.mood ? [item.mood] : [],
    }, 'audius');
    return 'ok';
  } catch (error) { return `unavailable: ${String(error)}`; }
}

async function creditsFm(recordings: any[], candidates: Map<string, Candidate>, rateLimiter: ReturnType<typeof createClient> | null) {
  if (!approved('creditsfm')) return { state: 'terms_not_approved', matched: 0 };
  const isrcs = [...new Set([
    ...recordings.flatMap(recording => recording.isrcs ?? []),
    ...[...candidates.values()].map(candidate => candidate.identifiers.isrc).filter(Boolean),
  ].map((value: string) => String(value).replace(/[^A-Za-z0-9]/g, '').toUpperCase()))]
    .filter(isrc => /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(isrc)).slice(0, 30);
  if (!isrcs.length) return { state: 'no_isrcs', matched: 0 };
  try {
    const url = new URL('https://api.credits.fm/v1/batch');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const apiKey = Deno.env.get('CREDITS_FM_API_KEY');
    if (apiKey) headers['x-api-key'] = apiKey;
    const data = await providerJson('creditsfm', url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ isrcs, contribute: false }),
    }, rateLimiter);
    const records = Object.values(data.isrcs ?? {}) as any[];
    let matched = 0;
    for (const record of records) {
      const artist = record.artist_names?.[0];
      const track = record.recording_title;
      if (!artist || !track || !record.isrc) continue;
      const songwriters = (record.songwriters ?? []).map((person: any) => ({
        name: person.name,
        role: person.role,
        ipi: person.ipi,
        publishers: (person.publishers ?? []).map((publisher: any) => ({ name: publisher.name, role: publisher.role, ipi: publisher.ipi })),
      }));
      const target = [...candidates.values()].find(candidate => normalized(candidate.artist) === normalized(artist) && normalized(candidate.track) === normalized(track));
      const sourceData = {
        isrc: record.isrc,
        iswc: record.iswc ?? null,
        songwriters,
        performers: (record.performers ?? []).map((person: any) => ({ name: person.name, role: person.role, creditType: person.credit_type })),
        url: `https://credits.fm/isrc/${encodeURIComponent(record.isrc)}`,
      };
      if (target) {
        target.sources.creditsfm = sourceData;
        target.sourceCount = Object.keys(target.sources).length;
        target.identifiers.isrc = record.isrc;
        if (record.iswc) target.identifiers.iswc = record.iswc;
        target.links.creditsfm = sourceData.url;
        matched++;
      }
    }
    return { state: 'ok', matched };
  } catch (error) {
    return { state: 'unavailable', matched: 0, error: String(error) };
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405, headers: corsHeaders });

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !supabaseUrl || !supabaseKey) return Response.json({ error: 'Authenticated Supabase access is required.' }, { status: 401, headers: corsHeaders });
  const supabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: authorization } } });
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return Response.json({ error: 'Authenticated Supabase access is required.' }, { status: 401, headers: corsHeaders });
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const rateLimiter = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

  try {
    const body = await request.json();
    const seedArtists = (Array.isArray(body.seedArtists) ? body.seedArtists : []).slice(0, 5).filter((artist: any) => typeof artist?.name === 'string' && artist.name.trim());
    const mood = String(body.mood ?? '').trim().slice(0, 160);
    const limit = Math.max(1, Math.min(Number(body.limit) || 40, 60));
    if (!seedArtists.length) return Response.json({ error: 'At least one seed artist is required.' }, { status: 400, headers: corsHeaders });

    const candidates = new Map<string, Candidate>();
    const seed = seedArtists[0] as SeedArtist;
    const [identity, community, discogsData] = await Promise.all([
      musicBrainz(seed, rateLimiter),
      lastFm(seed, rateLimiter),
      discogs(seed, rateLimiter),
    ]);
    const discogsGenres = [...(discogsData.genres ?? []), ...(discogsData.styles ?? [])];
    const searchArtists = [...new Set([
      seed.name,
      ...(seedArtists ?? []).slice(1, 2).map((artist: SeedArtist) => artist.name),
      ...(community.similar ?? []).slice(0, 1).map((artist: any) => artist.name),
      ...(community.deeper ?? []).slice(0, 1).map((artist: any) => artist.name),
    ])].slice(0, 4);
    for (const item of community.similarTracks ?? []) {
      addCandidate(candidates, {
        artist: item.artist,
        track: item.track,
        links: item.url ? { lastfm: item.url } : {},
        sources: { lastfm: { match: item.match, kind: 'similar-track' } },
      }, 'lastfm');
    }
    const providerStates: Record<string, string> = {
      musicbrainz: identity.state,
      lastfm: community.state,
      discogs: discogsData.state,
      deezer: approved('deezer') ? 'pending' : 'terms_not_approved',
      audius: approved('audius') ? 'pending' : 'terms_not_approved',
      creditsfm: 'pending',
    };
    const outcomes = [];
    for (const artist of searchArtists) {
      const query = `${artist} ${mood}`.trim();
      const [deezerState, audiusState] = await Promise.all([deezer(query, candidates, rateLimiter), audius(query, candidates, rateLimiter)]);
      outcomes.push({ deezerState, audiusState });
    }
    if (outcomes.some(result => result.deezerState === 'ok')) providerStates.deezer = 'ok';
    else if (outcomes.some(result => result.deezerState.startsWith('unavailable:'))) providerStates.deezer = 'unavailable';
    if (outcomes.some(result => result.audiusState === 'ok')) providerStates.audius = 'ok';
    else if (outcomes.some(result => result.audiusState.startsWith('unavailable:'))) providerStates.audius = 'unavailable';
    const creditsData = await creditsFm(identity.recordings ?? [], candidates, rateLimiter);
    providerStates.creditsfm = creditsData.state;
    for (const candidate of candidates.values()) {
      if (normalized(candidate.artist) !== normalized(seed.name) || !discogsData.releases?.length) continue;
      const release = discogsData.releases.find((item: any) => item.url);
      candidate.sources.discogs = release ? { url: release.url, title: release.title, genres: discogsData.genres, styles: discogsData.styles, labels: release.labels } : { genres: discogsData.genres, styles: discogsData.styles };
      candidate.sourceCount = Object.keys(candidate.sources).length;
    }

    const musicBrainzTags = identity.data?.tags ?? [];
    for (const candidate of candidates.values()) {
      if (normalized(candidate.artist) === normalized(seed.name)) candidate.tags = [...new Set([...candidate.tags, ...musicBrainzTags])];
    }

    const moodTerms = terms(mood);
    const sonicProfileTerms = terms(seedArtists.map((artist: SeedArtist) => `${artist.genre ?? ''} ${(artist.moods ?? []).join(' ')} ${artist.sound ?? ''}`).join(' '));
    const seedNames = seedArtists.map((artist: SeedArtist) => normalized(artist.name));
    const similarSet = new Map([...(community.similar ?? []), ...(community.deeper ?? [])].map((artist: any) => [normalized(artist.name), artist]));
    const musicBrainzRelations = new Set((identity.relationships ?? []).map((relation: any) => normalized(relation.artist)));
    const discogsTerms = discogsGenres.map(normalized);
    const feedback = body.feedback && typeof body.feedback === 'object' ? body.feedback : {};
    const artistPreferences = body.artistPreferences && typeof body.artistPreferences === 'object' ? body.artistPreferences : {};
    const previousArtists = new Set((Array.isArray(body.previousArtists) ? body.previousArtists : []).map(normalized));
    const writerCounts = new Map<string, number>();
    for (const candidate of candidates.values()) {
      for (const writer of candidateSongwriters(candidate)) {
        const key = normalized(writer.name);
        if (key) writerCounts.set(key, (writerCounts.get(key) ?? 0) + 1);
      }
    }
    const ranked = [...candidates.values()].map(candidate => {
      if (normalized(candidate.artist) === normalized(seed.name)) candidate.genres = [...new Set([...candidate.genres, ...discogsGenres])];
      const text = terms(`${candidate.artist} ${candidate.track} ${candidate.genres.join(' ')} ${candidate.tags.join(' ')}`);
      const moodFit = overlap(moodTerms, text);
      const sonicFit = overlap(sonicProfileTerms, terms(`${candidate.genres.join(' ')} ${candidate.tags.join(' ')}`));
      const communityTagFit = overlap(moodTerms, (community.tags ?? []).map((tag: any) => tag.name));
      const relation = similarSet.get(normalized(candidate.artist));
      const similarity = relation ? (relation.hop === 2 ? 0.72 : Math.min(1, Number(relation.match) || 0.8)) : (seedNames.includes(normalized(candidate.artist)) ? 0.45 : 0);
      const musicBrainzConnection = musicBrainzRelations.has(normalized(candidate.artist)) ? 1 : 0;
      const writerNames = candidateSongwriters(candidate).map(writer => normalized(writer.name));
      const creditConnection = writerNames.some((writer: string) => (writerCounts.get(writer) ?? 0) > 1) ? 1 : 0;
      const sceneFit = overlap(moodTerms, discogsTerms);
      const sourceBreadth = Math.min(candidate.sourceCount / 2, 1);
      const trackFeedback = Math.max(-1, Math.min(1, Number(feedback[`${normalized(candidate.artist)}::${normalized(candidate.track)}`]) || 0));
      const artistPreference = Math.min(1, Number(artistPreferences[normalized(candidate.artist)]) / 5 || 0);
      const preference = Math.max(-1, Math.min(1, trackFeedback + artistPreference * 0.5));
      const novelty = previousArtists.has(normalized(candidate.artist)) ? 0 : 1;
      const popularity = candidate.popularity ? Math.min(Math.log10(candidate.popularity + 1) / 6, 1) : 0.25;
      const independent = candidate.independent ? 1 : 0;
      const score = 0.20 * moodFit + 0.10 * sonicFit + 0.12 * similarity + 0.05 * communityTagFit + 0.08 * musicBrainzConnection + 0.07 * creditConnection + 0.08 * sceneFit + 0.08 * sourceBreadth + 0.08 * novelty + 0.05 * (1 - Math.abs(0.5 - popularity)) + 0.03 * independent + 0.06 * preference;
      candidate.softWaveScore = Math.round(Math.max(0, Math.min(1, score)) * 100);
      candidate.scoreSignals = { moodFit, sonicFit, artistSimilarity: similarity, communityTags: communityTagFit, musicBrainzConnection, creditConnection, sceneFit, sourceBreadth, novelty, popularity, independent, feedback: preference };
      return candidate;
    }).sort((a, b) => b.softWaveScore - a.softWaveScore).slice(0, limit);

    return Response.json({
      candidates: ranked,
      knowledge: { identity, community, discogs: discogsData, creditsfm: creditsData, relationships: identity.relationships ?? [] },
      providerStates,
      attribution: ['MusicBrainz', 'Last.fm', 'Discogs', 'Deezer', 'Audius', 'Credits.fm'].filter(name => providerStates[name.toLowerCase().replace('.', '')] === 'ok'),
    }, { headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400, headers: corsHeaders });
  }
});