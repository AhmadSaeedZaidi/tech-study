# what is js?
Js is a scripting language, that allows us to implement complex features on web pages.
i'll be using [mozilla dev network docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting)
as well as [hitesh chai aur javascript](https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37)

## example script with explanation:
```js
function createParagraph() {
  const para = document.createElement("p");
  para.textContent = "You clicked the button!";
  document.body.appendChild(para);
}

const buttons = document.querySelectorAll("button");

for (const button of buttons) {
  button.addEventListener("click", createParagraph);
}
```
- this script runs when ANY button is clicked. this is because of `querySelectorAll(<type/class/id>)`, 
- it creates a new paragraph element using `createElement(<type>)`
- adds text to the paragraph para.textContent is an attribute of the para object we made.
- appends the para at the end of the body, using `appendChild(<element>)` method.

so the takeaway:
a js page is like a tree, of html elements. We call this tree a DOM (Document Object Model).
the elements have the concepts of parent, child, and sibling nodes in a tree.
I will discuss the methods in more detail later.

we can extract those elements, as js objects. or we can make new elements as js objects, and add them to the page.

## how to add JS to a page:
**1. Inline:** add js code directly to the html element using the `on<event>` attribute.
```html
<button onclick="alert('Hello world!')">Click me</button>
```
this triggers when the button element is clicked, and shows an alert (an alert is a dialog box popup) with the message "Hello world!";

**2. Internal:** add js code inside a `<script>` tag in the html file.
```html
<script>
// script here
</script>
```
**make sure this script tag is placed at the end of the body**, so that it runs after the page has loaded, and can access all the elements on the page.
this is because html is parsed top to bottom, so we want the script to load AFTER the whole page has loaded.

**3. External:** add js code in a separate file and link it to the html file using the `<script>` tag with the `src` attribute.
```html
<script type="module" src="script.js"></script>
```
**unlike internal scripts, this will be placed in the head.**
**because of the `type="module"` attribute, the script will be loaded after the page has loaded.**
otherwise, it would block the html parser.
this is the best practice, as it keeps the html file clean and separates the structure (html) from the behavior (js). it also allows us to reuse the same js file across multiple html files.
the top to bottom parsing no longer applies, as the script will be loaded after the page has loaded.

