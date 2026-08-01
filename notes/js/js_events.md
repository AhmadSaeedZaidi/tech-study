# important things in section 07 (events):

## what are events?

events are activities that happen in the browser.
for example, clicking a button, pressing a key, moving the mouse, submitting a form, or dragging and dropping something.

javascript can listen for these activities and run some code when they happen.

the important thing is that events are not necessarily executed just because they are written in the file. the browser waits for some activity, and then invokes the code connected to that event.

javascript itself normally runs sequentially, but browser events are an exception to the simple top-to-bottom idea because the browser invokes their handlers when the activity happens.

## adding events to html:

the first approach is to put the event directly inside the html element.

```html
<img id="photoshop" onclick="alert('Photoshop clicked')" src="photo.jpg" alt="Photoshop">
```

this works. when the image is clicked, the alert runs.

but this is usually not a good approach for bigger applications. it mixes html structure with javascript behavior, and as the application grows, the html becomes harder to maintain.

so, avoid injecting javascript directly into html when writing normal javascript. frameworks such as React have their own event syntax, so that is a separate situation.

## using a property like `.onclick`:

the second approach is to select the element and assign a function to its `onclick` property.

```javascript
const image = document.getElementById("photoshop")

image.onclick = function () {
	alert("Photoshop clicked")
}
```

this is cleaner than putting the code inside html, but it still has limitations.

the main problem is that the `onclick` property represents one handler. if you assign another function to it, the old function is replaced.

```javascript
image.onclick = function () {
	console.log("first handler")
}

image.onclick = function () {
	console.log("second handler")
}
```

in this example, only the second handler will run.

it also does not give us the same flexibility and event propagation control that we get from an event listener.

## `addEventListener()`:

the modern and preferred approach is `addEventListener()`.

```javascript
const image = document.getElementById("photoshop")

image.addEventListener("click", function () {
	alert("Photoshop clicked")
})
```

the first argument is the event name, written as a string.
the second argument is the callback function that should run when the event happens.

there are many event names, for example:

- `click`
- `dblclick`
- `mouseover`
- `keydown`
- `keyup`
- `submit`
- `drag`

the event listener approach is useful because it works with many kinds of events and gives us control over event propagation.
it is also the approach that you will see most often in modern javascript applications and event-related interview questions.

## the third parameter:

`addEventListener()` can also take a third argument.

```javascript
element.addEventListener("click", handleClick, false)
```

the third argument controls whether the event is handled during the capturing phase or the bubbling phase.
its default value is `false`, which means bubbling mode.

because `false` is already the default, people usually leave it out.

```javascript
element.addEventListener("click", handleClick)
```

but it is still important to understand it because sometimes an interview or a real project requires the event to be handled in capturing mode.

## old approaches:

there were older ways of attaching events, such as `attachEvent()` for old versions of Internet Explorer.

jQuery also had its own event methods, and before modern libraries became common, many applications used jQuery heavily.

these are useful to know for historical context, but for new code, use `addEventListener()`.

## the event object:

when an event happens, the browser creates an event object and passes it to the callback function.

```javascript
const image = document.getElementById("photoshop")

image.addEventListener("click", function (event) {
	console.log(event)
})
```

the event object contains information about what happened.
it can tell us which type of event happened, when it happened, where the mouse was, which keyboard keys were pressed, and which element caused the event.

some useful values are:

- `event.type` tells us the event type, such as `click` or `keydown`.
- `event.timeStamp` tells us when the event happened.
- `event.target` is the element that originally triggered the event.
- `event.currentTarget` is the element whose event listener is currently running.
- `event.target.tagName` tells us the html tag of the original target.
- `event.target.parentNode` moves from the target to its parent node.
- `event.clientX` and `event.clientY` give the pointer position in the viewport.
- `event.screenX` and `event.screenY` give the pointer position relative to the screen.
- `event.altKey`, `event.ctrlKey`, and `event.shiftKey` tell us whether those keys were pressed.

for keyboard events, there are also values that identify which key was pressed.
this can be used for things like keyboard games, typing-speed applications, or shortcuts.

```javascript
document.addEventListener("keydown", function (event) {
	console.log(event.key)
	console.log(event.code)
})
```

the event object is very large, so you do not need to memorize every property.
the important thing is to know that the event contains the context of the activity, and to look up the property you need.

## `target` vs `currentTarget`:

these two values look similar but they are not always the same.

`event.target` is the element that was actually clicked.
`event.currentTarget` is the element where the listener was attached.

this difference becomes important when events propagate through parent and child elements.

## event propagation:

suppose an image is inside a link, and the link is inside a list.

```html
<ul id="image-list">
	<li>
		<a href="https://example.com">
			<img id="photoshop" src="photo.jpg" alt="Photoshop">
		</a>
	</li>
</ul>
```

if we click on the image, the click happened on the image, but the image is also inside the link, the list item, and the list.
the browser has to decide how that event moves through these elements.

there are two main phases:

1. capturing: the event travels from the outer element down to the target.
2. bubbling: the event travels from the target back up through its parent elements.

## bubbling:

bubbling is the default behavior for most event listeners.
the event starts at the element that was clicked and then bubbles upward to its parents.

```javascript
const imageList = document.getElementById("image-list")
const image = document.getElementById("photoshop")

image.addEventListener("click", function () {
	console.log("click inside image")
})

imageList.addEventListener("click", function () {
	console.log("click inside list")
})
```

when the image is clicked, both listeners can run.
the image listener runs first because the image is the inner target, and then the event bubbles up to the list listener.

this is called bubbling because the event moves upward from the inner element to the outer element.

## capturing:

capturing is the opposite direction.
the event starts at the outer element and travels down to the element that was clicked.

to use capturing mode, pass `true` as the third argument to `addEventListener()`.

```javascript
imageList.addEventListener("click", function () {
	console.log("list capture")
}, true)

image.addEventListener("click", function () {
	console.log("image capture")
}, true)
```

when the image is clicked, the list listener runs first, and then the image listener runs.

there is no universal rule that capturing is always better or bubbling is always better.
it depends on which element should handle the event first.
usually, bubbling is enough, but capturing is important to understand because it is asked about in interviews and is useful in specific situations.

## stopping propagation:

sometimes we want an inner element to handle an event without allowing it to reach its parent.
for this, use `stopPropagation()`.

```javascript
image.addEventListener("click", function (event) {
	console.log("image clicked")
	event.stopPropagation()
})
```

now the click will be handled by the image, but it will not bubble up to the list.

`stopPropagation()` stops the event from moving to other elements.

## preventing default behavior:

some html elements already have a default behavior.
for example, clicking an anchor normally navigates to its `href`.
submitting a form normally sends the form data and reloads or navigates the page.

we can stop that default behavior using `preventDefault()`.

```javascript
const google = document.getElementById("google")

google.addEventListener("click", function (event) {
	event.preventDefault()
	console.log("navigation stopped")
})
```

the click event still happens, but the browser will not follow the link.

this is different from `stopPropagation()`:

- `preventDefault()` stops the browser's default action.
- `stopPropagation()` stops the event from moving through parent and child elements.

you can use both when necessary.

```javascript
google.addEventListener("click", function (event) {
	event.preventDefault()
	event.stopPropagation()
})
```

## small project: remove an image when clicked:

let's make a small project with a list of images.
the goal is simple: when an image is clicked, remove its entire link from the page.

```html
<ul id="image-list">
	<li>
		<a href="https://example.com">
			<img src="photo.jpg" alt="photo">
		</a>
	</li>
</ul>
```

the first idea might be to give every image its own id and attach a separate listener to every image.
that works for a few images, but it is boring and does not scale well if there are many images.

instead, attach one listener to the parent list.
this works because clicks from the images will bubble up to the list.

```javascript
const imageList = document.getElementById("image-list")

imageList.addEventListener("click", function (event) {
	console.log(event.target)
})
```

now, if we click different images, `event.target` tells us which image caused the event.
this approach is called event delegation.
the parent handles events for its children instead of attaching one listener to every child.

## removing the correct parent:

we do not want to remove only the image.
if we remove the image, the link and the list item can be left behind, which creates an empty space or an empty bullet point.

so we can move from the clicked image to its parent link and remove that.

```javascript
imageList.addEventListener("click", function (event) {
	const clickedImage = event.target
	const imageLink = clickedImage.parentNode

	imageLink.remove()
})
```

but there is a problem with this version.
if the user clicks directly on the link instead of the image, then `event.target` is the link itself.
in that case, `event.target.parentNode` could be the list item, and we might remove the wrong element.

so we need to check what kind of element was clicked before removing anything.

```javascript
imageList.addEventListener("click", function (event) {
	if (event.target.tagName === "IMG") {
		const imageLink = event.target.parentNode
		imageLink.remove()
	}
})
```

now only an `IMG` target is allowed to trigger the remove operation.
clicking the link itself will not accidentally remove the list item.

another way to remove a child is `removeChild()`.

```javascript
const imageLink = event.target.parentNode
imageLink.parentNode.removeChild(imageLink)
```

this does the same thing, but it is a little harder to read.
the modern `.remove()` method is simpler when we already have the node that needs to be deleted.

## event delegation takeaway:

event delegation is useful when many child elements need similar behavior.
instead of creating many event listeners, put one listener on a common parent and inspect `event.target`.

```javascript
parent.addEventListener("click", function (event) {
	if (event.target.tagName === "IMG") {
		// handle the clicked image
	}
})
```

the important part is that the event bubbles from the child to the parent.
if bubbling is stopped, the parent listener will not receive the event.

## key takeaways:

- avoid inline event handlers in html for normal javascript.
- use `addEventListener()` for modern event handling.
- the event object gives information about the activity and its source.
- `event.target` is the original element that triggered the event.
- `event.currentTarget` is the element whose listener is running.
- bubbling moves from the target to its parents.
- capturing moves from the parents down to the target.
- `stopPropagation()` stops the event from moving further.
- `preventDefault()` stops the browser's default action.
- event delegation uses one parent listener for many child elements.
- always check `event.target` before performing an operation on it.
