import { prayers, sourceNote } from './prayers.js';
import { drawNextPrayer, normalisePersistedState } from './game-state.js';

const STORAGE_KEY = 'prayer-warrior-state-v1';
const selectionScreen = document.querySelector('#selection-screen');
const gameScreen = document.querySelector('#game-screen');
const title = document.querySelector('#prayer-title');
const category = document.querySelector('#prayer-category');
const prayerText = document.querySelector('#prayer-text');
const prayedButton = document.querySelector('#prayed-button');
const nextButton = document.querySelector('#next-button');
const response = document.querySelector('#response');
const character = document.querySelector('[data-testid="character"]');
const count = document.querySelector('[data-testid="prayed-count"]');
const sourceToggle = document.querySelector('#source-toggle');
const sourcePanel = document.querySelector('#source-note');
const characterSprite = document.querySelector('.character-sprite');

function loadState() {
  try {
    return normalisePersistedState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return normalisePersistedState(null);
  }
}

let state = { ...loadState(), deck: [], currentId: null };

function characterAsset(praying = false) {
  const suffix = praying ? '-praying' : '';
  return `${import.meta.env.BASE_URL}assets/warrior-${state.character}${suffix}.png`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    prayedCount: state.prayedCount,
    prayedIds: state.prayedIds,
    character: state.character
  }));
}

function renderPrayer() {
  const prayer = prayers.find(({ id }) => id === state.currentId);
  if (!prayer) return;
  category.textContent = prayer.category;
  title.textContent = prayer.title;
  prayerText.textContent = prayer.text;
  prayerText.parentElement.scrollTop = 0;
}

function receivePrayer() {
  state = drawNextPrayer(state, prayers);
  renderPrayer();
  response.hidden = true;
  prayedButton.hidden = false;
  prayedButton.disabled = false;
  nextButton.hidden = true;
  character.dataset.state = 'ready';
  characterSprite.src = characterAsset(false);
  requestAnimationFrame(() => prayedButton.focus());
}

function enterRoom(choice) {
  state.character = choice;
  character.classList.toggle('character--female', choice === 'female');
  character.classList.toggle('character--male', choice === 'male');
  characterSprite.src = `${import.meta.env.BASE_URL}assets/warrior-${choice}.png`;
  selectionScreen.hidden = true;
  gameScreen.hidden = false;
  count.textContent = String(state.prayedCount);
  saveState();
  receivePrayer();
}

function completePrayer() {
  if (prayedButton.disabled) return;
  prayedButton.disabled = true;
  state.prayedCount += 1;
  if (!state.prayedIds.includes(state.currentId)) state.prayedIds.push(state.currentId);
  count.textContent = String(state.prayedCount);
  character.dataset.state = 'praying';
  characterSprite.src = characterAsset(true);
  response.hidden = false;
  prayedButton.hidden = true;
  nextButton.hidden = false;
  saveState();
  window.setTimeout(() => nextButton.focus(), 350);
}

document.querySelectorAll('[data-character-choice]').forEach((button) => {
  button.addEventListener('click', () => enterRoom(button.dataset.characterChoice));
});

prayedButton.addEventListener('click', completePrayer);
nextButton.addEventListener('click', receivePrayer);
document.querySelector('#change-character').addEventListener('click', () => {
  gameScreen.hidden = true;
  selectionScreen.hidden = false;
  document.querySelector(`[data-character-choice="${state.character ?? 'male'}"]`).focus();
});

sourcePanel.textContent = sourceNote;
sourceToggle.addEventListener('click', () => {
  const expanded = sourceToggle.getAttribute('aria-expanded') === 'true';
  sourceToggle.setAttribute('aria-expanded', String(!expanded));
  sourcePanel.hidden = expanded;
});
