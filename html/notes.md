# General Notes
these notes exist to save information about backend/server-side processing, that was covered in the lectures, but not relevant yet in the code

## name attribute
```
html
name=""
```

the name tag in html allows
- grouping tags together for "mcq" style fields
- it helps the server find the field (in php)

## value attribute
```
html
value=""
```
for some fields, the value isn't entered by the user, so we add the value to the tag, so it gets sent to the server when selected. simple dimple

## action attribude
```
html
action=""
```
not used yet, but basically decides what happens to the data from the form after it is submitted. the data of the form, goes into the url and is sent to the server using https.

## validation
the types automatically do some validation, thanks to html5. like email etc. need to add some attributes for others like `required`

# CSS
## selectors:
eg. "div", "li", "p" etc, the html tag we are selecting to be styled
## declarations:
eg. "color: red", "font-size: 20px" etc, the actual styling we want to apply to the selector
## block:
```html
<head>
    <style>
        h1 {
            color: orange;
        }
        p {
            colour: red;
        }
    </style>
</head>
```

this sets h1 tags to orange, and p tags to red in the document.

## stylesheet
as in the [stylesheet](../css/style.css) file, we can put the css in a separate file and link it in the head of the html document, using the link tag. this is better for organization and reusability.

## font-size:
### rem:
rem stands for "root em", and it is relative to the root element (html) font size. so if the root font size is 16px, then 1rem = 16px, 2rem = 32px etc. this is useful for responsive design, as it allows us to scale the font size based on the root font size, which can be changed using media queries.
### em:
em is relative to the parent element font size. so if the parent font size is 16px, then 1em = 16px, 2em = 32px etc. this can be useful for nested elements, as it allows us to scale the font size based on the parent font size, which can be changed using media queries. however, it can also lead to unexpected
### px:
absolute unit, which is not relative to anything. it is fixed and does not change based on the parent or root font size. this can be useful for elements that need to be a specific size, regardless of the font size of the parent or root. however, it can also lead to issues with responsiveness, as it does not scale with the rest of the document.
### larger/smaller:
these are relative to the parent font size, but they are not a specific value. larger will increase the font size by a certain amount, and smaller will decrease it by a certain amount. this can be useful for quick adjustments, but it can also lead to inconsistent font sizes if used too much. good for prototyping/feeling out the design.

## font-family:
[web safe fonts](https://www.w3schools.com/cssref/css_websafe_fonts.php)
use the ones mentioned here for accessibility :)

# hex codes
use hex codes for colour, 6 hexadecimal digits, 2 for each colour in R G B. 0 is black, F is max, 6 Fs is white. eg. #FF0000 is red, #00FF00 is green, #0000FF is blue, #FFFF00 is yellow etc. this allows for a wide range of colours to be used in the design. also allows for consistency across different browsers and devices, as the hex code will always represent the same colour regardless of the platform.

# block level vs inline elements
block level elements take up the full width of the parent container and start on a new line. examples include div, p, h1, h2, h3 etc. they are used for structuring the document and creating sections.
inline elements do not take up the full width of the parent container and do not start on a new line. examples include span, a, img etc. they are used for styling and adding content within block level elements. they can be used to style specific parts of a block level element without affecting the entire element. for example, we can use a span to style a specific word within a paragraph without changing the style of the entire paragraph.

## css 
you can use `display:block` or `display:inline` to change the default behaviour of an element.

## margin and padding
you can add margins and padding. the difference is margins collapse, meaning if two elements have margins, the larger will be used instead of adding them. 

padding does not collapse, it adds to the size of the element. so if an element has a padding of 10px, it will add 10px to the width and height of the element. this can be useful for creating space between the content and the border of the element, without affecting the layout of the document.
### inline elements:
padding works in all directions for inline elements, but it collapses vertically.

margins don't work vertically for inline elements.