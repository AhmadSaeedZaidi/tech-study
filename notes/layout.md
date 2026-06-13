# layouts!
## static
elements are static by default, meaning they don't change based on content or screen size.
## relative
move an element relative to its normal position. it will still take up space in the document flow, but it will be offset by the specified amount.
## fixed
the element stays on the designated position on the screen. for example
```css
.banner {
    position: fixed;
    left: 0;
    top: 0;
}
```

now we have banner that stays fixed on the top of the page, regardless of scrolling, re-sizing, whatever.

## absolute
position relative to a parent (parent needs to be positioned, can't be static).
eg.
```css
.parent {
    position: relative;
}
.child {
    position: absolute;
    left: 10px;
    top: 20px;
}
```
now, child sits inside the parent's box, 10 pixels from the left edge, and 20 pixels from the top edge, and moves with the parent.

## sticky
basically a mixture of static and fixed. it behaves like static until a certain scroll position is reached, then it becomes fixed.

## z-index
everything has a z index of 0, but you can change it, to move a specific element behind or in-front of other elements.

