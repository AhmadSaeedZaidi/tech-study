# Flexbox

flexbox is a `display` type.

by default, the items in a container are laid out in a row, but we can change that to column, or even reverse the order of the items.

## flex grow  
very useful feature, allows items to grow and fill the available space in the container. we can specify how much an item should grow relative to the other items in the container (give them a certain weight)

## flex shrink
inverse of flex grow (self explanatory), not used much

## flex-wrap
allows items inside a flex container, to stack verticallly when they run out of horizontal space. by default, items will try to fit in a single line, but with flex-wrap, they can wrap onto multiple lines. This can be influenced by flex-shrink and flex grow.

### wrap-reverse 
things wrap in the reverse order. right-most element will go on the top, and son, until the left-most element goes on the bottom.

### nowrap
default behaviour, no wrap.

## flex-basis
better version of min-width.Element still wraps into vertical stacking when viewport is smaller, but the element also scales when the viewport is too small, and keeps a minimum size when the viewport is sufficiently large. Further responsiveness.

## flex proprty
everything above can be combined into a single property, with the syntax: 
```css
flex: <flex-grow> <flex-shrink> <flex-basis>
```