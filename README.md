# JLR7

A visual binary-style clock built with vanilla HTML, CSS, and JavaScript. It displays the current time using a grid of custom symbol images (J, L, R, S) that toggle between lit and unlit states.

## How It Works

Time is represented on an 8x4 grid of symbol tiles. Each cell shows one of four custom letter images (J, L, R, S) in either an "on" (1) or "off" (0) state.

- Hours (1–12) fill cells sequentially from the top-left
- Minutes are broken into 15-minute quarters (row 3) and remaining minutes (rows 4–7)
- A single cell pulses every second as a seconds indicator
- The grid updates every 1000ms via `setTimeout`

The symbol images follow a naming convention like `J0.png` / `J1.png`, where the suffix indicates on/off state.

## Features

- 12-hour binary-style clock display
- Animated intro sequence (randomized cell states) triggered by the "Animate" button
- Date display (`jlr7date()`) shown below the clock — renders if `#jlr7date_display` div is present in `index.html`
- Responsive layout via CSS media queries (1024px, 768px, 480px breakpoints)
- Styled with the Orbitron font and a cyan-on-black aesthetic

## Project Structure

```
├── index.html       # Entry point
├── style.css        # Layout and styling
├── JLR.js           # Clock logic
└── images/          # Symbol tile images (J0/1, L0/1, R0/1, S0/1)
```

## Usage

Just open `index.html` in a browser — no build step or dependencies required.

To hide the date display, remove the `#jlr7date_display` div from `index.html`.
