# Embed Prayer Warrior in Squarespace

Add a **Code Block** to a full-width Squarespace section and paste:

```html
<div class="prayer-warrior-embed">
  <iframe
    src="https://duncanrobinson115-prog.github.io/prayer-warrior/"
    title="Prayer Warrior — Old School Prayer Room"
    loading="lazy"
    allow="fullscreen"
  ></iframe>
</div>

<style>
  .prayer-warrior-embed {
    width: 100%;
    height: min(900px, 90vh);
    min-height: 700px;
    overflow: hidden;
    background: #0d0914;
    border: 0;
  }

  .prayer-warrior-embed iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }

  @media (max-width: 767px) {
    .prayer-warrior-embed {
      height: 820px;
      min-height: 820px;
    }
  }
</style>
```

The game is hosted separately on GitHub Pages. Updates deployed there appear automatically inside Squarespace; the embed code does not need to be replaced.
