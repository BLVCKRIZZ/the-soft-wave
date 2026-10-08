const express = require('express');
const path = require('path');
const { Readable } = require('stream');
require('dotenv').config();
const { registerDeezerRoutes } = require('./backend/deezer');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const AUDIUS_API_BASE = 'https://api.audius.co/v1';

function coerceBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return fallback;
    if (['true', '1', 'yes', 'y'].includes(trimmed)) return true;
    if (['false', '0', 'no', 'n'].includes(trimmed)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value ?? fallback);
}

function getArtworkUrl(track = {}) {
  const art = track.artwork || track.cover_art || track.cover_art_sizes || {};
  if (typeof art === 'string' && art) return art;
  if (art && typeof art === 'object') {
    return art['1000x1000'] || art['480x480'] || art['150x150'] || art._1000x1000 || art._480x480 || art._150x150 || '';
  }
  return '';
}

function normalizeAudiusUser(user = {}) {
  return {
    id: user.id ?? user.user_id ?? null,
    name: user.name || user.handle || user.username || 'Audius user',
    handle: user.handle || user.username || '',
    wallet: user.wallet || '',
  };
}

function hasRemixMetadata(remixOf) {
  if (!remixOf) return false;
  if (Array.isArray(remixOf)) return remixOf.length > 0;
  if (typeof remixOf === 'object') {
    if (Array.isArray(remixOf.tracks)) return remixOf.tracks.length > 0;
    if (Array.isArray(remixOf.parentTrackIds)) return remixOf.parentTrackIds.length > 0;
    if (remixOf.parentTrackId || remixOf.parentTrackIds) return true;
    return false;
  }
  return String(remixOf).trim().length > 0;
}

function normalizeAudiusTrack(track = {}) {
  const title = track.title || track.name || 'Untitled Track';
  const user = normalizeAudiusUser(track.user || {});
  const artist = track.artist || track.user?.name || user.name || 'Audius';
  const artwork = getArtworkUrl(track);
  const permalink = track.permalink || track.url || '';
  const streamPayload = track.stream || track.stream_url || track.preview || track.preview_url || track.download_url || track.audio_url || '';
  const streamUrl = typeof streamPayload === 'string' ? streamPayload : streamPayload?.url || '';
  const remixOf = track.remix_of || track.remixOf || null;

  return {
    id: String(track.id ?? track.track_id ?? track.trackId ?? track.permalink ?? title),
    title,
    artist,
    user,
    artwork,
    permalink,
    url: track.url || (permalink ? `https://audius.co${permalink.startsWith('/') ? permalink : `/${permalink}`}` : 'https://audius.co/'),
    stream_url: streamUrl,
    genre: track.genre || '',
    duration: Number(track.duration ?? track.length ?? 0) || 0,
    release_date: track.release_date || track.releaseDate || track.created_at || '',
    remixOf,
    isStreamable: coerceBoolean(track.is_streamable ?? track.isStreamable ?? track.streamable ?? true, true),
    isOriginalAvailable: coerceBoolean(track.is_original_available ?? track.isOriginalAvailable ?? true, true),
    isStreamGated: coerceBoolean(track.is_stream_gated ?? track.isStreamGated ?? track.is_stream_gated ?? false, false),
    previewCid: track.preview_cid || track.previewCid || '',
    trackCid: track.track_cid || track.trackCid || '',
    isDownloadable: coerceBoolean(track.is_downloadable ?? track.isDownloadable ?? false, false),
    isDownloadGated: coerceBoolean(track.is_download_gated ?? track.isDownloadGated ?? false, false),
    isUnlisted: coerceBoolean(track.is_unlisted ?? track.isUnlisted ?? false, false),
    permalink: permalink,
  };
}

function evaluateAudiusTrack(track = {}) {
  const normalized = normalizeAudiusTrack(track);
  const reasons = [];

  if (!normalized.title || !normalized.artist) {
    reasons.push('Missing required data');
  }

  if (!normalized.isStreamable) {
    reasons.push('Not streamable');
  }

  if (normalized.isStreamGated || normalized.isDownloadGated) {
    reasons.push('Stream gated');
  }

  if (hasRemixMetadata(normalized.remixOf)) {
    reasons.push('Remix');
  }

  if (!normalized.trackCid && !normalized.previewCid && !normalized.stream_url) {
    reasons.push('Missing required data');
  }

  if (normalized.isUnlisted) {
    reasons.push('Hidden/unlisted');
  }

  const playable = reasons.length === 0;

  return {
    ...normalized,
    playable,
    rejectionReasons: reasons,
    isRemix: hasRemixMetadata(normalized.remixOf),
  };
}

function sortPlayableAudiusTracks(results, query = '') {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  return [...results].sort((a, b) => {
    const aText = `${a.title || ''} ${a.artist || ''}`.toLowerCase();
    const bText = `${b.title || ''} ${b.artist || ''}`.toLowerCase();

    const aOriginal = !hasRemixMetadata(a.remixOf) && a.isStreamable && !a.isStreamGated ? 1 : 0;
    const bOriginal = !hasRemixMetadata(b.remixOf) && b.isStreamable && !b.isStreamGated ? 1 : 0;

    const aQueryMatch = normalizedQuery ? (aText.includes(normalizedQuery) ? 1 : 0) : 0;
    const bQueryMatch = normalizedQuery ? (bText.includes(normalizedQuery) ? 1 : 0) : 0;

    const aScore = (aOriginal * 100) + (aQueryMatch * 20) + (a.trackCid ? 5 : 0) + (a.duration || 0) / 100;
    const bScore = (bOriginal * 100) + (bQueryMatch * 20) + (b.trackCid ? 5 : 0) + (b.duration || 0) / 100;

    return bScore - aScore;
  });
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAudiusJson(url, extraHeaders = {}) {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  if (process.env.AUDIUS_API_KEY) {
    headers['x-api-key'] = process.env.AUDIUS_API_KEY;
  }

  if (process.env.AUDIUS_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.AUDIUS_BEARER_TOKEN}`;
  }

  const response = await fetchWithTimeout(url, { headers }, 15000);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Audius API request failed (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
}

function normalizeArtistName(value = '') {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function artistNameMatches(searchValue, actualValue) {
  const search = normalizeArtistName(searchValue);
  const actual = normalizeArtistName(actualValue);
  if (!search || !actual) return false;
  return search === actual || search.includes(actual) || actual.includes(search);
}

function debugTrackDecision(label, track, decision, debugEnabled = false) {
  if (!debugEnabled) return;

  const title = track?.title || 'Unknown track';
  const artist = track?.artist || track?.user?.name || 'Unknown artist';
  const lines = [
    `TRACK: ${title}`,
    `Artist: ${artist}`,
    `isStreamable: ${String(Boolean(decision?.isStreamable))}`,
    `isOriginalAvailable: ${String(Boolean(decision?.isOriginalAvailable))}`,
    `remixOf: ${decision?.remixOf ?? 'null'}`,
    `isStreamGated: ${String(Boolean(decision?.isStreamGated))}`,
    `previewCid: ${decision?.previewCid || 'n/a'}`,
    `trackCid: ${decision?.trackCid || 'n/a'}`,
    `duration: ${decision?.duration || 0}`,
  ];

  if (decision?.playable) {
    console.log(`[Audius ${label}] ${lines.join('\n')}`);
  } else {
    console.warn(`[Audius ${label}] REJECTED: ${title}\nReason:\n- ${decision?.rejectionReasons?.join('\n- ') || 'Unknown'}\n${lines.join('\n')}`);
  }
}

app.use(express.json());
app.use(express.static(__dirname));
registerDeezerRoutes(app);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'soft-wav-audius-proxy', envConfigured: Boolean(process.env.AUDIUS_API_KEY || process.env.AUDIUS_BEARER_TOKEN) });
});

app.get('/api/audius/users/search', async (req, res) => {
  const query = String(req.query.q || req.query.query || '').trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10);

  if (!query) {
    return res.json({ results: [], exactMatches: [], query });
  }

  try {
    const userSearchUrl = new URL(`${AUDIUS_API_BASE}/users/search`);
    userSearchUrl.searchParams.set('query', query);
    userSearchUrl.searchParams.set('limit', String(limit));

    const data = await fetchAudiusJson(userSearchUrl.toString());
    const users = Array.isArray(data?.data) ? data.data : Array.isArray(data?.users) ? data.users : [];
    const exactMatches = users.filter((user) => {
      const name = user?.name || user?.handle || user?.username || '';
      return artistNameMatches(query, name);
    });

    return res.json({
      results: users,
      exactMatches,
      query,
    });
  } catch (error) {
    console.error('Audius user search error:', error);
    res.status(502).json({
      error: 'Audius artist search unavailable',
      message: error.message || 'The Audius artist search could not be completed.',
      results: [],
      exactMatches: [],
      query,
    });
  }
});

app.get('/api/audius/artist/search', async (req, res) => {
  const query = String(req.query.q || req.query.query || '').trim();
  if (!query) return res.json({ results: [], exactMatches: [], query });

  try {
    const proxy = await fetchWithTimeout(`http://localhost:${PORT}/api/audius/users/search?q=${encodeURIComponent(query)}`, {}, 15000);
    if (!proxy.ok) {
      const text = await proxy.text().catch(() => '');
      throw new Error(text || proxy.statusText || 'Artist search proxy failed');
    }
    const data = await proxy.json();
    return res.json(data);
  } catch (error) {
    console.error('Audius artist search proxy error:', error);
    return res.status(502).json({
      error: 'Audius artist search unavailable',
      message: error.message || 'The artist search could not be completed.',
      results: [],
      exactMatches: [],
      query,
    });
  }
});

app.get('/api/audius/users/:id/tracks', async (req, res) => {
  const userId = String(req.params.id || '').trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 25);

  if (!userId) {
    return res.status(400).json({ error: 'Missing artist id.' });
  }

  try {
    const tracksUrl = new URL(`${AUDIUS_API_BASE}/users/${encodeURIComponent(userId)}/tracks`);
    tracksUrl.searchParams.set('limit', String(limit));

    const data = await fetchAudiusJson(tracksUrl.toString());
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.tracks) ? data.tracks : [];
    const evaluated = items.map((track) => evaluateAudiusTrack(track));

    return res.json({
      results: evaluated,
      total: evaluated.length,
      artistId: userId,
    });
  } catch (error) {
    console.error('Audius artist tracks error:', error);
    res.status(502).json({
      error: 'Audius artist track lookup unavailable',
      message: error.message || 'The artist track request could not be completed.',
      results: [],
      total: 0,
    });
  }
});

app.get('/api/audius/artist/:id/tracks', async (req, res) => {
  const artistId = String(req.params.id || '').trim();

  try {
    const proxy = await fetchWithTimeout(`http://localhost:${PORT}/api/audius/users/${encodeURIComponent(artistId)}/tracks?limit=${encodeURIComponent(req.query.limit || 12)}`, {}, 15000);
    if (!proxy.ok) {
      const text = await proxy.text().catch(() => '');
      throw new Error(text || proxy.statusText || 'Artist tracks proxy failed');
    }
    const data = await proxy.json();
    return res.json(data);
  } catch (error) {
    console.error('Audius artist tracks proxy error:', error);
    return res.status(502).json({
      error: 'Audius artist track lookup unavailable',
      message: error.message || 'The artist track request could not be completed.',
      results: [],
      total: 0,
    });
  }
});

app.get('/api/audius/search', async (req, res) => {
  const query = String(req.query.q || req.query.query || '').trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 12);
  const debugEnabled = req.query.debug === '1' || Boolean(process.env.AUDIUS_DEBUG);

  if (!query) {
    return res.json({ results: [], rejected: [], total: 0, query });
  }

  try {
    const searchUrl = new URL(`${AUDIUS_API_BASE}/tracks/search`);
    searchUrl.searchParams.set('query', query);
    searchUrl.searchParams.set('limit', String(limit));

    const data = await fetchAudiusJson(searchUrl.toString());
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.tracks) ? data.tracks : [];
    const evaluated = items.map((track) => {
      const decision = evaluateAudiusTrack(track);
      debugTrackDecision('SEARCH', track, decision, debugEnabled);
      return decision;
    });

    const playableResults = sortPlayableAudiusTracks(
      evaluated.filter((item) => item.playable),
      query
    );

    const rejected = evaluated.filter((item) => !item.playable).slice(0, 20);

    return res.json({
      results: playableResults,
      rejected,
      total: playableResults.length,
      query,
      note: playableResults.length ? 'Playable Audius tracks returned.' : 'No playable Audius tracks found.',
    });
  } catch (error) {
    console.error('Audius search error:', error);
    res.status(502).json({
      error: 'Audius search unavailable',
      message: error.message || 'The Audius API request could not be completed.',
      results: [],
      rejected: [],
      total: 0,
    });
  }
});

app.get('/api/audius/discovery', async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 12);
  const mode = String(req.query.mode || 'trending').toLowerCase();
  const debugEnabled = req.query.debug === '1' || Boolean(process.env.AUDIUS_DEBUG);

  try {
    const discoveryUrl = new URL(`${AUDIUS_API_BASE}/tracks/${mode === 'underground' ? 'underground-trending' : 'trending'}`);
    discoveryUrl.searchParams.set('limit', String(limit));

    const data = await fetchAudiusJson(discoveryUrl.toString());
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.tracks) ? data.tracks : [];
    const evaluated = items.map((track) => {
      const decision = evaluateAudiusTrack(track);
      debugTrackDecision(mode === 'underground' ? 'DISCOVERY_UNDERGROUND' : 'DISCOVERY', track, decision, debugEnabled);
      return decision;
    });

    const playableResults = sortPlayableAudiusTracks(
      evaluated.filter((item) => item.playable),
      ''
    );

    return res.json({
      results: playableResults,
      total: playableResults.length,
      mode,
    });
  } catch (error) {
    console.error('Audius discovery error:', error);
    res.status(502).json({
      error: 'Audius discovery unavailable',
      message: error.message || 'The Audius discovery request could not be completed.',
      results: [],
      total: 0,
    });
  }
});

app.get('/api/audius/track/:id', async (req, res) => {
  const trackId = String(req.params.id || '').trim();
  if (!trackId) {
    return res.status(400).json({ error: 'Missing track id.' });
  }

  try {
    const trackUrl = `${AUDIUS_API_BASE}/tracks/${encodeURIComponent(trackId)}`;
    const data = await fetchAudiusJson(trackUrl);
    const track = data?.data || data?.track || data;
    const decision = evaluateAudiusTrack(track);
    debugTrackDecision('TRACK', track, decision, Boolean(process.env.AUDIUS_DEBUG));

    if (!decision.playable) {
      return res.status(404).json({
        error: 'Audius track unavailable',
        message: `Audius rejected this track: ${decision.rejectionReasons.join(', ') || 'No playable version available.'}`,
        track: decision,
        playable: false,
      });
    }

    res.json({ track: decision, playable: true });
  } catch (error) {
    console.error('Audius track error:', error);
    res.status(502).json({
      error: 'Audius track metadata unavailable',
      message: error.message || 'The Audius track request could not be completed.',
    });
  }
});

app.get('/api/audius/stream/:id', async (req, res) => {
  const trackId = String(req.params.id || '').trim();
  if (!trackId) {
    return res.status(400).json({ error: 'Missing track id.' });
  }

  try {
    const metadataUrl = `${AUDIUS_API_BASE}/tracks/${encodeURIComponent(trackId)}`;
    const metadata = await fetchAudiusJson(metadataUrl);
    const rawTrack = metadata?.data || metadata?.track || metadata || {};
    const decision = evaluateAudiusTrack(rawTrack);

    if (!decision.playable) {
      return res.status(404).json({
        error: 'Audius stream unavailable',
        message: `This track is not playable: ${decision.rejectionReasons.join(', ') || 'No valid stream available.'}`,
      });
    }

    const streamUrl = `${AUDIUS_API_BASE}/tracks/${encodeURIComponent(trackId)}/stream`;
    const headers = {};
    if (process.env.AUDIUS_API_KEY) headers['x-api-key'] = process.env.AUDIUS_API_KEY;
    if (process.env.AUDIUS_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.AUDIUS_BEARER_TOKEN}`;

    const response = await fetchWithTimeout(streamUrl, { headers }, 15000);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return res.status(502).json({ error: 'Audius stream unavailable', message: errorText || response.statusText || 'The Audius stream could not be resolved.' });
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body);
      nodeStream.on('error', (streamError) => {
        console.error('Audius stream pipe error:', streamError);
        if (!res.writableEnded && !res.destroyed) {
          res.status(502).json({ error: 'Audius stream unavailable', message: 'The remote Audius stream was interrupted.' });
        }
      });

      res.on('close', () => {
        if (!nodeStream.destroyed) {
          nodeStream.destroy();
        }
      });

      nodeStream.pipe(res);
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error('Audius stream error:', error);
    res.status(502).json({
      error: 'Audius stream unavailable',
      message: error.message || 'The Audius stream could not be resolved.',
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'the-soft-wave.html'));
});

app.listen(PORT, () => {
  console.log(`Soft WAV Audius proxy running at http://localhost:${PORT}`);
});
