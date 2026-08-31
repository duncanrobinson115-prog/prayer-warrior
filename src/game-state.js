export function createPrayerDeck(prayers, random = Math.random) {
  const deck = prayers.map(({ id }) => id);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

export function drawNextPrayer(state, prayers, random = Math.random) {
  let deck = [...(state.deck ?? [])];
  if (deck.length === 0) {
    deck = createPrayerDeck(prayers, random);
    if (deck.length > 1 && deck[0] === state.currentId) {
      [deck[0], deck[1]] = [deck[1], deck[0]];
    }
  }
  const [currentId, ...remaining] = deck;
  return { ...state, currentId, deck: remaining };
}

export function normalisePersistedState(value) {
  const source = value && typeof value === 'object' ? value : {};
  const prayedCount = Number.isInteger(source.prayedCount) && source.prayedCount >= 0
    ? source.prayedCount
    : 0;
  const prayedIds = Array.isArray(source.prayedIds)
    ? source.prayedIds.filter((id) => typeof id === 'string')
    : [];
  const character = ['male', 'female'].includes(source.character) ? source.character : null;
  return { prayedCount, prayedIds, character };
}
