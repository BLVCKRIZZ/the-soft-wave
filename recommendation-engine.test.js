const test = require('node:test');
const assert = require('node:assert/strict');

const {
  rankTrackMatches,
  addTrackToPlaylist,
  buildTrackFeedbackKey,
} = require('./recommendation-engine.js');

test('rankTrackMatches favors vibe-fit deep cuts before obvious radio hits', () => {
  const tracks = [
    { title: 'Love', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/1' } },
    { title: 'MUTT', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/2' } },
    { title: 'My Muse', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/3' } },
    { title: 'MUTT (CB REMIX)', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/4' } },
  ];

  const ranked = rankTrackMatches(tracks, 'Leon Thomas');
  assert.ok(ranked[0].title === 'MUTT' || ranked[0].title === 'My Muse');
  assert.ok(!ranked.some((track) => track.title === 'MUTT (CB REMIX)'));
  assert.ok(ranked.length <= 5);
});

test('rankTrackMatches rotates recently suggested tracks out of the top results', () => {
  const tracks = [
    { title: 'Midnight Drive', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/1' } },
    { title: 'Quiet Thing', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/2' } },
    { title: 'Afterglow', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/3' } },
    { title: 'Late Bloom', artist: { name: 'Leon Thomas' }, preview: { available: true, url: 'https://example.com/4' } },
  ];

  const ranked = rankTrackMatches(tracks, 'Leon Thomas', {}, { recentlySuggested: ['leon-thomas::midnight-drive', 'leon-thomas::quiet-thing'] });

  assert.ok(ranked.slice(0, 2).every((track) => !['Midnight Drive', 'Quiet Thing'].includes(track.title)));
  assert.ok(ranked.length <= 5);
});

test('addTrackToPlaylist rejects duplicates and accepts new songs', () => {
  const playlist = {
    id: 'p1',
    title: 'Late Night',
    tracks: [{ artist: 'Leon Thomas', track: 'My Muse' }],
  };

  const duplicate = addTrackToPlaylist(playlist, { artist: 'Leon Thomas', track: 'My Muse' });
  const added = addTrackToPlaylist(playlist, { artist: 'Leon Thomas', track: 'MUTT' });

  assert.equal(duplicate.added, false);
  assert.equal(added.added, true);
  assert.equal(playlist.tracks.length, 2);
  assert.equal(buildTrackFeedbackKey({ artist: 'Leon Thomas', track: 'My Muse' }), 'leon-thomas::my-muse');
});
