# Prayer Warrior 1.0

**Play:** <https://duncanrobinson115-prog.github.io/prayer-warrior/>

A small, local-first VGA-style prayer practice. Choose a male or female character, receive a prayer, pray it, press **PRAYED**, and receive another prayer.

## Run

```bash
npm install
npm start
```

Open <http://127.0.0.1:5173>.

## Verify

```bash
npm run test:all
npm run build
```

For deterministic desktop and mobile screenshots, run the Vite server on port 4173 and then:

```bash
npm run capture
```

## Content and formation guardrails

- Prayer text comes **only** from *The Book of Common Prayer (1662)*, using the 1762 Baskerville printing supplied for development.
- The BCP 2019 is not used.
- Long `ſ` is rendered as modern `s`; otherwise the selected prayers retain the source wording.
- The counter records completed practice. It does not score prayer or measure spiritual maturity.
- State remains in browser `localStorage`; there is no account, analytics or cloud service.

## Assets

- `public/assets/prayer-room.png` is an original AI-generated VGA-style background created for this project.
- Character art is built from original HTML/CSS shapes and animation.
