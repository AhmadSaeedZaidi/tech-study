# important things in section 06 (dom):

## dom tree and basic inspection:

the dom (document object model) is an object-based tree structure that represents an html document.
the `window` object contains the `document` object, and the document contains the `html` element, which branches into `head` and `body`.

```javascript
console.log(document)
console.dir(document)
```

`console.log(document)` shows the html structure, while `console.dir(document)` shows the document as an object with properties and methods.

## dom selectors and data types:

selectors are the foundation of dom work, because you need the correct element before you can edit it.

### basic selectors

`document.getElementById('id_name')` selects a single element by id.

`document.querySelector('selector')` uses css-style selectors and returns the first matching element.

```javascript
document.querySelector('h1')
document.querySelector('.class')
document.querySelector('#id')
document.querySelector('input[type="password"]')
```

### multiple elements and iterables

`document.querySelectorAll('selector')` returns a `NodeList` containing all matches.
`document.getElementsByClassName('className')` returns an `HTMLCollection`.

### selector rules and edge cases

in javascript, you must use `.className` instead of `.class` because `class` is a reserved keyword.

using `.setAttribute('class', 'newValue')` overwrites the existing class instead of appending to it.

`NodeList` has `.forEach()`, but it does not have normal array methods like `.map()`.
`HTMLCollection` is even more limited and does not have `.forEach()`.

to use standard array methods on these collections, convert them into a real array with `Array.from()`.

```javascript
const title = document.getElementById('title')
title.setAttribute('class', 'test heading')

const listItems = document.getElementsByClassName('list-item')
const convertedArray = Array.from(listItems)

convertedArray.forEach((item) => {
	item.style.color = 'orange'
})
```

### extracting content

`.innerText` returns only the visible text on the screen.
`.textContent` returns all text, including hidden text.
`.innerHTML` returns the text along with any html tags inside the element.

## dom traversal:

once you have an element, you can move through the dom tree in different directions.

### parent to child

use `parent.children` to access all children.
use `parent.firstElementChild` and `parent.lastElementChild` to target a specific child.

### child to parent

use `child.parentElement` to move up the dom tree without running another selector.

### siblings

use `child.nextElementSibling` to target the next adjacent element.

### traversal edge case

`parent.childNodes` returns a `NodeList` that includes element nodes, text nodes, and comments.
that means line breaks and whitespace in html can show up as nodes too.

```javascript
const parent = document.querySelector('.parent')

const firstDay = parent.firstElementChild
firstDay.style.color = 'orange'

const secondDay = firstDay.nextElementSibling
const originalParent = secondDay.parentElement
```

## creating new elements:

new elements are first created in memory, then configured, and finally attached to the page.

use `document.createElement('tagName')` to create an element.
you can then assign ids, classes, attributes, and styles before appending it.

for text, `element.innerText = "Text"` works, but creating a text node and appending it is more optimized.

```javascript
const div = document.createElement('div')

div.className = 'main'
div.id = Math.round(Math.random() * 10 + 1)
div.setAttribute('title', 'generated title')
div.style.backgroundColor = 'green'

const addText = document.createTextNode('Chai aur Code')
div.appendChild(addText)

document.body.appendChild(div)
```

## editing and removing elements:

you can replace or remove dom nodes after they are created.

### editing method 1

`element.outerHTML = '<li>New Value</li>'` replaces the element and its content completely.

### editing method 2

an optimized way is to create a new element in memory and swap it with `replaceWith()`.

### removing elements

use `element.remove()` to delete the selected node from the dom.

### editing edge case

using `.innerHTML` to append many items can force the browser to rebuild more of the dom than necessary.
for larger apps, it is better to create the node directly and use `appendChild()` on the parent.

```javascript
const secondLang = document.querySelector('li:nth-child(2)')
const newLi = document.createElement('li')
newLi.textContent = 'Mojo'
secondLang.replaceWith(newLi)

const lastLang = document.querySelector('li:last-child')
lastLang.remove()
```
