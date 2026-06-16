# CSS Grid

Grid is a 2-dimensional layout system (rows and columns). similar to flexbox, but more powerful and more complex.

## Basic Usage
```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
    gap: 20px; /* spacing between cells */
}
```

## Comparison with Flexbox
- **Flexbox**: 1-dimensional (row OR column). Best for aligning items in a line.
- **Grid**: 2-dimensional (rows AND columns). Best for overall page structure and complex layouts.

## grid-template-columns/rows
`grid-template-columns: col1 col2 col3`
here you can use fr, and it will act like flex-grow, and you can use repeat to add multiple columns of the same size instead of copy pasting.
so if i wanted 5 columns of 100px, i can do 

`grid-template-columns: repeat(5, 100px)`

## grid-auto-rows:
we can define the size of the rows, and if we add more items than the number of rows defined in grid-template-rows, it will automatically create new rows with the size defined in grid-auto-rows.

but this is rigid, if there is too much text, it won't grow.
so we use `minmax()`, this way the row will grow to fit the content, but it won't shrink below a certain size.
`grid-template-rows: minmax(150px, auto)`

## Responsive Grid
Using `auto-fill` or `auto-fit` with `minmax()` allows the grid to be responsive without many media queries:
```css
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
```

## Item Placement (grid-column & grid-row)
You can control where an item starts and ends in the grid using line numbers or the span keyword.
- `grid-column: <start-line> / <end-line>` (or `span <number>`)
- `grid-row: <start-line> / <end-line>` (or `span <number>`)

Example:
```css
.item-feature {
    grid-column: 1 / 3; /* spans from column line 1 to 3 */
    grid-row: span 2;   /* spans 2 rows */
}
```

## Container Alignment
### For the Grid Tracks (Content)
These align the entire grid inside the container if the grid is smaller than the container.
- `justify-content`: Aligns tracks along the horizontal axis (e.g., `center`, `space-between`).
- `align-content`: Aligns tracks along the vertical axis (e.g., `center`, `space-evenly`).

### For Grid Items
These align the items inside their assigned grid cells.
- `justify-items`: Aligns items horizontally within their cell (e.g., `start`, `end`, `center`, `stretch`).
- `align-items`: Aligns items vertically within their cell (e.g., `start`, `end`, `center`, `stretch`).

**Shorthand:**
- `place-content`: `<align-content> <justify-content>`
- `place-items`: `<align-items> <justify-items>`

## grid-template-area:
really powerful tool, you can define the layout of your grid using named areas, and then you can place your items in those areas using the `grid-area` property.
eg, make a "sidebar" area, that takes 1 column, 2 rows, and then you can assign 

`grid-area: sidebar;` to the item you want to place in that area.
