# Grid Architecture Guide (CUDA Intro Page)

This guide explains the Grid-only implementation used in `grid.html` and `grid.css`.

## 1. Top-Level Page Structure
**Container:** `<body class="page-grid">`
- **Items:** `<header>`, `<main>`, `<footer>`
- **Logic:** Uses `grid-template-rows: auto 1fr auto` to create a "Sticky Footer" layout. The header and footer take their content's height, while the main content area (`1fr`) expands to fill the rest of the viewport.

## 2. Main Content Layout
**Container:** `<main class="content-grid">`
- **Items:** Four `<section class="card">` elements.
- **Logic:** Uses `repeat(auto-fit, minmax(280px, 1fr))` to automatically create as many columns as will fit, ensuring responsiveness without complex media queries.

## 3. Card Component
**Container:** `<section class="card">`
- **Items:** `<h2>`, `<p>`, `<ul>`, `<a>`
- **Logic:** Each card is its own grid container. This allows us to use the `gap` property to manage vertical spacing between elements inside the card consistently. `align-content: start` ensures items don't stretch vertically to fill the card.

## 4. Centering Containers
**Containers:** `.main-header`, `.main-footer`, `.btn`
- **Items:** The text and links inside.
- **Logic:** These use `place-items: center` or `place-content: center`. This is a Grid shorthand that centers items both horizontally and vertically within the container in a single line of CSS.

## 5. List Spacing
**Container:** `<ul class="grid-list">`
- **Items:** `<li>` elements.
- **Logic:** By making the list a grid container, we can use `gap: 8px` to ensure uniform spacing between list items, replacing traditional margin-bottom techniques.

---

### Summary Table
| Container Class | Grid Purpose | Key Property |
| :--- | :--- | :--- |
| `.page-grid` | Overall page skeleton | `grid-template-rows` |
| `.content-grid` | Card organization/columns | `auto-fit`, `minmax` |
| `.card` | Internal card spacing | `gap`, `align-content` |
| `.btn` / `.main-header` | Centering content | `place-items` |
| `.grid-list` | List item spacing | `gap` |
