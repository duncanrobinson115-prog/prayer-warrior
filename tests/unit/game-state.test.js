import test from 'node:test';
import assert from 'node:assert/strict';
import { createPrayerDeck, drawNextPrayer, normalisePersistedState } from '../../src/game-state.js';

const sample = [
  { id: 'a', title: 'A' },
  { id: 'b', title: 'B' },
  { id: 'c', title: 'C' }
];

test('createPrayerDeck includes every prayer exactly once', () => {
  const deck = createPrayerDeck(sample, () => 0.5);
  assert.equal(deck.length, sample.length);
  assert.deepEqual([...deck].sort(), ['a', 'b', 'c']);
});

test('drawNextPrayer avoids an immediate repeat when reshuffling', () => {
  const state = { deck: [], currentId: 'c', prayedIds: ['a', 'b', 'c'], prayedCount: 3 };
  const next = drawNextPrayer(state, sample, () => 0.5);
  assert.notEqual(next.currentId, 'c');
  assert.equal(next.deck.length, 2);
});

test('normalisePersistedState rejects corrupt values and preserves valid progress', () => {
  assert.deepEqual(normalisePersistedState({ prayedCount: -4, character: 'wizard' }), {
    prayedCount: 0,
    prayedIds: [],
    character: null
  });
  assert.deepEqual(normalisePersistedState({ prayedCount: 4, prayedIds: ['a'], character: 'female' }), {
    prayedCount: 4,
    prayedIds: ['a'],
    character: 'female'
  });
});
