const DEFAULT_DEEZER_API_BASE = 'https://api.deezer.com';

class DeezerProvider {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || process.env.DEEZER_API_BASE || DEFAULT_DEEZER_API_BASE;
    this.timeoutMs = Number(config.timeoutMs || 15000);
  }

  buildUrl(path, params = {}) {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
    return url.toString();
  }

  async request(path, params = {}) {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      const text = await response.text();
      let payload = {};

      if (text) {
        try {
          payload = JSON.parse(text);
        } catch (error) {
          payload = { raw: text };
        }
      }

      if (!response.ok) {
        const message = payload?.error?.message || `Deezer request failed (${response.status})`;
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
      }

      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  normalizeArtist(artist = {}) {
    if (!artist || typeof artist !== 'object') {
      return {
        id: null,
        name: 'Deezer artist',
        link: '',
        picture: '',
      };
    }

    return {
      id: artist.id ? String(artist.id) : null,
      name: artist.name || 'Deezer artist',
      link: artist.link || '',
      picture: artist.picture_medium || artist.picture_big || artist.picture_small || artist.picture || '',
    };
  }

  normalizeAlbum(album = {}) {
    if (!album || typeof album !== 'object') {
      return {
        id: null,
        title: 'Deezer album',
        cover: '',
        link: '',
      };
    }

    return {
      id: album.id ? String(album.id) : null,
      title: album.title || 'Deezer album',
      cover: album.cover_medium || album.cover_big || album.cover_small || album.cover || '',
      link: album.link || '',
    };
  }

  normalizeTrack(track = {}) {
    const previewUrl = typeof track.preview === 'string' && track.preview.trim() ? track.preview.trim() : null;

    return {
      id: track.id ? String(track.id) : null,
      title: track.title || 'Untitled track',
      artist: this.normalizeArtist(track.artist),
      album: this.normalizeAlbum(track.album),
      duration: Number(track.duration) || 0,
      explicit: Boolean(track.explicit_lyrics),
      preview: {
        available: Boolean(previewUrl),
        url: previewUrl,
      },
      provider: 'deezer',
      link: track.link || '',
      deezerUrl: track.link || '',
      artwork: track.album?.cover_medium || track.album?.cover_big || track.album?.cover_small || track.album?.cover || '',
      genre: track.genre || null,
      releaseDate: track.release_date || null,
    };
  }

  async searchTracks(query, limit = 5) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) {
      return { query: cleanQuery, total: 0, results: [] };
    }

    const payload = await this.request('/search/track', {
      q: cleanQuery,
      limit,
    });

    const results = Array.isArray(payload?.data) ? payload.data.map((track) => this.normalizeTrack(track)) : [];

    return {
      query: cleanQuery,
      total: results.length,
      results,
    };
  }

  async searchArtists(query, limit = 5) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) {
      return { query: cleanQuery, total: 0, results: [] };
    }

    const payload = await this.request('/search/artist', {
      q: cleanQuery,
      limit,
    });

    const results = Array.isArray(payload?.data) ? payload.data.map((artist) => this.normalizeArtist(artist)) : [];

    return {
      query: cleanQuery,
      total: results.length,
      results,
    };
  }

  async getTrack(trackId) {
    if (!trackId) {
      throw new Error('A Deezer track id is required.');
    }

    const payload = await this.request(`/track/${encodeURIComponent(trackId)}`);
    return this.normalizeTrack(payload);
  }

  async getArtist(artistId) {
    if (!artistId) {
      throw new Error('A Deezer artist id is required.');
    }

    const payload = await this.request(`/artist/${encodeURIComponent(artistId)}`);
    return this.normalizeArtist(payload);
  }

  async getAlbum(albumId) {
    if (!albumId) {
      throw new Error('A Deezer album id is required.');
    }

    const payload = await this.request(`/album/${encodeURIComponent(albumId)}`);
    return this.normalizeAlbum(payload);
  }
}

const deezerProvider = new DeezerProvider();

module.exports = {
  DeezerProvider,
  deezerProvider,
};
