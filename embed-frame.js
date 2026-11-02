(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EMBED = (() => {
const p = new URLSearchParams(location.search);
new URLSearchParams(location.hash.slice(1)).forEach((v, k) => p.append(k, v));
const list = k => (p.get(k) || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const off = k => /^(0|false|no|off)$/i.test(p.get(k) || '');
const num = k => { const v = parseFloat(p.get(k)); return isFinite(v) ? v : null; };
return {
tabs: list('tabs'), tab: (p.get('tab') || '').toLowerCase(),
fonts: p.getAll('font').map(s => s.trim()).filter(Boolean),
labels: p.getAll('label').map(s => s.trim()),
parent: p.has('pf'),
edit: !off('edit'), toggle: !off('themetoggle'), fontName: !off('fontname'), info: !off('info'),
debug: p.has('debug'),
features: !p.has('features') ? null : (p.get('features') || '').split(',').map(s => s.trim())
.map(s => s.match(/^([A-Za-z0-9]{4})(?::([01]))?$/)).filter(Boolean)
.map(m => ({ tag: m[1], on: m[2] == null ? null : m[2] === '1' })),
theme: p.get('theme') || '', colors: p.get('colors') || '',
lightTheme: p.get('lighttheme') || '', lightColors: p.get('lightcolors') || '',
darkTheme: p.get('darktheme') || '', darkColors: p.get('darkcolors') || '',
texts: p.getAll('text'), textNames: p.getAll('textname'),
order: p.getAll('test').map(s => s.trim().toLowerCase()).filter(Boolean),
tests: p.has('tests') ? list('tests') : null,
size: num('size'), lh: num('lh'), align: (p.get('align') || '').toLowerCase(),
scale: num('scale'), rows: num('rows')
};
})();
let embedFontFailed = false;
const localStorage = EMBED ? (() => {
const m = {};
Object.defineProperties(m, {
getItem: { value: k => Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null },
setItem: { value: (k, v) => { m[k] = String(v); } },
removeItem: { value: k => { delete m[k]; } }
});
return m;
})() : window.localStorage;
if (EMBED) {
document.documentElement.classList.add('fft-embed');
if (EMBED.parent) {
document.documentElement.classList.add('fft-wait');
setTimeout(() => document.documentElement.classList.remove('fft-wait'), 5000);
}
document.body.classList.remove('darkmode');
if (!EMBED.toggle) document.documentElement.classList.add('fft-notoggle');
if (!EMBED.fontName) document.documentElement.classList.add('fft-nofontname');
if (!EMBED.info) document.documentElement.classList.add('fft-noinfo');
if (EMBED.features) document.documentElement.classList.add('fft-ownfeat');
{
const fileDrag = e => { const t = e.dataTransfer && e.dataTransfer.types; return !!t && Array.prototype.some.call(t, x => x === 'Files' || x === 'application/x-moz-file' || x === 'text/uri-list'); };
['dragenter', 'dragover', 'drop'].forEach(t => window.addEventListener(t, e => { if (fileDrag(e)) { e.preventDefault(); e.stopImmediatePropagation(); } }, true));
}
window.addEventListener('hashchange', () => location.reload());
}
const MI = {
"close": "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
"edit": "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
"add": "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
"refresh": "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
"autorenew_off": "M 12 1 L 12 4 C 10.110532 4 8.3742676 4.6538475 7.0058594 5.7480469 L 4.3046875 3.1210938 L 2.9101562 4.5566406 L 19.695312 20.878906 L 21.089844 19.443359 L 18.388672 16.816406 C 19.399953 15.476516 20 13.808776 20 12 C 20 10.43 19.539766 8.9702344 18.759766 7.7402344 L 17.300781 9.1992188 C 17.740781 10.039219 18 10.99 18 12 C 18 13.264277 17.607243 14.438464 16.9375 15.40625 L 8.4570312 7.1582031 C 9.4501807 6.4295278 10.675372 6 12 6 L 12 9 L 16 5 L 12 1 z M 4.5957031 8.9667969 C 4.2122722 9.9022929 4 10.926005 4 12 C 4 13.57 4.4602344 15.029766 5.2402344 16.259766 L 6.6992188 14.800781 C 6.2492187 13.970781 6 13.01 6 12 C 6 11.487051 6.0640471 10.989138 6.1855469 10.513672 L 4.5957031 8.9667969 z M 12 15 L 8 19 L 12 23 L 12 20 C 13.153315 20 14.249979 19.757171 15.240234 19.318359 L 13.648438 17.769531 L 13.646484 17.769531 C 13.123132 17.918933 12.570852 18 12 18 L 12 15 z",
"autorenew": "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z",
"download": "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z",
"delete": "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
"folder_open": "M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z",
"casino": "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z",
"restart_alt": "M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z",
"expand_more": "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",
"expand_less": "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z",
"dark_mode": "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
"light_mode": "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
};
const MIX = {
rk_justify: '<path d="m 120,-120 v -80 h 254.57701 v 80 z m 0,-160 v -80 h 254.57701 v 80 z m 0,-160 v -80 h 254.57701 v 80 z m 0,-160 v -80 h 720 v 80 z m 0,-160 v -80 h 720 v 80 z"/><path d="m 538.69884,-99.607086 h 64.16171 V -221.30884 h 32.65169 q 50.00504,0.22833 78.09006,-28.08502 28.08502,-28.31336 28.08502,-77.6334 0,-50.23337 -28.08502,-77.63339 -27.85669,-27.40002 -78.09006,-27.40002 h -96.8134 z m 64.16171,-178.785134 v -96.58507 h 31.05336 q 23.97501,0 33.56502,12.78668 9.81834,12.55834 9.81834,35.62002 0,23.06169 -9.81834,35.62003 -9.59001,12.55834 -33.56502,12.55834 z m 82.20006,178.785134 h 71.24005 l -66.44504,-149.786774 -69.41339,-0.685 z m 111.19841,0 h 64.16171 V -215.82884 l 162.34517,-216.23183 h -73.9801 l -88.13674,128.32343 v -128.32343 h -64.39004 z m 157.77845,0 h 71.92503 L 899.69409,-306.93391 863.16073,-258.5272 Z" transform="scale(0.83005909,1.2047335)"/>',
rk_settings: '<path d="m 120,-120 v -80 h 273.31888 v 80 z m 0,-160 v -80 h 273.31888 v 80 z m 0,-160 v -80 h 273.31888 v 80 z m 0,-160 v -80 h 720 v 80 z m 0,-160 v -80 h 720 v 80 z"/><path d="m 606,-120 -12,-60 c -8,-3.33333 -15.5,-6.83333 -22.5,-10.5 -7,-3.66667 -14.16667,-8.16667 -21.5,-13.5 l -58,18 -40,-68 46,-40 c -1.33333,-8.66667 -2,-17.33333 -2,-26 0,-8.66667 0.66667,-17.33333 2,-26 l -46,-40 40,-68 58,18 c 7.33333,-5.33333 14.5,-9.83333 21.5,-13.5 7,-3.66667 14.5,-7.16667 22.5,-10.5 l 12,-60 h 80 l 12,60 c 8,3.33333 15.5,6.83333 22.5,10.5 7,3.66667 14.16667,8.16667 21.5,13.5 l 58,-18 40,68 -46,40 c 1.33333,8.66667 2,17.33333 2,26 0,8.66667 -0.66667,17.33333 -2,26 l 46,40 -40,68 -58,-18 c -7.33333,5.33333 -14.5,9.83333 -21.5,13.5 -7,3.66667 -14.5,7.16667 -22.5,10.5 l -12,60 z m 96.5,-143.5 c 15.66667,-15.66667 23.5,-34.5 23.5,-56.5 0,-22 -7.83333,-40.83333 -23.5,-56.5 C 686.83333,-392.16667 668,-400 646,-400 c -22,0 -40.83333,7.83333 -56.5,23.5 -15.66667,15.66667 -23.5,34.5 -23.5,56.5 0,22 7.83333,40.83333 23.5,56.5 15.66667,15.66667 34.5,23.5 56.5,23.5 22,0 40.83333,-7.83333 56.5,-23.5 z"/>'
};
const icn = n => MIX[n]
? '<svg class="mi" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">' + MIX[n] + '</svg>'
: '<svg class="mi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + MI[n] + '"/></svg>';
const setBtn = (b, label, name) => { b.textContent = label; b.insertAdjacentHTML('beforeend', icn(name)); };
const target   = $('.dynamic');
const sizeIn   = $('#fontsizeinput');
const heightIn = $('#fontheightinput');
const axesBox  = $('#axes');
const featBox  = $('#features');
const listEl   = $('#fontlist');
const diceBtn  = $('#randbutton');
const showAll  = $('#showall');
const longNames = $('#longnames');
const NAMES_KEY = 'fft-featnames';
try { longNames.checked = localStorage.getItem(NAMES_KEY) === '1'; } catch (e) {}
const t1 = $('#text1'), t2 = $('#text2'), t3 = $('#text3');
const statusEl = $('#fontstatus');
const nameEl   = $('#fontname');
const AXIS_NAMES = {
wght: 'Weight', wdth: 'Width', ital: 'Italic', slnt: 'Slant',
opsz: 'Optical size', GRAD: 'Grade'
};
const FEATURE_NAMES = {
aalt: 'All Alternates', afrc: 'Alt Fractions', c2pc: 'Petite Caps from Caps',
c2sc: 'Small Caps from Caps', calt: 'Contextual Alternates', case: 'Case-Sensitive Forms',
clig: 'Contextual Ligatures', cpsp: 'Capital Spacing', cswh: 'Contextual Swash',
curs: 'Cursive Positioning', dlig: 'Discretionary Ligatures', dnom: 'Denominators',
expt: 'Expert Forms', falt: 'Final Alternates', fin2: 'Terminal Forms 2', fin3: 'Terminal Forms 3',
fina: 'Final Forms', frac: 'Fractions', hist: 'Historical Forms', hlig: 'Historical Ligatures',
hwid: 'Half Widths', init: 'Initial Forms', isol: 'Isolated Forms', ital: 'Italics',
kern: 'Kerning', liga: 'Standard Ligatures', lnum: 'Lining Figures', locl: 'Localized Forms',
mark: 'Mark Positioning', med2: 'Medial Forms 2', medi: 'Medial Forms', mkmk: 'Mark-to-Mark',
nalt: 'Alternate Annotation', numr: 'Numerators', onum: 'Oldstyle Figures', ordn: 'Ordinals',
ornm: 'Ornaments', palt: 'Proportional Alt Widths', pcap: 'Petite Capitals',
pnum: 'Proportional Figures', pwid: 'Proportional Widths', rclt: 'Required Contextual Alt',
rlig: 'Required Ligatures', rvrn: 'Required Variation Alt', salt: 'Stylistic Alternates',
sinf: 'Scientific Inferiors', smcp: 'Small Capitals', subs: 'Subscript', sups: 'Superscript',
swsh: 'Swash', titl: 'Titling', tnum: 'Tabular Figures', unic: 'Unicase',
zero: 'Slashed Zero', dist: 'Distances', ccmp: 'Composition/Decomposition',
vert: 'Vertical Alternates', vrt2: 'Vertical Rotation', trad: 'Traditional Forms',
smpl: 'Simplified Forms', ruby: 'Ruby Notation', ltra: 'Left-to-Right Alt', rtla: 'Right-to-Left Alt',
ltrm: 'Left-to-Right Mirrored', rtlm: 'Right-to-Left Mirrored', stch: 'Stretching Glyph'
};
const HIDDEN = new Set(['ccmp','locl','rlig','rvrn','abvm','blwm','abvs','blws','init','medi','fina',
'isol','fin2','fin3','med2','half','nukt','akhn','rphf','pref','blwf','pstf','pres','psts','haln',
'cjct','vatu','abvf','rkrf','ljmo','vjmo','tjmo','dtls','ltra','ltrm','rtla','rtlm','stch','rand']);
const DEFAULT_ON = new Set([...HIDDEN, 'kern','liga','clig','calt','rclt','mark','mkmk','curs','dist']);
const BROTLI = (() => { try { new DecompressionStream('brotli'); return true; } catch (e) { return false; } })();
const BROTLI_SRC = 'brotli.js?v=1.0-c4b865ec';
let brotliLoad = null;
const loadBrotli = () => brotliLoad || (brotliLoad = new Promise((ok, fail) => {
if (window.BrotliDecode) { ok(window.BrotliDecode); return; }
const sc = document.createElement('script');
sc.src = BROTLI_SRC;
sc.onload = () => window.BrotliDecode ? ok(window.BrotliDecode) : fail(new Error('no BrotliDecode'));
sc.onerror = () => { brotliLoad = null; fail(new Error('brotli.js not loaded')); };
document.head.appendChild(sc);
}));
const COMMON = ['kern','liga','calt','clig','dlig','smcp','c2sc','onum','lnum','pnum','tnum',
'frac','zero','sups','subs','ss01','ss02','ss03'];
const CHIP_MAX = 30;
let info = { axes: [], features: [] };
const axisVals = {};
const featOn = {};
let bubbles = [];
const fonts = [];
let active = null;
let guidesOn = false;
let gRaf = 0;
let counter = 0;
const cleanId = s => s.replace(/\W/g, '_');
const featName = tag => {
if (FEATURE_NAMES[tag]) return FEATURE_NAMES[tag];
let m = /^ss(\d\d)$/.exec(tag); if (m) return 'Style Set ' + +m[1];
m = /^cv(\d\d)$/.exec(tag);     if (m) return 'Char Variant ' + +m[1];
return tag;
};
const axisLabel = a => AXIS_NAMES[a.tag] || a.name || a.tag;
const setStatus = s => { statusEl.textContent = s || ''; };
const titleOf = r => r.name + (r.version ? ' v' + r.version : '');
const chipLabel = r => r.system ? 'Fallback font' : shorten(r.label || (EMBED ? r.name : r.file), CHIP_MAX);
const shorten = (s, n) => {
const a = [...s];
return a.length > n ? a.slice(0, n - 1).join('') + '…' : s;
};
const baseName = n => n.replace(/\.[^.]+$/, '');
const tab1Row = $('.pc-tab section .tab1');
const setText = (el, s) => { if (el.textContent !== s) el.textContent = s; };
let lastLay = '', lastVar = null, lastFeat = null, applyRaf = 0;
function updateT3() {
setText(t3, `font-size: ${+sizeIn.value}px; line-height: ${+heightIn.value}em;`);
}
function queueApply() {
if (applyRaf) return;
applyRaf = requestAnimationFrame(() => { applyRaf = 0; applyStyles(); syncInstances(); });
}
function applyStyles() {
const fs = +sizeIn.value, fh = +heightIn.value;
const lay = fs + '|' + fh, layoutChanged = lay !== lastLay;
if (layoutChanged) {
lastLay = lay;
target.style.fontSize = fs + 'px';
target.style.lineHeight = fh + 'em';
}
let chg = layoutChanged;
const v = info.axes.map(a => `"${a.tag}" ${axisVals[a.tag]}`).join(', ');
if (v !== lastVar) {
chg = true;
lastVar = v;
target.style.fontVariationSettings = v || 'normal';
setText(t1, `font-variation-settings: ${v || 'normal'};`);
}
const f = [];
Object.keys(featOn).forEach(tag => {
if (featOn[tag] !== DEFAULT_ON.has(tag)) f.push(`"${tag}" ${featOn[tag] ? 1 : 0}`);
});
const fset = f.join(', ');
if (fset !== lastFeat) {
chg = true;
lastFeat = fset;
target.style.fontFeatureSettings = fset || 'normal';
setText(t2, `font-feature-settings: ${fset || 'normal'};`);
}
updateT3();
scheduleGuides();
}
function attachBubble(slider, fmt) {
const b = document.createElement('span');
b.className = 'slider-value';
slider.parentElement.style.position = 'relative';
slider.parentElement.appendChild(b);
let w = 0;
const upd = remeasure => {
const min = parseFloat(slider.min) || 0, max = parseFloat(slider.max) || 100;
const val = parseFloat(slider.value);
const half = 15;
if (remeasure === true || !w) w = slider.offsetWidth;
b.textContent = fmt ? fmt(val) : String(+val.toFixed(2));
if (!w) return;
let px = ((val - min) / ((max - min) || 1)) * (w - 30) + half;
b.style.left = Math.min(w - half, Math.max(half, px)) + 'px';
};
slider.addEventListener('input', () => upd());
bubbles.push({ slider, upd });
upd(true);
}
function updateBubbles() {
bubbles = bubbles.filter(x => x.slider.isConnected);
bubbles.forEach(x => x.upd(true));
}
function makeSlider({ id, label, min, max, step, value, onInput }) {
const p = document.createElement('p'); p.className = 'font-slider';
const l = document.createElement('label'); l.textContent = label;
const span = document.createElement('span');
const inp = document.createElement('input');
inp.type = 'range'; inp.className = 'slider'; inp.id = id; inp.autocomplete = 'off';
inp.min = min; inp.max = max; inp.step = step; inp.value = value;
inp.style.height = '4px';
inp.addEventListener('input', () => onInput(+inp.value));
span.appendChild(inp); p.append(l, span);
return { p, inp };
}
const hint = (box, text) => {
const s = document.createElement('span'); s.className = 'nohint'; s.textContent = text;
box.appendChild(s);
};
const scrollMem = {};
const secEl = () => $('.pc-tab > section');
function swapScroll(from, to, pos) {
scrollMem[from] = pos;
secEl().scrollLeft = scrollMem[to] || 0;
}
const axisGlobal = {};
function buildAxes() {
axesBox.textContent = '';
Object.keys(axisVals).forEach(k => delete axisVals[k]);
diceBtn.style.display = info.axes.length ? '' : 'none';
if (!info.axes.length) {
hint(axesBox, embedFontFailed && info.generic ? 'The font couldn’t be loaded.'
: info.noBrotli ? 'This browser can’t read the axes of a woff2 font. Use the woff, ttf or otf version of the font.'
: info.generic ? 'The axes of this font couldn’t be read' : 'No variable axes in this font');
updateBubbles(); return;
}
info.axes.forEach(a => {
const step = (a.max - a.min) > 10 ? 1 : 0.01;
const g = axisGlobal[a.tag];
const start = g != null ? Math.min(a.max, Math.max(a.min, g)) : a.def;
axisVals[a.tag] = start;
const { p, inp } = makeSlider({
id: 'ax_' + cleanId(a.tag), label: axisLabel(a) + ':',
min: a.min, max: a.max, step, value: start,
onInput: v => { axisVals[a.tag] = axisGlobal[a.tag] = v; queueApply(); }
});
axesBox.appendChild(p);
attachBubble(inp);
});
requestAnimationFrame(updateBubbles);
}
const customFeats = [];
function buildFeatures() {
if (EMBED && EMBED.features) { buildOwnerFeatures(); return; }
featBox.textContent = '';
const pool = showAll.checked && info.generic ? [...new Set([...info.features, ...HIDDEN])].sort() : info.features;
const list = pool.filter(t => showAll.checked || !HIDDEN.has(t));
const nHidden = info.generic ? HIDDEN.size : info.features.filter(t => HIDDEN.has(t)).length;
const allLb = $('label[for="showall"]');
allLb.textContent = nHidden ? 'All +' + nHidden : 'All';
allLb.classList.toggle('zero', !nHidden);
allLb.title = !nHidden ? 'This font has no hidden shaping features, so All has nothing more to show'
: info.generic ? 'Font tables unreadable: showing a generic list of shaping features'
: 'Also show the ' + nHidden + ' shaping features hidden by default (init, medi, fina, ccmp, locl…)';
const mine = customFeats.map(f => f.tag);
const have = new Set(pool);
const carried = Object.keys(featOn).filter(t => featOn[t] !== DEFAULT_ON.has(t) && !have.has(t) && !mine.includes(t)).sort();
const tags = [...list.filter(t => !mine.includes(t)), ...carried, ...mine];
if (!tags.length) { hint(featBox, 'No OpenType features'); return; }
tags.forEach(tag => {
const cf = customFeats.find(f => f.tag === tag);
if (!(tag in featOn)) featOn[tag] = cf ? cf.on : DEFAULT_ON.has(tag);
const p = document.createElement('p'); p.className = 'font-slider' + (carried.includes(tag) ? ' carried' : '');
if (carried.includes(tag)) p.title = 'Not in this font: kept from another font';
const cb = document.createElement('input');
cb.type = 'checkbox'; cb.className = 'hidden'; cb.id = 'f_' + cleanId(tag);
cb.autocomplete = 'off'; cb.checked = featOn[tag];
cb.addEventListener('change', () => { featOn[tag] = cb.checked; applyStyles(); });
const lb = document.createElement('label');
const full = featName(tag) === tag ? tag : `${featName(tag)} · ${tag}`;
lb.htmlFor = cb.id;
lb.textContent = longNames.checked ? full : tag;
lb.title = full;
p.append(cb, lb);
featBox.appendChild(p);
});
}
function buildOwnerFeatures() {
featBox.textContent = '';
const have = new Set(info.features);
if (!EMBED.features.length) { hint(featBox, 'No OpenType features'); return; }
EMBED.features.forEach(({ tag, on }) => {
if (!(tag in featOn)) featOn[tag] = on == null ? DEFAULT_ON.has(tag) : on;
const absent = !info.generic && !have.has(tag);
const p = document.createElement('p'); p.className = 'font-slider' + (absent ? ' carried' : '');
if (absent) p.title = 'Not in this font';
const cb = document.createElement('input');
cb.type = 'checkbox'; cb.className = 'hidden'; cb.id = 'f_' + cleanId(tag);
cb.autocomplete = 'off'; cb.checked = featOn[tag];
cb.addEventListener('change', () => { featOn[tag] = cb.checked; applyStyles(); });
const lb = document.createElement('label');
const full = featName(tag) === tag ? tag : `${featName(tag)} · ${tag}`;
lb.htmlFor = cb.id; lb.textContent = longNames.checked ? full : tag; lb.title = full;
p.append(cb, lb);
featBox.appendChild(p);
});
}
function postFeatures() {
if (!EMBED) return;
const own = fonts.filter(r => !r.system && r.info && !r.info.generic);
const inFonts = new Set(own.flatMap(r => r.info.features || []));
const tags = [...new Set([...inFonts, ...(EMBED.features || []).map(f => f.tag)])].sort();
post({ fft: 'features', list: tags.map(t => ({ tag: t, name: featName(t), hidden: HIDDEN.has(t), on: DEFAULT_ON.has(t), found: inFonts.has(t) })) });
}
const instBox = $('#instances'), instToggle = $('#insttoggle'), tab2Row = $('.pc-tab section .tab2');
let backing = false;
function animTargets(g) {
return [g];
}
function slideIn(el) {
if (!el) return;
const cls = backing ? 'fadein' : 'slidein';
const targets = animTargets(el);
targets.forEach(t => t.classList.remove('slidein', 'fadein'));
void el.offsetWidth;
targets.forEach(t => t.classList.add(cls));
const done = () => targets.forEach(t => t.classList.remove(cls));
targets[0].addEventListener('animationend', done, { once: true });
setTimeout(done, 400);
}
const syncInstBtn = () => {
const n = (info.instances || []).length, on = tab2Row.classList.contains('instmode');
setBtn(instToggle, on ? 'Back' : n ? 'Instances · ' + n : 'Instances', on ? 'expand_more' : 'expand_less');
};
function syncInstances() {
(info.instances || []).forEach((ins, i) => {
const cb = document.getElementById('inst_' + i);
if (!cb) return;
cb.checked = info.axes.every(a => !(a.tag in ins.coords) ||
Math.abs(axisVals[a.tag] - ins.coords[a.tag]) <= ((a.max - a.min) > 10 ? 0.5001 : 0.0051));
});
}
function applyInstance(ins) {
info.axes.forEach(a => {
if (!(a.tag in ins.coords)) return;
const inp = $('#ax_' + cleanId(a.tag));
if (!inp) return;
inp.value = Math.min(a.max, Math.max(a.min, ins.coords[a.tag]));
inp.dispatchEvent(new Event('input'));
});
syncInstances();
}
function buildInstances() {
instBox.textContent = '';
const list = info.instances || [];
syncInstBtn();
if (!list.length) { hint(instBox, 'No named instances in this font'); return; }
list.forEach((ins, i) => {
const p = document.createElement('p'); p.className = 'font-slider';
const cb = document.createElement('input');
cb.type = 'checkbox'; cb.className = 'hidden'; cb.id = 'inst_' + i; cb.autocomplete = 'off';
cb.addEventListener('change', () => applyInstance(ins));
const lb = document.createElement('label');
lb.htmlFor = cb.id; lb.textContent = ins.name;
lb.title = Object.keys(ins.coords).map(t => t + ' ' + +ins.coords[t].toFixed(2)).join(', ');
p.append(cb, lb);
instBox.appendChild(p);
});
syncInstances();
}
instToggle.addEventListener('click', () => {
const before = secEl().scrollLeft;
const on = tab2Row.classList.toggle('instmode');
instToggle.classList.toggle('on', on);
syncInstBtn();
slideIn($(on ? '#instgroup' : '#axesgroup'));
on ? swapScroll('tab2', 'inst', before) : swapScroll('inst', 'tab2', before);
requestAnimationFrame(updateBubbles);
});
function setInfo(i) {
info = i;
buildAxes();
buildInstances();
buildFeatures();
applyStyles();
}
showAll.addEventListener('change', () => { buildFeatures(); applyStyles(); });
longNames.addEventListener('change', () => {
try { localStorage.setItem(NAMES_KEY, longNames.checked ? '1' : '0'); } catch (e) {}
buildFeatures(); applyStyles();
});
diceBtn.addEventListener('click', () => {
info.axes.forEach(a => {
const inp = $('#ax_' + cleanId(a.tag));
if (!inp) return;
inp.value = a.min + Math.random() * (a.max - a.min);
inp.dispatchEvent(new Event('input'));
});
});
const WANT = ['name', 'fvar', 'GSUB', 'GPOS', 'head', 'hhea', 'OS/2', 'cmap', 'maxp', 'post', 'CFF '];
const W2TAGS = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep',
'CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS',
'GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln',
'cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf',
'Silf','Glat','Gloc','Feat','Sill'];
const tag4 = (dv, o) => String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
async function inflate(u8, fmt) {
if (fmt === 'brotli' && !BROTLI) {
const dec = await loadBrotli();
const out = dec(new Int8Array(u8.buffer, u8.byteOffset, u8.byteLength));
return new Uint8Array(out.buffer, out.byteOffset, out.byteLength);
}
const s = new Blob([u8]).stream().pipeThrough(new DecompressionStream(fmt));
return new Uint8Array(await new Response(s).arrayBuffer());
}
const view = u8 => new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
async function readTables(buf) {
const dv = new DataView(buf), sig = tag4(dv, 0), T = {};
if (sig === 'wOFF') {
const n = dv.getUint16(12);
for (let i = 0; i < n; i++) {
const o = 44 + i * 20, t = tag4(dv, o);
if (!WANT.includes(t)) continue;
const off = dv.getUint32(o + 4), cl = dv.getUint32(o + 8), ol = dv.getUint32(o + 12);
let u8 = new Uint8Array(buf, off, cl);
if (cl < ol) u8 = await inflate(u8, 'deflate');
T[t] = view(u8);
}
} else if (sig === 'wOF2') {
const n = dv.getUint16(12), compSize = dv.getUint32(20);
let p = 48;
const b128 = () => {
let v = 0;
for (let i = 0; i < 5; i++) { const b = dv.getUint8(p++); v = v * 128 + (b & 127); if (!(b & 128)) break; }
return v;
};
const dir = [];
for (let i = 0; i < n; i++) {
const fl = dv.getUint8(p++), idx = fl & 63, ver = fl >> 6;
let tg;
if (idx === 63) { tg = tag4(dv, p); p += 4; } else tg = W2TAGS[idx];
const ol = b128(); let len = ol;
const gl = tg === 'glyf' || tg === 'loca';
if (gl ? ver === 0 : ver !== 0) len = b128();
dir.push({ tg, len });
}
const data = await inflate(new Uint8Array(buf, p, compSize), 'brotli');
let pos = 0;
dir.forEach(d => {
if (WANT.includes(d.tg)) T[d.tg] = new DataView(data.buffer, data.byteOffset + pos, d.len);
pos += d.len;
});
} else {
const base = sig === 'ttcf' ? dv.getUint32(12) : 0;
const n = dv.getUint16(base + 4);
for (let i = 0; i < n; i++) {
const o = base + 12 + i * 16, t = tag4(dv, o);
if (WANT.includes(t)) T[t] = new DataView(buf, dv.getUint32(o + 8), dv.getUint32(o + 12));
}
}
return T;
}
function nameReader(d) {
const cnt = d.getUint16(2), so = d.getUint16(4), recs = [];
for (let i = 0; i < cnt; i++) {
const o = 6 + i * 12;
recs.push({ p: d.getUint16(o), id: d.getUint16(o + 6), len: d.getUint16(o + 8), off: d.getUint16(o + 10) });
}
return id => {
const r = recs.find(x => x.id === id && x.p === 3) || recs.find(x => x.id === id && x.p === 1) || recs.find(x => x.id === id);
if (!r) return '';
let s = '';
if (r.p === 1) for (let i = 0; i < r.len; i++) s += String.fromCharCode(d.getUint8(so + r.off + i));
else for (let i = 0; i < r.len; i += 2) s += String.fromCharCode(d.getUint16(so + r.off + i));
return s;
};
}
function featureTags(d) {
const fl = d.getUint16(6), n = d.getUint16(fl), out = [];
for (let i = 0; i < n; i++) out.push(tag4(d, fl + 2 + i * 6));
return out;
}
function cleanVersion(s) {
return (s || '').replace(/^\s*version\s*/i, '').split(';')[0].trim();
}
const SKIP_CH = /[\p{Cc}\p{Cs}\p{Z}\p{Cf}\p{Cn}]/u;
function cmapChars(d) {
const set = new Set(), n = d.getUint16(2), seen = new Set(), map = new Map();
const add = (c, g) => {
if (c <= 0x10FFFF && g) map.set(c, g);
if (c < 32 || (c > 126 && c < 160) || (c >= 0xD800 && c <= 0xDFFF) || c > 0x10FFFF || (c & 0xFFFE) === 0xFFFE) return;
set.add(c);
};
for (let i = 0; i < n; i++) {
const pid = d.getUint16(4 + i * 8), eid = d.getUint16(6 + i * 8), off = d.getUint32(8 + i * 8);
if (!(pid === 0 || (pid === 3 && (eid === 1 || eid === 10))) || seen.has(off)) continue;
seen.add(off);
const fmt = d.getUint16(off);
if (fmt === 4) {
const sc = d.getUint16(off + 6) / 2, endO = off + 14, stO = endO + sc * 2 + 2, dlO = stO + sc * 2, roO = dlO + sc * 2;
for (let k = 0; k < sc; k++) {
const end = d.getUint16(endO + k * 2), st = d.getUint16(stO + k * 2);
const delta = d.getInt16(dlO + k * 2), ro = d.getUint16(roO + k * 2);
for (let c = st; c <= end && c < 0xFFFF; c++) {
let g;
if (ro === 0) g = (c + delta) & 0xFFFF;
else {
const p = roO + k * 2 + ro + (c - st) * 2;
if (p + 2 > d.byteLength) break;
g = d.getUint16(p); if (g) g = (g + delta) & 0xFFFF;
}
if (g) add(c, g);
}
}
} else if (fmt === 12) {
const ng = d.getUint32(off + 12);
for (let g = 0; g < ng; g++) {
const o = off + 16 + g * 12, st = d.getUint32(o), end = Math.min(d.getUint32(o + 4), 0x10FFFF), gid = d.getUint32(o + 8);
for (let c = st; c <= end; c++) if (gid + (c - st)) add(c, gid + (c - st));
}
}
}
return { chars: [...set].sort((a, b) => a - b).filter(c => !SKIP_CH.test(String.fromCodePoint(c))), map };
}
function gsubExtra(d, cmap, numGlyphs) {
const covered = new Set(cmap.values()), rev = new Map();
cmap.forEach((g, cp) => { if (!rev.has(g) || cp < rev.get(g)) rev.set(g, cp); });
const fl = d.getUint16(6), ll = d.getUint16(8), nf = d.getUint16(fl);
const POS = { init: 1, medi: 1, fina: 1, isol: 1 };
const reach = new Map(), subCache = {};
const cov = off => {
const f = d.getUint16(off), n = d.getUint16(off + 2), out = [];
if (f === 1) for (let i = 0; i < n; i++) out.push(d.getUint16(off + 4 + i * 2));
else for (let i = 0; i < n; i++) {
const o = off + 4 + i * 6, a = d.getUint16(o), b = d.getUint16(o + 2), si = d.getUint16(o + 4);
for (let g = a; g <= b; g++) out[si + g - a] = g;
}
return out;
};
const subsOf = i => {
if (subCache[i]) return subCache[i];
const lo = ll + d.getUint16(ll + 2 + i * 2), type = d.getUint16(lo), n = d.getUint16(lo + 4), out = [];
for (let k = 0; k < n; k++) {
let so = lo + d.getUint16(lo + 6 + k * 2), t = type;
if (type === 7) { t = d.getUint16(so + 2); so += d.getUint32(so + 4); }
out.push({ t, so });
}
return (subCache[i] = out);
};
const baseOf = g => rev.has(g) ? { s: String.fromCodePoint(rev.get(g)), f: {}, ctx: null } : (reach.get(g) || null);
const ok = g => g > 0 && !covered.has(g) && !reach.has(g) && (!numGlyphs || g < numGlyphs);
const make = (b, tag, v) => POS[tag] ? (b.ctx ? null : { s: b.s, f: b.f, ctx: tag })
: { s: b.s, f: Object.assign({}, b.f, { [tag]: v }), ctx: b.ctx };
const put = (g, b, tag, v) => { if (!ok(g) || !b) return; const r = make(b, tag, v); if (r) reach.set(g, r); };
for (let pass = 0; pass < 2; pass++) {
for (let fi = 0; fi < nf; fi++) {
const ro = fl + 2 + fi * 6, tag = tag4(d, ro), fo = fl + d.getUint16(ro + 4), nl = d.getUint16(fo + 2);
for (let li = 0; li < nl; li++) {
for (const { t, so } of subsOf(d.getUint16(fo + 4 + li * 2))) {
try {
if (t === 1) {
const f = d.getUint16(so), cv = cov(so + d.getUint16(so + 2));
if (f === 1) { const dl = d.getInt16(so + 4); cv.forEach(g => put((g + dl) & 0xFFFF, baseOf(g), tag, 1)); }
else { const n = d.getUint16(so + 4); for (let i = 0; i < n && i < cv.length; i++) put(d.getUint16(so + 6 + i * 2), baseOf(cv[i]), tag, 1); }
} else if (t === 3) {
const cv = cov(so + d.getUint16(so + 2)), n = d.getUint16(so + 4);
for (let i = 0; i < n; i++) {
const st = so + d.getUint16(so + 6 + i * 2), cnt = d.getUint16(st), b = baseOf(cv[i]);
for (let j = 0; j < cnt; j++) put(d.getUint16(st + 2 + j * 2), b, tag, j + 1);
}
} else if (t === 4 && pass === 0) {
const cv = cov(so + d.getUint16(so + 2)), n = d.getUint16(so + 4);
for (let i = 0; i < n; i++) {
const st = so + d.getUint16(so + 6 + i * 2), lc = d.getUint16(st), first = rev.get(cv[i]);
if (first == null) continue;
for (let j = 0; j < lc; j++) {
const lo2 = st + d.getUint16(st + 2 + j * 2), out = d.getUint16(lo2);
if (!ok(out)) continue;
const cc = d.getUint16(lo2 + 2);
let str = String.fromCodePoint(first), good = true;
for (let k = 0; k < cc - 1; k++) {
const c = rev.get(d.getUint16(lo2 + 4 + k * 2));
if (c == null) { good = false; break; }
str += String.fromCodePoint(c);
}
if (good) put(out, { s: str, f: {}, ctx: null }, tag, 1);
}
}
}
} catch (e) {}
}
}
}
}
const list = [...reach].sort((a, b) => a[0] - b[0]).slice(0, 4000).map(([g, r]) => ({ g, s: r.s, f: r.f, ctx: r.ctx }));
return { list, total: numGlyphs ? Math.max(list.length, numGlyphs - covered.size) : list.length };
}
const MAC = ('.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash ' +
'zero one two three four five six seven eight nine colon semicolon less equal greater question at ' +
'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z bracketleft backslash bracketright asciicircum underscore grave ' +
'a b c d e f g h i j k l m n o p q r s t u v w x y z braceleft bar braceright asciitilde ' +
'Adieresis Aring Ccedilla Eacute Ntilde Odieresis Udieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave ecircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve ocircumflex odieresis otilde uacute ugrave ucircumflex udieresis ' +
'dagger degree cent sterling section bullet paragraph germandbls registered copyright trademark acute dieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu partialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash ' +
'questiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft guillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash quotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis fraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered quotesinglbase quotedblbase perthousand ' +
'Acircumflex Ecircumflex Aacute Edieresis Egrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute Ucircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla hungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth eth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior onehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla Cacute cacute Ccaron ccaron dcroat').split(' ');
function postNames(d) {
const ver = d.getUint32(0), out = [];
if (ver === 0x00010000) { MAC.forEach((n, i) => { out[i] = n; }); return out; }
if (ver !== 0x00020000) return null;
const n = d.getUint16(32), idx = [], strs = [];
for (let i = 0; i < n; i++) idx.push(d.getUint16(34 + i * 2));
let p = 34 + n * 2;
while (p < d.byteLength) {
const l = d.getUint8(p++); let t = '';
for (let k = 0; k < l && p < d.byteLength; k++) t += String.fromCharCode(d.getUint8(p++));
strs.push(t);
}
idx.forEach((v, g) => { out[g] = v < 258 ? MAC[v] : (strs[v - 258] || ''); });
return out;
}
function cffNames(d) {
const index = p => {
const n = d.getUint16(p);
if (!n) return { it: [], end: p + 2 };
const os = d.getUint8(p + 2), base = p + 3 + (n + 1) * os - 1;
const off = i => { let v = 0; for (let k = 0; k < os; k++) v = v * 256 + d.getUint8(p + 3 + i * os + k); return v; };
const it = [];
for (let i = 0; i < n; i++) it.push([base + off(i), base + off(i + 1)]);
return { it, end: base + off(n) };
};
const nm = index(d.getUint8(2)), top = index(nm.end), st = index(top.end);
const dict = {}; let stack = [], p = top.it[0][0];
const e = top.it[0][1];
while (p < e) {
const b = d.getUint8(p++);
if (b <= 21) { dict[b === 12 ? 1200 + d.getUint8(p++) : b] = stack; stack = []; }
else if (b === 28) { stack.push(d.getInt16(p)); p += 2; }
else if (b === 29) { stack.push(d.getInt32(p)); p += 4; }
else if (b === 30) { while (p < e) { const v = d.getUint8(p++); if ((v & 15) === 15 || (v >> 4) === 15) break; } stack.push(0); }
else if (b >= 32 && b <= 246) stack.push(b - 139);
else if (b >= 247 && b <= 250) stack.push((b - 247) * 256 + d.getUint8(p++) + 108);
else if (b >= 251 && b <= 254) stack.push(-(b - 251) * 256 - d.getUint8(p++) - 108);
}
if (dict[1230] || !dict[17]) return null;
const ng = d.getUint16(dict[17][0]), co = dict[15] ? dict[15][0] : 0, sids = [0];
if (co <= 2) { for (let g = 1; g < ng; g++) sids[g] = g; }
else {
const f = d.getUint8(co); let q = co + 1;
if (f === 0) { for (let g = 1; g < ng; g++) { sids[g] = d.getUint16(q); q += 2; } }
else {
let g = 1;
while (g < ng) {
const first = d.getUint16(q); q += 2;
let left; if (f === 1) left = d.getUint8(q++); else { left = d.getUint16(q); q += 2; }
for (let k = 0; k <= left && g < ng; k++) sids[g++] = first + k;
}
}
}
const nameOf = sid => {
if (sid === 0) return '.notdef';
if (sid < 391) return sid <= 95 ? (sid === 8 ? 'quoteright' : sid === 65 ? 'quoteleft' : MAC[sid + 2]) : '';
const it = st.it[sid - 391]; if (!it) return '';
let t = ''; for (let i = it[0]; i < it[1]; i++) t += String.fromCharCode(d.getUint8(i));
return t;
};
return sids.map(nameOf);
}
async function parseFont(buf) {
const T = await readTables(buf);
const out = { name: '', version: '', axes: [], features: [] };
const names = T.name ? nameReader(T.name) : () => '';
out.name = (names(4) || names(16) || names(1) || '').trim();
out.version = cleanVersion(names(5));
if (T.fvar) {
const d = T.fvar, off = d.getUint16(4), cnt = d.getUint16(8), sz = d.getUint16(10);
const allTags = [];
for (let i = 0; i < cnt; i++) {
const o = off + i * sz;
allTags.push(tag4(d, o));
if (d.getUint16(o + 16) & 1) continue;
out.axes.push({
tag: tag4(d, o),
min: d.getInt32(o + 4) / 65536,
def: d.getInt32(o + 8) / 65536,
max: d.getInt32(o + 12) / 65536,
name: names(d.getUint16(o + 18))
});
}
out.instances = [];
try {
const ic = d.getUint16(12), isz = d.getUint16(14), io = off + cnt * sz;
for (let i = 0; i < ic; i++) {
const o = io + i * isz;
if (o + 4 + cnt * 4 > d.byteLength) break;
const coords = {};
allTags.forEach((tg, k) => { coords[tg] = d.getInt32(o + 4 + k * 4) / 65536; });
out.instances.push({ name: names(d.getUint16(o)) || 'Instance ' + (i + 1), coords });
}
} catch (e) {}
}
const set = new Set();
['GSUB', 'GPOS'].forEach(t => { try { if (T[t]) featureTags(T[t]).forEach(x => set.add(x)); } catch (e) {} });
out.features = [...set].sort();
if (T.cmap) {
try {
const cm = cmapChars(T.cmap);
out.chars = cm.chars;
out.gids = Uint16Array.from(cm.chars, c => cm.map.get(c));
out.bases = [0x25CC, 0x640, 0xA0, 0x20, 0x627].filter(c => cm.map.has(c));
if (T.GSUB) out.extra = gsubExtra(T.GSUB, cm.map, T.maxp ? T.maxp.getUint16(4) : 0);
} catch (e) {}
}
try { out.names = (T.post && postNames(T.post)) || (T['CFF '] && cffNames(T['CFF '])) || null; } catch (e) {}
try {
const tab = {};
if (T.head) tab.upm = T.head.getUint16(18);
if (T.hhea) { tab.hAsc = T.hhea.getInt16(4); tab.hDesc = T.hhea.getInt16(6); }
const os = T['OS/2'];
if (os && os.byteLength >= 90 && os.getUint16(0) >= 2) { tab.xh = os.getInt16(86); tab.cap = os.getInt16(88); }
out.tab = tab;
} catch (e) {}
return out;
}
function renderList() {
$('.tab5').classList.toggle('nofonts', fonts.filter(r => !r.system).length < 2);
listEl.textContent = '';
if (!fonts.length) { hint(listEl, 'No fonts — drop files here'); return; }
const ownerFonts = EMBED && fonts.some(r => !r.system);
fonts.forEach(r => {
if (ownerFonts && r.system) return;
const chip = document.createElement('span');
chip.className = 'chip' + (r === active ? ' active' : '');
const nb = document.createElement('button');
nb.type = 'button'; nb.className = 'chipname';
nb.textContent = chipLabel(r);
nb.title = r.system ? 'Fallback font: the browser\'s default font' : r.file + ' — ' + titleOf(r);
nb.addEventListener('click', () => { if (r !== active) activate(r); });
chip.appendChild(nb);
nb.classList.add('nox');
listEl.appendChild(chip);
});
revealAfterPack('#fontlist .chip.active');
}
function activate(rec) {
active = rec;
target.style.fontFamily = rec.css;
nameEl.textContent = titleOf(rec);
document.title = rec.system ? 'Fontamin Font Tester' : titleOf(rec) + ' – FFT';
setInfo(rec.info);
setStatus(rec.status);
renderList();
}
async function getBuf(src, fresh) {
if (src.url) {
const r = await fetch(src.url, fresh ? { cache: 'reload' } : undefined);
if (!r.ok) throw new Error(r.status);
return r.arrayBuffer();
}
return src.file.arrayBuffer();
}
function measureMetrics(cssFamily, tab) {
const SZ = 1000;
const cx = measureMetrics.cx || (measureMetrics.cx = document.createElement('canvas').getContext('2d'));
const mt = (ch, fb) => { cx.font = `${SZ}px ${cssFamily}, ${fb}`; return cx.measureText(ch); };
const asc = chars => Math.max(...[...chars].map(c => mt(c, 'monospace').actualBoundingBoxAscent)) / SZ;
const desc = chars => Math.max(...[...chars].map(c => mt(c, 'monospace').actualBoundingBoxDescent)) / SZ;
let latin = false;
try {
latin = [...'lxHgp'].every(c => {
const a = mt(c, 'monospace'), b = mt(c, 'serif');
return a.width === b.width && a.actualBoundingBoxAscent === b.actualBoundingBoxAscent;
});
} catch (e) {}
const u = tab && tab.upm;
if (latin) {
return {
asc: asc('bdfhklt'), desc: desc('gjpqy'),
xh: asc('x') || (u && tab.xh ? tab.xh / u : 0), cap: asc('H') || (u && tab.cap ? tab.cap / u : 0)
};
}
if (u && tab.hAsc != null) {
return { asc: tab.hAsc / u, desc: -tab.hDesc / u, xh: tab.xh ? tab.xh / u : 0, cap: tab.cap ? tab.cap / u : 0 };
}
return null;
}
async function makeFace(buf, fileName) {
const family = 'TestFont' + (++counter);
const face = new FontFace(family, buf.slice(0));
await face.load();
let parsed = null, note = '', noBrotli = false;
try { parsed = await parseFont(buf); }
catch (e) {
const woff2 = tag4(new DataView(buf), 0) === 'wOF2';
noBrotli = woff2 && !BROTLI && !window.BrotliDecode;
note = noBrotli
? ' — this browser can\'t decode woff2 (no Brotli): generic features shown, use ttf/otf/woff for the real list'
: ' — could not read font tables, showing generic features';
}
document.fonts.add(face);
const name = (parsed && parsed.name) || baseName(fileName);
const version = (parsed && parsed.version) || '';
return {
family, css: `"${family}", sans-serif`, face, file: fileName, name, version,
metrics: measureMetrics(`"${family}"`, parsed && parsed.tab),
info: parsed
? { axes: parsed.axes, instances: parsed.instances, features: parsed.features, chars: parsed.chars, extra: parsed.extra, bases: parsed.bases, gids: parsed.gids, names: parsed.names }
: { generic: true, axes: [], features: COMMON, noBrotli },
status: parsed
? `${name}${version ? ' v' + version : ''}: ${parsed.axes.length} axes, ${parsed.features.length} features`
: `${name}${note}`
};
}
async function addFont(buf, fileName, src, label, quiet) {
const m = await makeFace(buf, fileName);
const rec = { id: ++counter, src, ...m };
if (label) rec.label = label;
fonts.push(rec);
if (quiet) renderList(); else activate(rec);
return rec;
}
async function loadURL(url, label, quiet) {
if (!url) return null;
setStatus('Fetching…');
const src = { url };
let buf;
try { buf = await getBuf(src, false); }
catch (e) { setStatus('Fetch failed (CORS or wrong URL)'); return; }
try {
let nm = 'Font';
try { nm = decodeURIComponent(url.split('?')[0].split('#')[0].split('/').pop() || 'Font'); }
catch (e) { nm = url.split('?')[0].split('/').pop() || 'Font'; }
return await addFont(buf, nm, src, label, quiet);
} catch (e) { setStatus('Not a valid font file'); return null; }
}
function addSystemFont() {
const css = 'system-ui, sans-serif';
const rec = {
id: ++counter, system: true, family: 'system-ui', css, face: null, file: 'Fallback font', name: 'Fallback font',
version: '', src: null,
info: { generic: true, axes: [], features: COMMON },
status: '',
metrics: measureMetrics(css, null)
};
fonts.unshift(rec);
activate(rec);
}
sizeIn.addEventListener('input', queueApply);
heightIn.addEventListener('input', queueApply);
attachBubble(sizeIn);
attachBubble(heightIn);
const neg = $('#negative');
let fadeTimer = 0;
function fadeTheme() {
const root = document.documentElement;
root.classList.add('themefade');
void root.offsetWidth;
clearTimeout(fadeTimer);
fadeTimer = setTimeout(() => root.classList.remove('themefade'), 700);
}
try { if (localStorage.getItem('fft-dark') === '1') { neg.checked = true; document.body.classList.add('darkmode'); } } catch (e) {}
neg.addEventListener('change', () => { if (!flipping) fadeTheme(); });
neg.addEventListener('change', () => {
document.body.classList.toggle('darkmode', neg.checked);
try { localStorage.setItem('fft-dark', neg.checked ? '1' : '0'); } catch (e) {}
});
$('#outline').addEventListener('change', e => document.body.classList.toggle('outline', e.target.checked));
const FIELDS = ['text', 'bg', 'accent', 'footer', 'chip', 'box'];
const DEFAULT_THEME = {
light: { text: '#222222', bg: '#f6f6f6', accent: '#ff4242', footer: '#ffffff', chip: '#ececee', box: '#f0f0f0' },
dark:  { text: '#f5f5f5', bg: '#222222', accent: '#ff4242', footer: '#000000', chip: '#111111', box: '#2e2e2e' }
};
const PRESET_COLORS = [
{ name: 'Light',    mode: 'light', ...DEFAULT_THEME.light },
{ name: 'Material', mode: 'light', text: '#1d1b20', bg: '#fef7ff', accent: '#6750a4', footer: '#f3edf7', chip: '#e8def8', box: '#ece6f0' },
{ name: 'Yellow',   mode: 'light', text: '#000000', bg: '#ede8e2', accent: '#000000', footer: '#efb11e', chip: '#efb11e', box: '#ede8e2' },
{ name: 'Mint',     mode: 'light', text: '#1f3d2b', bg: '#e8f5ec', accent: '#2f9e5b', footer: '#dcefe2', chip: '#cfe7d8', box: '#d8ecdf' },
{ name: 'Dark',     mode: 'dark',  ...DEFAULT_THEME.dark },
{ name: 'Night',    mode: 'dark',  text: '#e6e6e6', bg: '#000000', accent: '#ffffff', footer: '#0a0a0a', chip: '#161616', box: '#1a1a1a' },
{ name: 'Ocean',    mode: 'dark',  text: '#d6e6ff', bg: '#10233f', accent: '#4dabf7', footer: '#0b1a30', chip: '#17325a', box: '#173055' },
{ name: 'Terminal', mode: 'dark',  text: '#33ff66', bg: '#0b0b0b', accent: '#33ff66', footer: '#000000', chip: '#0f1f12', box: '#0f1a11' }
];
const hexOk = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v.trim());
const isDarkHex = h => {
const n = parseInt(h.slice(1), 16);
return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255 < 0.5;
};
const relLum = h => {
const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const n = parseInt(h.slice(1), 16);
return 0.2126 * f(n >> 16 & 255) + 0.7152 * f(n >> 8 & 255) + 0.0722 * f(n & 255);
};
const onColor = h => { const L = relLum(h); return 1.05 / (L + 0.05) > (L + 0.05) / 0.05 ? '#ffffff' : '#000000'; };
const hx2 = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
const mixHex = (a, b, t) => {
const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
return '#' + A.map((v, i) => hx2(v + (B[i] - v) * t)).join('');
};
const themeColors = { light: { ...DEFAULT_THEME.light }, dark: { ...DEFAULT_THEME.dark } };
const curMode = () => document.body.classList.contains('darkmode') ? 'dark' : 'light';
let flipping = false;
function paint(c) {
const ffg = isDarkHex(c.footer) ? '#f5f5f5' : '#222222';
const cfg = isDarkHex(c.chip) ? '#aaaaaa' : '#222222';
const vars = {
'--text': c.text, '--bg': c.bg,
'--accent': c.accent, '--accent-bg': c.accent + '22', '--on-accent': onColor(c.accent),
'--selection': mixHex(c.accent, '#ffffff', 0.33),
'--footer': c.footer, '--footer-fg': ffg, '--nav-fg': ffg + '77',
'--line': mixHex(c.footer, ffg, 0.35), '--track': mixHex(c.footer, ffg, 0.2),
'--chip': c.chip, '--chip-fg': cfg, '--chip-hover': mixHex(c.chip, cfg, 0.12),
'--box': c.box, '--box-fg': isDarkHex(c.box) ? '#f5f5f5' : '#222222'
};
Object.keys(vars).forEach(k => document.body.style.setProperty(k, vars[k]));
document.documentElement.style.backgroundColor = c.bg;
applyStyles();
}
function forceDark(dark) {
if (neg.checked === dark) return;
flipping = true; neg.checked = dark; neg.dispatchEvent(new Event('change')); flipping = false;
}
function setColors(c) { forceDark(isDarkHex(c.bg)); paint(c); }
const applyThemeColors = () => paint(themeColors[curMode()]);
neg.addEventListener('change', () => { if (!flipping) applyThemeColors(); });
let uiScale = 1;
function setScale(v) {
uiScale = Math.min(5, Math.max(0.2, +v || 1));
document.documentElement.style.zoom = uiScale === 1 ? '' : uiScale;
requestAnimationFrame(() => { updateBubbles(); scheduleGuides(); });
}
function revealAfterPack(sel) {
const el = [...secEl().querySelectorAll(sel)].find(e => e.offsetWidth > 0);
if (el) (el.closest('.font-slider') || el).scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
const testBox = $('#Test');
const boxP = box => box && box.querySelector('p[contenteditable]');
function setBoxText(p, text) {
p.textContent = '';
text.split('\n').forEach((line, i) => {
if (i) p.appendChild(document.createElement('br'));
p.appendChild(document.createTextNode(line));
});
}
function showPlain(box, text) {
box.innerHTML = '<p contenteditable="true" dir="auto" style="text-align:start;"></p>';
setBoxText(boxP(box), text);
}
const SVGNS = 'http://www.w3.org/2000/svg';
const guideSvg = document.createElementNS(SVGNS, 'svg');
guideSvg.id = 'guidesvg'; guideSvg.setAttribute('aria-hidden', 'true'); guideSvg.style.display = 'none';
const gSolid = document.createElementNS(SVGNS, 'path'), gDash = document.createElementNS(SVGNS, 'path');
gDash.id = 'guidedash';
guideSvg.append(gSolid, gDash);
target.appendChild(guideSvg);
const baseCache = {};
function baseRatio(ff) {
if (baseCache[ff] != null) return baseCache[ff];
const d = document.createElement('div');
d.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-size:1000px;line-height:normal;font-family:' + ff;
d.innerHTML = '<span>x</span><span style="display:inline-block;width:0;height:0"></span>';
document.body.appendChild(d);
const a = d.firstChild.getBoundingClientRect(), b = d.lastChild.getBoundingClientRect();
d.remove();
return (baseCache[ff] = (b.bottom - a.top) / 1000);
}
function clearGuides() { gSolid.setAttribute('d', ''); gDash.setAttribute('d', ''); }
function drawGuides() {
if (!guidesOn) return;
const m = active && active.metrics;
const box = testBox;
if (!m || !box) { clearGuides(); return; }
const dyn = target.getBoundingClientRect();
const styles = new Map();
const line = (x1, x2, y) => 'M' + x1.toFixed(1) + ' ' + (Math.round(y) + 0.5) + 'H' + x2.toFixed(1);
let solid = '', dash = '';
const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
const range = document.createRange();
for (let n; (n = walker.nextNode());) {
if (!/\S/.test(n.nodeValue) || !n.parentElement) continue;
let cs = styles.get(n.parentElement);
if (!cs) {
const c = getComputedStyle(n.parentElement);
cs = { fs: parseFloat(c.fontSize), ff: c.fontFamily, ok: c.fontFamily.includes(active.family) };
styles.set(n.parentElement, cs);
}
if (!cs.ok) continue;
const ratio = baseRatio(cs.ff);
range.selectNodeContents(n);
const lines = new Map();
for (const r of range.getClientRects()) {
if (!r.width) continue;
const k = Math.round(r.top * 2) + ':' + Math.round(r.height * 2);
const g = lines.get(k);
if (g) { g.l = Math.min(g.l, r.left); g.r = Math.max(g.r, r.right); } else lines.set(k, { t: r.top, l: r.left, r: r.right });
}
const cell = n.parentElement.closest('.glyph');
const cr = cell ? cell.getBoundingClientRect() : null;
for (const g of lines.values()) {
const yb = (g.t - dyn.top) / uiScale + ratio * cs.fs;
const x1 = ((cr ? cr.left : g.l) - dyn.left) / uiScale, x2 = ((cr ? cr.right : g.r) - dyn.left) / uiScale;
if (m.asc)  solid += line(x1, x2, yb - m.asc * cs.fs);
if (m.desc) solid += line(x1, x2, yb + m.desc * cs.fs);
if (m.xh)   dash  += line(x1, x2, yb - m.xh * cs.fs);
if (m.cap)  dash  += line(x1, x2, yb - m.cap * cs.fs);
}
}
gSolid.setAttribute('d', solid);
gDash.setAttribute('d', dash);
}
function scheduleGuides() {
if (!guidesOn || gRaf) return;
gRaf = requestAnimationFrame(() => { gRaf = 0; drawGuides(); });
}
const guideChk = $('#guidetoggle');
guideChk.addEventListener('change', () => {
guidesOn = guideChk.checked;
guideSvg.style.display = guidesOn ? '' : 'none';
if (guidesOn) drawGuides(); else clearGuides();
});
new MutationObserver(scheduleGuides).observe(target, { childList: true, subtree: true, characterData: true });
if (window.ResizeObserver) new ResizeObserver(scheduleGuides).observe(target);
window.addEventListener('resize', scheduleGuides);
if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', scheduleGuides);
let curAlign = '';
$$('input[name="align"]').forEach(r => r.addEventListener('click', () => {
if (curAlign === r.value) { r.checked = false; curAlign = ''; }
else curAlign = r.value;
target.classList.remove('al-right', 'al-center', 'al-left', 'al-justify');
if (curAlign) target.classList.add('al-' + curAlign);
scheduleGuides();
}));
const toast = $('#div2');
function flash(msg) {
toast.textContent = msg || 'Copied';
toast.className = 'show';
setTimeout(() => { toast.className = 'hide'; }, 2000);
}
const Z = '\u200c';
const TXT_FA = 'فرهنگ نوشتاری هر جامعه، بازتابی از شیوه‌ی اندیشیدن(thinking)، احساسات(emotions) و تعاملات اجتماعی(Social interactions) آن است. نوشتن(writing) فقط ثبت کلمات لازم روی کاغذ یا صفحه‌ی نمایش نیست؛ بلکه نوعی ارتباط (communication) عمیق میان نویسنده و خواننده است. در جوامع گوناگون، این ارتباط می‌تواند رسمی، شاعرانه، انتقادی یا حتی طنزآمیز باشد. برای مثال، در فرهنگ ایرانی نوشتار اغلب با نوعی احساس بالا همراه است؛ چه در نامه‌های قدیمی، چه در پیام‌های امروزی در شبکه‌های اجتماعی. این احساس‌گرایی سبب می‌شود نوشته‌ها نه تنها معنا بلکه «روح» نیز داشته باشند. در مقابل، در فرهنگ‌های غربی، به‌ویژه در academic writing، دقت منطقی و استدلالی اهمیت بیشتری دارد. هدف انتقال داده‌ها و مفاهیم با وضوح و ساختار بدون آلایش است، نه لزوماً با احساس. این تفاوت باعث می‌شود که وقتی متنی ترجمه یا بین فرهنگی جابه‌جا می‌شود، بخشی از بار فرهنگی و احساسی آن گم شود. امروزه با گسترش ارتباطات دیجیتال، مرز میان سبک‌های نوشتاری در حال تغییر است. ایموجی‌ها، لحن غیررسمی و اختصارها نوعی زبان جهانی جدید ساخته‌اند. با این حال، ریشه‌ی هر نوشتار در فرهنگ همان جامعه باقی می‌ماند؛ جایی که واژه‌ها نه فقط معنی، بلکه هویت دارند.';
const TXT_AR = [
'الفولاذ الدمشقي أو الفولاذ المدمشق هو نوع من الفولاذ المستخدم لصناعة نصل السيوف، والذي اشتهرت به مدينة دمشق وإليها ينسب. كانت السيوف الدمشقية تصنع من الفولاذ الهندواني (فولاذ بلاد الهند)؛ وكانت تتميّز بنقوشها الفريدة المبرقشة والمحزّمة؛ كما أنّها اشتهرت بصرامتها ومقاومتها للاهتراء، وبقابلية الشحذ والسَّنّ إلى حدّ مطواع شديد القطع. نال السيف الدمشقي شهرةً واسعةً عبر التاريخ، وأحاطت به العديد من القصص والروايات، كالقدرة على قطع شعرةٍ ساقطةٍ على نصله.',
'سمّي هذا النوع من الفولاذ بالدمشقي نسبة إلى العاصمة السورية دمشق، والتي كانت هذه السيوف تصنع وتباع فيها، كما أنّ النموذج النمطي المميّز لها أصبح مشهوراً بشكل أصبح يطلق تسميته أيضاً على أيّ فولاذٍ يحمل تلك المواصفات، مثلما هو الحال مع زخارف البروكار الدمشقي.كانت صناعة السيوف الدمشقية حرفةً يحوطها الكثير من السرّية، وكان المهرة من الحرفيين يتناقلونها من جيلٍ إلى جيل، إلى أن اندثرت، ولا يوجد تدوينات للطريقة الأصلية التي كانت تستخدم في الماضي.',
'رغم اختلاف المواد الأولية المستخدمة وطرق وتقنيات التصنيع إلّا أنّه جرت محاولات حديثة لكشف سر التركيب وطريقة التحضير؛ إذ بيّنت الأبحاث باستخدام وسائل تقنية حديثة وجود أسلاك وأنابيب نانوية كربونية في تركيب سيفٍ مصنوعٍ من الفولاذ الدمشقي. وخلصت الدراسات أنّه خلال عملية الصهر لتشكيل صبّات الفولاذ الهندواني المستخدم في صناعة السيوف الدمشقية كانت أجزاء نباتية معروفة من الأوراق والأغصان الخشبية تضاف بمقدارٍ محدّدٍ إلى الخلطة، وذلك كمصدر كربوني، بالإضافة إلى استخدام أنواع من الخامات الغنيّة بالحديد والمشوبة بعناصر كيميائية أخرى؛ وفي مرحلة لاحقة كانت الصبّات تخضع للتطريق وتشكّل على هيئة أنصال. على الرغم من أنّه توجد حالياً أنواع تفوق الفولاذ الدمشقي القديم في أدائها، إلّا أنّ التفاعلات الكيميائية المرافقة لعملية التصنيع آنذاك جعلت السيوف الدمشقية مميّزة عن أقرانها في عصرها، إذ كان الفولاذ الدمشقي فائق اللدونة وفائق الصلابة في نفس الوقت.'
].join('\n');
const TXT_QURAN = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n' + [
'وَالْفَجْرِ ﴿۱﴾', 'وَلَيَالٍ عَشْرٍ ﴿۲﴾', 'وَالشَّفْعِ وَالْوَتْرِ ﴿۳﴾', 'وَاللَّيْلِ إِذَا يَسْرِ ﴿۴﴾',
'هَلْ فِي ذَلِكَ قَسَمٌ لِذِي حِجْرٍ ﴿۵﴾', 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِعَادٍ ﴿۶﴾',
'إِرَمَ ذَاتِ الْعِمَادِ ﴿۷﴾', 'الَّتِي لَمْ يُخْلَقْ مِثْلُهَا فِي الْبِلَادِ ﴿۸﴾',
'وَثَمُودَ الَّذِينَ جَابُوا الصَّخْرَ بِالْوَادِ ﴿۹﴾', 'وَفِرْعَوْنَ ذِي الْأَوْتَادِ ﴿۱۰﴾',
'الَّذِينَ طَغَوْا فِي الْبِلَادِ ﴿۱۱﴾', 'فَأَكْثَرُوا فِيهَا الْفَسَادَ ﴿۱۲﴾',
'فَصَبَّ عَلَيْهِمْ رَبُّكَ سَوْطَ عَذَابٍ ﴿۱۳﴾', 'إِنَّ رَبَّكَ لَبِالْمِرْصَادِ ﴿۱۴﴾',
'فَأَمَّا الْإِنْسَانُ إِذَا مَا ابْتَلَاهُ رَبُّهُ فَأَكْرَمَهُ وَنَعَّمَهُ فَيَقُولُ رَبِّي أَكْرَمَنِ ﴿۱۵﴾',
'وَأَمَّا إِذَا مَا ابْتَلَاهُ فَقَدَرَ عَلَيْهِ رِزْقَهُ فَيَقُولُ رَبِّي أَهَانَنِ ﴿۱۶﴾',
'كَلَّا بَلْ لَا تُكْرِمُونَ الْيَتِيمَ ﴿۱۷﴾', 'وَلَا تَحَاضُّونَ عَلَى طَعَامِ الْمِسْكِينِ ﴿۱۸﴾',
'وَتَأْكُلُونَ التُّرَاثَ أَكْلًا لَمًّا ﴿۱۹﴾', 'وَتُحِبُّونَ الْمَالَ حُبًّا جَمًّا ﴿۲۰﴾',
'كَلَّا إِذَا دُكَّتِ الْأَرْضُ دَكًّا دَكًّا ﴿۲۱﴾', 'وَجَاءَ رَبُّكَ وَالْمَلَكُ صَفًّا صَفًّا ﴿۲۲﴾',
'وَجِيءَ يَوْمَئِذٍ بِجَهَنَّمَ يَوْمَئِذٍ يَتَذَكَّرُ الْإِنْسَانُ وَأَنَّى لَهُ الذِّكْرَى ﴿۲۳﴾',
'يَقُولُ يَا لَيْتَنِي قَدَّمْتُ لِحَيَاتِي ﴿۲۴﴾', 'فَيَوْمَئِذٍ لَا يُعَذِّبُ عَذَابَهُ أَحَدٌ ﴿۲۵﴾',
'وَلَا يُوثِقُ وَثَاقَهُ أَحَدٌ ﴿۲۶﴾', 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ﴿۲۷﴾',
'ارْجِعِي إِلَى رَبِّكِ رَاضِيَةً مَرْضِيَّةً ﴿۲۸﴾', 'فَادْخُلِي فِي عِبَادِي ﴿۲۹﴾',
'وَادْخُلِي جَنَّتِي ﴿۳۰﴾'
].join(' ');
const TXT_EN = `Although typically applied to printed, published, broadcast, and reproduced materials in contemporary times, all words, letters, symbols, and numbers written alongside the earliest naturalistic drawings by humans may be called typography. The uneven spacing of the impressions on brick stamps found in the Mesopotamian cities of Uruk and Larsa, dating from the second millennium B.C., may be evidence of type, wherein the reuse of identical characters was applied to create cuneiform text. Babylonian cylinder seals were used to create an impression on a surface by rolling the seal on wet clay. Typography also was implemented in the Phaistos Disc, an enigmatic Minoan printed item from Crete, which dates to between 1850 and 1600 B.C. It has been proposed that Roman lead pipe inscriptions were created with movable type printing, but German typographer Herbert Brekle recently dismissed this view.(from Wikipedia)
0123456789!@#$%^&*()_+-={}[]:"'?/<>,.`;
const PRESETS = [
{ name: 'Farsi', text: TXT_FA,
author: 'AI',
about: 'Persian specimen: a paragraph about writing culture with mixed Persian and Latin words and parentheses, to check Latin/Persian mixing and running text.' },
{ name: 'Arabic', text: TXT_AR,
author: 'from Wikipedia', link: 'https://wikipedia.com',
about: 'Arabic specimen: three paragraphs about Damascus steel, taken from Wikipedia. Contains many diacritics (tashkeel), good for checking mark positioning.' },
{ name: 'Quran', text: TXT_QURAN,
author: 'Muhammad the prophet',
about: 'Quranic text: Surah Al-Fajr with full diacritics and verse-end markers, to check stacked marks and ayah numbers.' },
{ name: 'English', text: TXT_EN,
author: 'from Wikipedia', link: 'https://wikipedia.com',
about: 'English specimen about the origins of typography (from Wikipedia), followed by digits and common symbols.' },
];
let tests = [];
const normLink = v => {
v = typeof v === 'string' ? v.trim() : '';
if (!v) return '';
if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) v = 'https://' + v;
return /^https?:\/\/\S+$/i.test(v) ? v : '';
};
const cleanTest = t => {
const o = { name: t.name };
if (t.html) o.html = t.html; else o.text = t.text;
if (typeof t.about === 'string' && t.about.trim()) o.about = t.about.trim();
if (typeof t.author === 'string' && t.author.trim()) o.author = t.author.trim();
const l = normLink(t.link); if (l) o.link = l;
return o;
};
tests = PRESETS.map(cleanTest);
const testListEl = $('#testlist');
let activeTest = null;
const LAST_KEY = 'fft-lasttest';
const DEFAULT_TEST = 'Farsi';
function showTest(t) {
activeTest = t;
try { localStorage.setItem(LAST_KEY, t.name); } catch (e) {}
if (t.html) testBox.innerHTML = t.html;
else showPlain(testBox, t.text);
renderTests();
updateAbout();
}
const RTL_START = /^[^\p{L}\p{N}]*[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/u;
const sortTests = () => {
if (EMBED) return;
const grp = n => RTL_START.test(n) ? 1 : 0;
tests.sort((a, b) => {
const ga = grp(a.name), gb = grp(b.name);
if (ga !== gb) return ga - gb;
return a.name.localeCompare(b.name, ga ? 'fa' : 'en', { sensitivity: 'base', numeric: true });
});
};
function renderTests() {
sortTests();
testListEl.textContent = '';
if (!tests.length) hint(testListEl, 'No tests — add one or restore the built-in ones');
tests.forEach(t => {
const chip = document.createElement('span');
chip.className = 'chip' + (t === activeTest ? ' active' : '');
const nb = document.createElement('button');
nb.type = 'button'; nb.className = 'chipname';
nb.textContent = shorten(t.name, CHIP_MAX); nb.title = t.name;
nb.addEventListener('click', () => showTest(t));
chip.append(nb); nb.classList.add('nox');
testListEl.appendChild(chip);
});
}
function updateAbout() {}
function copyText(text) {
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
} else legacyCopy(text);
}
function legacyCopy(text) {
const el = document.createElement('textarea');
el.value = text; document.body.appendChild(el); el.select();
document.execCommand('copy'); el.remove();
}
[t1, t2, t3, statusEl].forEach(el => el.addEventListener('click', () => { copyText(el.textContent); flash(); }));
const section = $('.pc-tab > section');
['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'].forEach(id => {
const tab = document.getElementById(id);
tab.addEventListener('change', () => {
section.scrollLeft = 0;
if (!tab.checked) return;
const lb = $('.pc-tab nav .' + id + ' label');
if (lb) lb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
updateAbout();
requestAnimationFrame(updateBubbles);
if (id === 'tab5') requestAnimationFrame(renderList);
if (id === 'tab6') requestAnimationFrame(renderTests);
});
});
window.addEventListener('resize', updateBubbles);
const footerEl = $('footer');
let overFooter = false;
footerEl.addEventListener('mouseenter', () => { overFooter = true; });
footerEl.addEventListener('mouseleave', () => { overFooter = false; });
const TAB_ORDER = ['tab5', 'tab1', 'tab6', 'tab2', 'tab3', 'tab4'];
function stepTab(dir) {
const order = TAB_ORDER.filter(id => !$('.pc-tab nav li.' + id).classList.contains('fft-off'));
const cur = order.findIndex(id => document.getElementById(id).checked);
const next = (cur + dir + order.length) % order.length;
if (next !== cur) document.getElementById(order[next]).click();
}
function stepMenu(dir) {
const id = checkedTab();
if (dir > 0) {
if (id === 'tab2' && !tab2Row.classList.contains('instmode')) { instToggle.click(); return true; }
return false;
}
if (footBar.classList.contains('submenu')) { backBar.click(); return true; }
return false;
}
document.addEventListener('keydown', e => {
if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key) || !overFooter || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
const t = e.target;
if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && t.type !== 'range' && t.type !== 'radio' && t.type !== 'checkbox' && t.type !== 'color')) return;
if (document.querySelector('#testmodal.open, #colormodal.open')) return;
if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
if (stepMenu(e.key === 'ArrowUp' ? 1 : -1)) e.preventDefault();
return;
}
e.preventDefault();
stepTab(e.key === 'ArrowRight' ? 1 : -1);
});
let wheelAcc = 0, wheelLast = 0, wheelLock = 0;
let wheelArmed = !EMBED;
if (EMBED) {
document.addEventListener('pointerdown', () => { wheelArmed = true; }, true);
document.documentElement.addEventListener('mouseleave', () => { wheelArmed = false; });
window.addEventListener('blur', () => { wheelArmed = false; });
}
footerEl.addEventListener('wheel', e => {
if (!wheelArmed) return;
if (e.ctrlKey || e.metaKey || e.shiftKey || !e.deltaY || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
if (document.querySelector('#testmodal.open, #colormodal.open')) return;
e.preventDefault();
const now = performance.now();
if (now < wheelLock) return;
if (now - wheelLast > 200) wheelAcc = 0;
wheelLast = now;
wheelAcc += e.deltaY;
if (Math.abs(wheelAcc) < 40) return;
stepTab(wheelAcc > 0 ? 1 : -1);
wheelAcc = 0;
wheelLock = now + 150;
}, { passive: false });
let kwAcc = 0, kwLast = 0;
document.addEventListener('wheel', e => {
if (!e.shiftKey || e.ctrlKey || e.metaKey) return;
if (footerEl.contains(e.target)) return;
if (document.querySelector('#testmodal.open, #colormodal.open')) return;
const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
if (!d) return;
e.preventDefault();
const now = performance.now();
if (now - kwLast > 200) kwAcc = 0;
kwLast = now;
kwAcc += d;
const n = Math.trunc(kwAcc / 50);
if (!n) return;
kwAcc -= n * 50;
const sl = e.altKey ? heightIn : sizeIn;
const unit = e.altKey ? 0.02 : 1;
const min = parseFloat(sl.min), max = parseFloat(sl.max);
const v = Math.min(max, Math.max(min, Math.round((+sl.value - n * unit) * 100) / 100));
if (v === +sl.value) return;
sl.value = v;
sl.dispatchEvent(new Event('input'));
}, { passive: false });
(() => {
let down = false, moved = false, startX = 0, startLeft = 0;
section.addEventListener('mousedown', e => {
if (e.button !== 0) return;
if (e.target.closest('input[type=range], input[type=url], input[type=text], .right-side-header, .status')) return;
down = true; moved = false;
startX = e.clientX; startLeft = section.scrollLeft;
});
window.addEventListener('mousemove', e => {
if (!down) return;
const dx = e.clientX - startX;
if (!moved && Math.abs(dx) > 5) {
moved = true;
section.classList.add('dragging');
}
if (moved) {
section.scrollLeft = startLeft - dx;
e.preventDefault();
}
});
const end = () => {
if (!down) return;
down = false;
section.classList.remove('dragging');
setTimeout(() => { moved = false; }, 50);
};
window.addEventListener('mouseup', end);
window.addEventListener('blur', end);
section.addEventListener('click', e => {
if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
}, true);
section.addEventListener('dragstart', e => e.preventDefault());
})();
const footBar = $('footer');
const backBar = document.createElement('button');
backBar.id = 'backbar'; backBar.type = 'button'; backBar.innerHTML = icn('expand_more'); backBar.title = 'Back';
footBar.appendChild(backBar);
const tabRowIn = (id) => {
if (id === 'tab2') return tab2Row.classList.contains('instmode') ? instToggle : null;
return null;
};
const checkedTab = () => ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'].find(id => document.getElementById(id).checked);
const syncBack = () => footBar.classList.toggle('submenu', !!tabRowIn(checkedTab()));
const subGroup = () => $('#instgroup');
let finishBack = null;
backBar.addEventListener('click', () => {
if (backing) { if (finishBack) finishBack(); return; }
const id = checkedTab(), b = tabRowIn(id), g = subGroup(id);
if (!b) return;
backing = true;
let done = false;
const targets = animTargets(g);
const go = () => {
if (done) return;
done = true; finishBack = null;
targets.forEach(t => t.classList.remove('slideout'));
b.click();
setTimeout(() => { backing = false; }, 60);
};
finishBack = go;
targets.forEach(t => t.classList.add('slideout'));
setTimeout(go, 240);
});
['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'].forEach(id => document.getElementById(id).addEventListener('change', syncBack));
{
let tracking = false, sx = 0, sy = 0;
footBar.addEventListener('touchstart', e => {
tracking = false;
if (!footBar.classList.contains('submenu') || e.touches.length !== 1) return;
if (e.target.closest('input[type=range]')) return;
tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
}, { passive: true });
footBar.addEventListener('touchmove', e => {
if (!tracking) return;
const dy = e.touches[0].clientY - sy, dx = e.touches[0].clientX - sx;
if (dy > 22 && dy > Math.abs(dx) * 1.5) { tracking = false; backBar.click(); }
}, { passive: true });
['touchend', 'touchcancel'].forEach(t => footBar.addEventListener(t, () => { tracking = false; }, { passive: true }));
}
const modeObs = new MutationObserver(syncBack);
['.tab1', '.tab2', '.tab6'].forEach(q => modeObs.observe($('.pc-tab section ' + q), { attributes: true, attributeFilter: ['class'] }));
syncBack();
$('#tab5').checked = true;
section.scrollLeft = 0;
const TAB_ID = { font: 'tab5', layout: 'tab1', test: 'tab6', variation: 'tab2', opentype: 'tab3', about: 'tab4' };
if (EMBED) {
const order = Object.keys(TAB_ID);
const on = EMBED.tabs.filter(t => TAB_ID[t]);
const shown = on.length ? on : order;
order.forEach(t => {
if (shown.includes(t)) return;
$$('.pc-tab section .' + TAB_ID[t] + ', .pc-tab nav li.' + TAB_ID[t]).forEach(el => el.classList.add('fft-off'));
});
const first = shown.includes(EMBED.tab) ? EMBED.tab : order.find(t => shown.includes(t));
$('#' + TAB_ID[first]).checked = true;
order.forEach(t => $('#' + TAB_ID[t]).addEventListener('change', e => { if (e.target.checked) post({ fft: 'tab', tab: t }); }));
post({ fft: 'tab', tab: first });
if (shown.length === 1) document.documentElement.classList.add('fft-onetab');
}
addSystemFont();
applyThemeColors();
renderTests();
{
let last = '';
try { last = localStorage.getItem(LAST_KEY) || ''; } catch (e) {}
const start = tests.find(t => t.name === last) || tests.find(t => t.name === DEFAULT_TEST) || tests[0];
if (start) showTest(start);
else updateAbout();
}
let fontQueue = Promise.resolve();
if (EMBED) applyEmbed();
function embedTheme(theme, colorStr) {
let c = null;
const hex = (colorStr || '').split(',').map(v => '#' + v.trim().replace(/^#/, '').toLowerCase());
if (hex.length === FIELDS.length && hex.every(hexOk)) {
c = {}; FIELDS.forEach((k, i) => { c[k] = hex[i]; });
} else if (theme) {
const t = theme.trim().toLowerCase();
if (t === 'auto') {
const dark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
c = { ...DEFAULT_THEME[dark ? 'dark' : 'light'] };
} else {
const p = PRESET_COLORS.find(x => x.name.toLowerCase() === t);
if (p) { c = {}; FIELDS.forEach(k => { c[k] = p[k]; }); }
}
}
if (!c) return;
themeColors[isDarkHex(c.bg) ? 'dark' : 'light'] = { ...c };
setColors(c);
}
function themeOf(name, colorStr) {
const hex = (colorStr || '').split(',').map(v => '#' + v.trim().replace(/^#/, '').toLowerCase());
if (hex.length === FIELDS.length && hex.every(hexOk)) { const c = {}; FIELDS.forEach((k, i) => { c[k] = hex[i]; }); return c; }
const p = name && PRESET_COLORS.find(x => x.name.toLowerCase() === name.trim().toLowerCase());
if (!p) return null;
const c = {}; FIELDS.forEach(k => { c[k] = p[k]; }); return c;
}
function embedThemes(E) {
const L = themeOf(E.lightTheme, E.lightColors), D = themeOf(E.darkTheme, E.darkColors);
const start = E.theme.trim().toLowerCase();
if (!L && !D && !/^(light|dark|auto)?$/.test(start) || E.colors) { embedTheme(E.theme, E.colors); return; }
if (L) themeColors.light = L;
if (D) themeColors.dark = D;
const sysDark = () => !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
const mode = start === 'dark' ? 'dark' : start === 'auto' ? (sysDark() ? 'dark' : 'light') : 'light';
forceDark(mode === 'dark');
paint(themeColors[mode]);
}
function embedText(text, name) {
if (!text) return;
const t = cleanTest({ name: name || 'Sample', text });
tests = tests.filter(x => x.name !== t.name);
tests.unshift(t);
showTest(t);
}
function applyEmbed() {
const E = EMBED;
const lc = s => s.toLowerCase();
const own = E.texts.map((text, i) => text.trim() && cleanTest({ name: (E.textNames[i] || '').trim() || 'Sample ' + (i + 1), text })).filter(Boolean);
let list;
if (E.order.length) {
list = [];
E.order.forEach(n => {
const t = own.find(x => lc(x.name) === n) || tests.find(x => lc(x.name) === n);
if (t && !list.includes(t)) list.push(t);
});
} else {
const base = E.tests ? tests.filter(t => E.tests.includes(lc(t.name))) : tests;
list = [...own, ...base.filter(t => !own.some(o => lc(o.name) === lc(t.name)))];
}
tests = list;
if (tests[0]) showTest(tests[0]);
else { activeTest = null; showPlain(testBox, ''); renderTests(); updateAbout(); }
embedThemes(E);
if (E.size != null) { sizeIn.value = E.size; sizeIn.dispatchEvent(new Event('input')); }
if (E.lh != null) { heightIn.value = E.lh; heightIn.dispatchEvent(new Event('input')); }
if (/^(left|right|center|justify)$/.test(E.align)) $('#al' + E.align).click();
if (E.scale != null) setScale(E.scale, false);
if (!E.edit) {
const lock = () => $$('[contenteditable="true"]', testBox).forEach(el => el.setAttribute('contenteditable', 'false'));
lock();
new MutationObserver(lock).observe(testBox, { childList: true, subtree: true });
}
if (E.fonts.length) embedFonts(E.fonts.map((url, i) => ({ url, label: E.labels[i] || '' })));
post({ fft: 'hello' });
}
function embedFonts(list) {
fontQueue = fontQueue.then(async () => {
let first = null, n = 0, failed = 0, err = '';
for (const f of list) {
let rec = null;
try {
if (f.buf instanceof ArrayBuffer) {
const name = String(f.name || 'Font');
rec = await addFont(f.buf, name, { file: new File([f.buf], name) }, String(f.label || ''), true);
} else if (typeof f.url === 'string' && /^https?:/i.test(f.url)) rec = await loadURL(f.url, String(f.label || ''), true);
} catch (e) { setStatus('Not a valid font file: ' + (f.name || f.url || '')); }
if (rec) { n++; if (!first) first = rec; } else { failed++; err = (f.label || f.name || (f.url || '').split('/').pop()) + ': ' + statusEl.textContent; }
}
if (first) activate(first);
if (failed) setStatus(EMBED.debug ? err : n ? 'Some fonts couldn’t be loaded.' : 'The font couldn’t be loaded.');
if (failed && !n) { embedFontFailed = true; buildAxes(); }
document.documentElement.classList.remove('fft-wait');
post({ fft: 'ready', fonts: n });
postFeatures();
});
}
function post(msg) { if (EMBED && window.parent !== window) window.parent.postMessage(msg, '*'); }
if (EMBED) {
window.addEventListener('message', e => {
const d = e.data;
if (!d || typeof d !== 'object' || typeof d.fft !== 'string') return;
if (d.fft === 'fonts' && Array.isArray(d.fonts)) embedFonts(d.fonts);
else if (d.fft === 'text' && typeof d.text === 'string') embedText(d.text, typeof d.name === 'string' ? d.name : 'Sample');
else if (d.fft === 'font') embedFonts([d]);
else if (d.fft === 'theme') embedTheme(String(d.theme || ''), String(d.colors || ''));
else if (d.fft === 'size' && isFinite(+d.value)) { sizeIn.value = +d.value; sizeIn.dispatchEvent(new Event('input')); }
});
}
})();
