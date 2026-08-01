# important things in section 11 (lexical scoping and closures):

## lexical scoping:

lexical scoping defines how variable names are resolved in nested functions. a child function has access to the scope of its parent, but the reverse is not true.

```javascript
function outer() {
	let username = "Hitesh"

	function inner() {
		console.log(username) // can access outer
	}

	inner()
}
```

the inner function can read `username` from outer, because the inner scope can see outward.

### the sibling edge case:

sibling functions cannot access each other's local variables. and a parent cannot access variables defined inside its own child.

```javascript
function outer() {
	let username = "Hitesh"
	console.log("OUTER", secret) // error, secret is not here

	function inner() {
		let secret = "my123"
		console.log("inner", username) // works, username is in scope
	}

	function innerTwo() {
		console.log("innerTwo", username) // works
		console.log(secret) // error, secret belongs to inner only
	}

	inner()
	innerTwo()
}
```

`inner` and `innerTwo` can both see `username` from outer. but `secret` is local to `inner`, so neither `innerTwo` nor `outer` can touch it.

scope only flows outward, from child to parent, never sideways and never from parent to child.

### comparison to python and cpp:

this is basically the same scope rule in python and cpp. inner blocks and functions can read enclosing variables, but not siblings or the caller's locals. in cpp the scopes are nested blocks, in python they are nested functions and modules.

## closures:

a closure is created when a function is returned from another function. it is not just the function that gets returned, it is the function along with its lexical environment (its memory).

```javascript
function makeFunc() {
	const name = "Mozilla"

	function displayName() {
		console.log(name)
	}

	return displayName
}

const myFunc = makeFunc()
myFunc() // still logs "Mozilla"
```

makeFunc finishes running and its execution context is removed from the stack. but the returned displayName function still remembers `name`, because the closure keeps the outer function's scope alive.

the function does not just carry the code, it carries the memory it was created in.

### from my research:

this is the exact example from mdn's closures guide. the mechanism is that a function keeps a reference to its lexical environment, so captured variables stay alive as long as the function does. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures

### comparison to python and cpp:

python has closures too, and the rules are the same. an inner function referencing an outer variable captures it. cpp lambdas with `[=]` capture by value, which is the same spirit. the difference is that cpp lambdas capture a copy, while javascript closures capture a reference to the actual variable.

## practical real-world scenario: the DRY pattern:

the video uses closures to avoid repetitive code (the DRY principle) when handling ui events.

instead of writing a separate click handler for every button:

```javascript
// the repetitive way
document.getElementById("orange").onclick = function () {
	document.body.style.backgroundColor = "orange"
}
document.getElementById("green").onclick = function () {
	document.body.style.backgroundColor = "green"
}
```

you write one factory function that returns a closure:

```javascript
function clickHandler(color) {
	return function () {
		document.body.style.backgroundColor = color
	}
}

document.getElementById("orange").onclick = clickHandler("orange")
document.getElementById("green").onclick = clickHandler("green")
```

`clickHandler("orange")` returns a function that remembers the color "orange". each returned function captures its own color, so one function definition handles every button.

the key idea is that you return the function instead of calling it directly. if you wrote `clickHandler("orange")()` (with the extra call), the background would change immediately and the color would not be remembered for the click event.

### from my research:

this factory pattern is used everywhere. create a function that builds and returns another function with some value captured, and the closure remembers that value for as long as the returned function lives. it is how event handlers, debounce functions, and lots of framework code work under the hood.

## key takeaways:

- inner functions can access outer scope, not the other way around.
- siblings cannot access each other's locals.
- a closure is a function plus its lexical environment, the memory comes along.
- even after the outer function returns, the returned function keeps its captured variables alive.
- use closures to avoid repetitive code, one factory function can produce many specialized handlers.
- return the function, do not call it, when you want the captured value used later.
- the same closure concept exists in python and in cpp lambdas, but javascript captures the live variable, not a copy.
