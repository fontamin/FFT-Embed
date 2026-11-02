# FFT-Embed

Put a short, live preview of **your own fonts** on your website, made with [Fontamin Font Tester](https://github.com/fontamin/FFT).

**Make your code here: <https://fft-embed.fontamin.com>**

Choose your font files (or give their URLs), pick the tabs, tests, OpenType features and the light and dark themes,
watch the live preview, then copy the code into your page. A chosen font file is only used in the preview until you
press **Add as Base64**; then it is inside the code. To change an embed later, paste its code into **Edit an existing embed** at the top
of the page. The page also keeps your last settings in your browser (**Start over** clears them).

## What visitors get

A light version of FFT (about 100 KB): your fonts, the Layout, Test, Variation, OpenType and About tabs (each one can be
turned off), the dark-mode button, and FFT's shortcuts: the mouse wheel over the menu switches tabs (after a click in
the tester, so scrolling your page is never caught), Shift + wheel changes the text size and Shift + Alt + wheel the
line height. Visitors can't add fonts, tests or OpenType features: you choose them.

The built-in tests are Farsi, Arabic, Quran and English. Your own tests are added with **Add**, or with
**Reshape & add**, which first turns Arabic letters into their presentation forms (isolated, initial, medial, final,
lam-alef), in case you use a subset version of a font (for example made with pyftsubset).

## The code

### Script (recommended)

```html
<div data-fft
     data-font="/fonts/MyFont-Regular.woff2 | /fonts/MyFont-Bold.woff2"
     data-label="My Font Regular | My Font Bold"
     data-tabs="font,layout,test"
     data-tests="My test | Farsi | English"
     data-height="560">
  <template data-fft-text data-name="My test">Your own sample text, as long as you like.</template>
</div>
<script src="https://fft-embed.fontamin.com/embed.js" async></script>
```

Your page downloads the fonts itself and hands them to the tester, so fonts on your own site need no CORS setup and
relative addresses work. A font can also be inside the code (the builder does this with the files you choose):

```html
<template data-fft-font data-name="MyFont.woff2" data-label="My Font">…base64…</template>
<template data-fft-font data-url="/fonts/Other.woff2" data-label="Other"></template>
```

One script serves every `data-fft` element on the page. From JavaScript:
`FFT.embed(element, { fonts: [{ url }, { file }, { buf, name }], tabs: 'font,test' })` returns the iframe.

### Plain iframe (for site builders that block scripts)

```html
<iframe src="https://fft-embed.fontamin.com/embed-frame.html#embed&font=https%3A%2F%2Fexample.com%2Fa.woff2&label=My%20Font&tabs=font,test"
        style="width:100%;height:560px;border:0" loading="lazy" allow="clipboard-write" title="Font tester"></iframe>
```

Here the tester downloads the fonts itself: the font server must send `Access-Control-Allow-Origin`, and only URLs can be used.

## Options

With the script they are `data-` attributes (`data-theme="Ocean"`); in an iframe they go after `#embed&` (`theme=Ocean`).

| Option | Values | Default |
|---|---|---|
| `font`, `label` | iframe: a font URL and its name, repeat both for more fonts (script: `data-font` and `data-label`, separated with `\|`) | — |
| `tabs` | any of `font,layout,test,variation,opentype,about` | all |
| `tab` | the tab that opens first | the first one |
| `text`, `textname` | iframe: one of your tests and its name, repeat both for more (script: `<template data-fft-text data-name="…">`) | — |
| `test` | the Test tab, in order, by name (your tests and built-in ones); repeat it (script: `data-tests="A \| B"`). `none` = an empty Test tab | your tests, then the built-in ones |
| `edit` | `0` = the text can't be edited | `1` |
| `features` | the OpenType tab shows only these features: `liga,kern:0,ss01:1` (`:1` / `:0` = on / off at start); `none` = no features | each font's own features |
| `theme` | which mode starts: `light`, `dark` or `auto` (the visitor's system setting) | `light` |
| `lighttheme` | the light mode: `Light, Material, Yellow, Mint` | `Light` |
| `darktheme` | the dark mode: `Dark, Night, Ocean, Terminal` | `Dark` |
| `lightcolors`, `darkcolors` | 6 hex colors without `#` (text,bg,accent,footer,chip,box), instead of a preset | — |
| `themetoggle` | `0` = no dark-mode button | `1` |
| `fontname` | `0` = no font name above the text | `1` |
| `info` | `0` = no info line (font details, CSS) at the bottom | `1` |
| `size` | text size in px (10–250) | `26` |
| `lh` | line height (1–2) | `1.5` |
| `align` | `left, right, center, justify` | the text's own |
| `scale` | UI scale (0.2–5) | `1` |
| `height` | script only: frame height (px or any CSS length) | `560` |
| `width` | script only: empty = the width of the parent element, or px / any CSS length (never wider than the parent) | parent |
| `position` | script only: `start`, `center` or `end`, for a frame narrower than its parent | `start` |
| `title` | script only: the frame's title | `Font tester` |

## Talking to the embed (postMessage)

```js
const frame = document.querySelector('[data-fft] iframe');
frame.contentWindow.postMessage({ fft: 'fonts', fonts: [{ buf: arrayBuffer, name: 'B.woff2', label: 'B' }, { url: 'https://…', label: 'C' }] }, '*');
frame.contentWindow.postMessage({ fft: 'text', text: 'New text' }, '*');
frame.contentWindow.postMessage({ fft: 'theme', theme: 'Ocean' }, '*');
frame.contentWindow.postMessage({ fft: 'size', value: 48 }, '*');
// the embed sends { fft: 'hello' } when it starts, { fft: 'ready', fonts: n } when the fonts are in
// and { fft: 'tab', tab } when another tab is opened
```

## Notes

- Everything a visitor changes in the tester lives only until the page is closed; nothing is saved anywhere.
- woff2 fonts work everywhere: browsers that can't decode their tables themselves get `brotli.js` (about 180 KB, once).
- If a font can't be loaded, visitors see "The font couldn’t be loaded."; the builder's preview shows the reason (CORS, wrong URL, not a font file).
- **Disclaimer:** Base64 can be decoded: a font put in the code this way is not protected from being copied. If your font is commercial and this is a concern, use a version made for testing (for example a subset or a demo version).
- Fonts inside the code (Base64) are about a third bigger than the file. For large fonts, use woff2, or put the file on your site and give its URL.
- Older codes with one `theme` (a preset name such as `Ocean`) or `colors` still work: that theme is used for its mode and starts.

## Files in this repository

| File | What it is |
|---|---|
| `index.html` | the builder (the page that makes the code) |
| `embed.js` | the loader that the script code points to |
| `embed-frame.html`, `embed-frame.css`, `embed-frame.js` | the tester inside the frame |
| `brotli.js` | Google's Brotli decoder ([google/brotli](https://github.com/google/brotli), MIT), loaded only by browsers that can't decode woff2 tables themselves (e.g. Chrome on Android) |

The three `embed-frame` files and `brotli.js` are **built** from the full app in the [FFT repository](https://github.com/fontamin/FFT):
there, run `node embed/build-embed.mjs`, then copy `embed-frame.html`, `embed-frame.css`, `embed-frame.js` and `brotli.js` here.
Change them in FFT, not here. `embed.js` and `index.html` (`embed-builder.html` in FFT) are edited in FFT too and copied here.

## License

[MIT](LICENSE) © fontamin. `brotli.js` is © Google, MIT (its license is at the top of the file).
