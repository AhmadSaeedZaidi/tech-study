# Flexbox Architecture Guide (About Me Page)

This guide explains the Flexbox implementation used in `flexbox.html` and `flexbox.css`.

## 1. Global Page Layout
**Container:** `<div class="page-wrapper">`
- **Items:** `<header>`, `<main>`, `<footer>`
- **Logic:** Uses `flex-direction: column` to stack sections vertically. `min-height: 100vh` ensures the footer stays at the bottom even with little content.

## 2. Header and Footer Alignment
**Containers:** `<header class="main-header">`, `<footer class="main-footer">`
- **Items:** Text, titles, and copyright info.
- **Logic:** Uses `flex-direction: column` (for header) and `align-items: center` to keep everything perfectly centered on the cross-axis.

## 3. Main Content Flow (Responsive Grid-like)
**Container:** `<main class="content-flex">`
- **Items:** The four `<section class="card">` elements.
- **Logic:** Uses `flex-wrap: wrap` and `justify-content: center`. This allows cards to flow in a row on desktop and automatically wrap into multiple rows or a single column on mobile.

## 4. Card Sizing and Order
**Items:** `.card`
- **Logic:** Each card uses the `flex` shorthand: `flex: 1 1 300px`. 
    - `1` (grow): Cards expand to fill available space.
    - `1` (shrink): Cards can shrink if space is tight.
    - `300px` (basis): The ideal starting width for each card.
- **Order:** Used the `order` property to re-sequence cards without changing the HTML source (e.g., `.hobbies { order: 3 }`).

## 5. Internal Component Layout
**Container:** `.card ul`
- **Items:** `<li>` elements.
- **Logic:** By making the list a flex container with `flex-direction: column`, we gain precise control over alignment (e.g., `align-items: flex-start`) for consistent list presentation.

---

### Summary Table
| Container Class | Flex Purpose | Key Property |
| :--- | :--- | :--- |
| `.page-wrapper` | Vertical section stacking | `flex-direction: column` |
| `.content-flex` | Responsive card layout | `flex-wrap: wrap` |
| `.card` | Reordering & sizing | `order`, `flex-basis` |
| `.main-header` | Cross-axis centering | `align-items: center` |
| `.card ul` | Vertical list management | `flex-direction: column` |
