(function () {
  const VIBE_WORDS = [
    'soul', 'neo-soul', 'r&b', 'rb', 'indie soul', 'alternative r&b', 'late night', 'intimate',
    'dreamy', 'warm', 'melancholic', 'cinematic', 'brooding', 'nocturnal', 'soft', 'slow burn',
    'romantic', 'sincere', 'grit', 'spiritual', 'midnight', 'after hours', 'beautiful', 'ash', 'vibe'
  ];

  const NOISE_PATTERNS = /(remix|cover|live|session|mix|edit|bootleg|radio|instrumental|interlude|medley|acoustic|reprise|dj)/i;
  const GENERIC_HIT_PATTERNS = /(love|baby|forever|summer|heart|nights|tonight|again|you|me|home|everything|angel|fire)/i;

  function normalizeSearchText(value = '') {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function isNoiseTrack(track = {}) {
    const title = String(track?.title || track?.track || '').trim();
    const artist = String(track?.artist?.name || track?.artist || '').trim();
    const haystack = `${title} ${artist}`;
    return NOISE_PATTERNS.test(haystack) || !title || !artist;
  }

  function buildTrackFeedbackKey(track = {}) {
    const artist = String(track?.artist || track?.artistName || '').trim();
    const title = String(track?.track || track?.title || '').trim();
    const artistKey = normalizeSearchText(artist).replace(/\s+/g, '-') || 'unknown';
    const trackKey = normalizeSearchText(title).replace(/\s+/g, '-') || 'track';
    return `${artistKey}::${trackKey}`;
  }

  function scoreTrackForVibe(track, query = '', feedback = {}) {
    const artistName = String(track?.artist?.name || track?.artist || '').trim();
    const rawTitle = String(track?.title || track?.track || '').trim();
    const albumTitle = String(track?.album?.title || '').trim();
    const input = `${artistName} ${rawTitle} ${albumTitle}`.toLowerCase();
    const normalizedArtist = normalizeSearchText(artistName);
    const normalizedQuery = normalizeSearchText(query);
    const key = buildTrackFeedbackKey({ artist: artistName, track: rawTitle });
    const rating = Number(feedback?.ratings?.[key] || 0);
    const liked = Boolean(feedback?.likes?.[key]);
    let score = 0;

    if (track?.preview?.available && track?.preview?.url) {
      score += 14;
    }

    if (!isNoiseTrack(track)) {
      score += 12;
    }

    if (normalizedArtist && normalizedQuery) {
      if (normalizedArtist === normalizedQuery || normalizedArtist.includes(normalizedQuery) || normalizedQuery.includes(normalizedArtist)) {
        score += 46;
      } else {
        score += 8;
      }
    }

    if (rawTitle && rawTitle.length <= 28) {
      score += 9;
    }

    if (rawTitle && rawTitle.length > 60) {
      score -= 8;
    }

    for (const vibeWord of VIBE_WORDS) {
      if (input.includes(vibeWord)) {
        score += 8;
      }
    }

    if (/(soul|r&b|rb|neo-soul|late night|intimate|dreamy|side quest|warm|melancholic|romantic|sincere|brooding|nocturnal)/i.test(input)) {
      score += 10;
    }

    if (NOISE_PATTERNS.test(input)) {
      score -= 60;
    }

    if (GENERIC_HIT_PATTERNS.test(rawTitle) && rawTitle.split(/\s+/).length <= 3) {
      score -= 14;
    }

    if (/^(love|heart|summer|forever|alone|tonight|nights|baby|beautiful)$/i.test(rawTitle.trim())) {
      score -= 18;
    }

    if (/^\d+$/i.test(rawTitle.trim())) {
      score -= 12;
    }

    if (artistName && normalizedQuery && normalizedArtist === normalizedQuery && rawTitle && !GENERIC_HIT_PATTERNS.test(rawTitle)) {
      score += 8;
    }

    if (rating > 0) {
      score += (rating - 3) * 12;
    }

    if (liked) {
      score += 22;
    }

    return score;
  }

  function rankTrackMatches(tracks = [], query = '', feedback = {}, options = {}) {
    const list = Array.isArray(tracks) ? tracks : [];
    const recentlySuggested = Array.isArray(options?.recentlySuggested) ? options.recentlySuggested : [];

    return list
      .map((track) => {
        const artistName = String(track?.artist?.name || track?.artist || '').trim();
        const rawTitle = String(track?.title || track?.track || '').trim();
        const trackKey = buildTrackFeedbackKey({ artist: artistName, track: rawTitle });
        const recencyIndex = recentlySuggested.findIndex((key) => key === trackKey);
        const recencyPenalty = recencyIndex >= 0 ? 60 + (recencyIndex * 20) : 0;
        const score = scoreTrackForVibe(track, query, feedback) - recencyPenalty;
        return { track, score };
      })
      .filter(({ track, score }) => {
        const previewOk = Boolean(track?.preview?.available && track?.preview?.url);
        return previewOk && score > 0 && !isNoiseTrack(track);
      })
      .sort((a, b) => b.score - a.score || (String(a.track?.title || '').length - String(b.track?.title || '').length))
      .slice(0, 5)
      .map(({ track }) => track);
  }

  function addTrackToPlaylist(playlist, track) {
    const safePlaylist = playlist || { id: 'local-playlist', title: 'Playlist', tracks: [] };
    const targetArtist = String(track?.artist || '').trim();
    const targetTitle = String(track?.track || track?.title || '').trim();
    const trackKey = buildTrackFeedbackKey({ artist: targetArtist, track: targetTitle });

    const existing = (safePlaylist.tracks || []).find((entry) => {
      const key = buildTrackFeedbackKey({ artist: entry?.artist || '', track: entry?.track || entry?.title || '' });
      return key === trackKey;
    });

    if (existing) {
      return { added: false, playlist: safePlaylist, reason: 'already in playlist' };
    }

    safePlaylist.tracks = [...(safePlaylist.tracks || []), { artist: targetArtist, track: targetTitle, reason: '' }];
    return { added: true, playlist: safePlaylist, reason: 'added' };
  }

  const api = {
    normalizeSearchText,
    buildTrackFeedbackKey,
    rankTrackMatches,
    addTrackToPlaylist,
    scoreTrackForVibe,
    isNoiseTrack,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.SoftWavRecommendationEngine = api;
  }
})();
