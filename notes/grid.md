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

## grid-template-columns/rows
`grid-template-columns: col1 col2 col3`
here you can use fr, and it will act like flex-grow, and you can use repeat to add multiple columns of the same size instead of copy pasting.
so if i wanted 5 columns of 100px, i can do 

`grid-template-columns: repeat(5, 100px)`

## grid-auto-rows:
we can define the size of the rows, and if we add more items than the number of rows defined in grid-template-rows, it will automatically create new rows with the size defined in grid-auto-rows.

but this is rigid, if there is too much text, it won't grow.
so we use `grid-template-rows: minmax(150px, auto)`, this way the row will grow to fit the content, but it won't shrink below 150px.

## grid-template-area:
really powerful tool, you can define the layout of your grid using named areas, and then you can place your items in those areas using the `grid-area` property.
eg, make a "sidebar" area, that takes 1 column, 2 rows, and then you can assign 

`grid-area: sidebar;` to the item you want to place in that area.