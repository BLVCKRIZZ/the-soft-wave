const { deezerProvider } = require('../providers/deezer');

function registerDeezerRoutes(app) {
  app.get('/api/deezer/health', (req, res) => {
    const configured = Boolean(process.env.DEEZER_APP_ID || process.env.DEEZER_APP_SECRET || process.env.DEEZER_API_BASE);
    res.json({
      ok: true,
      provider: 'deezer',
      publicApiAccess: true,
      envConfigured: configured,
      previewMode: 'official-preview-only',
    });
  });

  app.get('/api/deezer/search', async (req, res) => {
    const query = String(req.query.q || req.query.query || '').trim();
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10);

    if (!query) {
      return res.json({ query, total: 0, results: [] });
    }

    try {
      const data = await deezerProvider.searchTracks(query, limit);
      return res.json(data);
    } catch (error) {
      console.error('Deezer search failed:', error);
      return res.status(error.status || 502).json({
        error: 'Deezer search unavailable',
        message: error.message || 'The Deezer provider is temporarily unavailable.',
        query,
        results: [],
        total: 0,
      });
    }
  });

  app.get('/api/deezer/artist/search', async (req, res) => {
    const query = String(req.query.q || req.query.query || '').trim();
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10);

    if (!query) {
      return res.json({ query, total: 0, results: [] });
    }

    try {
      const data = await deezerProvider.searchArtists(query, limit);
      return res.json(data);
    } catch (error) {
      console.error('Deezer artist search failed:', error);
      return res.status(error.status || 502).json({
        error: 'Deezer artist search unavailable',
        message: error.message || 'The Deezer artist provider is temporarily unavailable.',
        query,
        results: [],
        total: 0,
      });
    }
  });

  app.get('/api/deezer/track/:id', async (req, res) => {
    const trackId = String(req.params.id || '').trim();

    if (!trackId) {
      return res.status(400).json({ error: 'Missing Deezer track id.' });
    }

    try {
      const track = await deezerProvider.getTrack(trackId);
      return res.json({
        ok: true,
        provider: 'deezer',
        track,
      });
    } catch (error) {
      console.error('Deezer track lookup failed:', error);
      return res.status(error.status || 502).json({
        error: 'Deezer track unavailable',
        message: error.message || 'The Deezer track could not be loaded.',
      });
    }
  });

  app.get('/api/deezer/artist/:id', async (req, res) => {
    const artistId = String(req.params.id || '').trim();

    if (!artistId) {
      return res.status(400).json({ error: 'Missing Deezer artist id.' });
    }

    try {
      const artist = await deezerProvider.getArtist(artistId);
      return res.json({ ok: true, provider: 'deezer', artist });
    } catch (error) {
      console.error('Deezer artist lookup failed:', error);
      return res.status(error.status || 502).json({
        error: 'Deezer artist unavailable',
        message: error.message || 'The Deezer artist data could not be loaded.',
      });
    }
  });

  app.get('/api/deezer/album/:id', async (req, res) => {
    const albumId = String(req.params.id || '').trim();

    if (!albumId) {
      return res.status(400).json({ error: 'Missing Deezer album id.' });
    }

    try {
      const album = await deezerProvider.getAlbum(albumId);
      return res.json({ ok: true, provider: 'deezer', album });
    } catch (error) {
      console.error('Deezer album lookup failed:', error);
      return res.status(error.status || 502).json({
        error: 'Deezer album unavailable',
        message: error.message || 'The Deezer album data could not be loaded.',
      });
    }
  });
}

module.exports = {
  registerDeezerRoutes,
};
