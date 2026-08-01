# important things in section 08 (asynchronous javascript):

## the big idea: javascript is single-threaded

javascript is synchronous by default. it runs code line by line, and it is single-threaded, meaning there is exactly one main thread doing the work.

```javascript
console.log("1")
console.log("2")
console.log("3")
// 1
// 2
// 3
```

simple dimple, it just goes top to bottom.

but here is the problem. if one line takes a long time, everything after it waits. that is called blocking code. a synchronous file read, or a heavy computation, pauses the whole program.

```javascript
console.log("start")
// something slow happens here, nothing else can run meanwhile
console.log("end")
```

if the slow thing is a network request, the page feels frozen. that is bad for performance.

non-blocking code is the opposite. it offloads the slow task to the background and lets the main thread keep working. when the background task finishes, its result comes back and runs later.

the engine alone (call stack + memory heap) is not enough to do async. it needs the browser's web APIs, or node.js, to handle the slow stuff like timers, network calls, and file access.

### comparison to cpp and python:

in cpp, `std::this_thread::sleep_for(x)` blocks the whole thread, and there is no standard library event loop or timer callback. you bring your own via boost::asio or libuv.

in python, `time.sleep(x)` also blocks the thread. the idiomatic non-blocking version is `await asyncio.sleep(x)`, which yields control to asyncio's event loop instead of sleeping. asyncio is basically python's version of the javascript event loop.

so the mental shift is: javascript timers never block. they hand the callback to the browser's event loop and return immediately.

## the event loop lifecycle:

when an async task runs, it moves through this lifecycle:

1. call stack: the engine encounters the async function.
2. web api / node api: the task is handed to the browser or node to handle in the background.
3. task queue: when the background task finishes, its callback moves into a queue.
4. event loop: it keeps checking if the call stack is empty. if it is, it pushes the first callback from the queue onto the stack.

the call stack is a stack of currently running function calls. the task queue is a first in, first out line of callbacks waiting to run. the event loop is the manager that moves callbacks from the queue onto the stack when the stack is empty.

the important guarantee is run-to-completion: a running task can never be interrupted by other javascript. that is why the event loop only moves the next task when the current stack is empty.

## the setTimeout(0) trap:

even a delay of 0 milliseconds is not immediate.

```javascript
console.log("1")

setTimeout(() => {
	console.log("2")
}, 0)

console.log("3")
// 1
// 3
// 2
```

the output is 1, 3, 2, not 1, 2, 3. why?

the setTimeout callback is sent to the web api, then it moves to the task queue. it has to wait for the main thread to finish the synchronous `console.log("3")` before it is pushed back onto the call stack.

setTimeout(..., 0) does not mean "run right now". it means "run as the next task after the current synchronous code and its microtasks finish".

### from my research (mdn):

the delay is also clamped in browsers. after a timer has been nested about 5 levels deep, a sub-4ms delay is pinned to 4ms. so `setTimeout(0)` is never really 0 once you stack them. background tabs get throttled even harder, timers there can wait a second or more. reference: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified

## microtask queue vs task queue:

promises and fetch do not use the normal task queue. they use a separate microtask queue, sometimes called the promise queue or the priority queue.

the difference matters because microtasks run before normal tasks.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)          // task queue
Promise.resolve().then(() => console.log("3")) // microtask queue

console.log("4")
// 1
// 4
// 3
// 2
```

3 skips ahead of 2, even though the setTimeout was registered first.

here is the actual order of priority:

1. synchronous code finishes.
2. the microtask queue is drained completely.
3. one task from the task queue runs.
4. repeat.

the microtask queue is drained until empty, including microtasks that get queued while it is draining. that is why promises always beat setTimeout, and why fetch responses feel faster than you expect.

### comparison to python:

this is like asyncio in python, where awaiting a coroutine yields control to the loop. the difference is that python's await is the main way you interleave, while javascript has both microtasks (promises) and macrotasks (timers), and the microtasks win every time.

## setTimeout:

setTimeout runs a function once after a delay in milliseconds.

```javascript
const timeoutId = setTimeout(() => {
	console.log("Hitesh")
}, 2000)
```

the first argument is the function, the second is the delay in ms. it returns a positive integer id.

to cancel it before it fires, use clearTimeout with that id.

```javascript
clearTimeout(timeoutId)
```

the id is just a number, you have to store it to be able to cancel it.

### practical example: stop button with setTimeout:

```html
<h1>Chai aur code</h1>
<button id="stop">Stop</button>
```

```javascript
const changeText = function () {
	document.querySelector("h1").innerHTML = "best JS series"
}

const changeMe = setTimeout(changeText, 2000)

document.querySelector("#stop").addEventListener("click", function () {
	clearTimeout(changeMe)
	console.log("STOPPED")
})
```

if you click stop before 2 seconds, the text never changes. the timer is cancelled. if you wait 2 seconds, the heading changes to "best JS series", and the clearTimeout afterwards does nothing, because the timer already fired.

the takeaway is that clearTimeout is only useful if you call it before the delay expires.

## setInterval:

setInterval runs a function repeatedly at fixed intervals.

```javascript
const intervalId = setInterval(() => {
	console.log(Date.now())
}, 1000)
```

it returns an id, and clearInterval stops it.

```javascript
clearInterval(intervalId)
```

Date.now() returns the current time in milliseconds since the epoch. if you run this, you see a timestamp roughly every second.

### passing arguments to the callback:

setInterval (and setTimeout) accept extra arguments after the delay, and they are passed to the callback when it runs.

```javascript
const sayDate = function (str) {
	console.log(str, Date.now())
}

const intervalId = setInterval(sayDate, 1000, "hi")
// hi 1700000000000
// hi 1700000001000
```

the string "hi" is passed to sayDate on every call.

### practical example: start and stop with setInterval:

```html
<h1>Chai aur Javascript</h1>
<button id="start">Start</button>
<button id="stop">Stop</button>
```

the clean version is to keep a variable for the interval id, and create or clear it based on which button was clicked.

```javascript
let intervalId

document.querySelector("#start").addEventListener("click", function () {
	intervalId = setInterval(() => {
		console.log(Date.now())
	}, 1000)
})

document.querySelector("#stop").addEventListener("click", function () {
	clearInterval(intervalId)
	intervalId = null
})
```

two important rules here:

- always implement a check so you do not create multiple overlapping intervals. if the user clicks start five times, you do not want five intervals running. the common fix is to check `if (intervalId) return` before starting a new one.
- after clearing, setting the variable to null is good hygiene. it clears the stored state and avoids accidentally re-clearing a recycled id later. note that nulling the variable is not what frees the memory, the interval only stops being kept alive once clearInterval is called, because the browser holds the callback in its own internal map until then.

### from my research (mdn):

setInterval reschedules from the start of each callback, not after it finishes. if the callback takes longer than the interval, you can get back-to-back calls with no gap. mdn recommends recursive setTimeout when the work itself might take longer than the interval, because recursive setTimeout only schedules the next call after the current work completes. reference: https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency

## random color generator project:

a classic project uses setInterval to change the body background color every second.

the core of it is generating a random hex color:

```javascript
const randomColor = function () {
	const hex = "0123456789ABCDEF"
	let color = "#"
	for (let i = 0; i < 6; i++) {
		color += hex[Math.floor(Math.random() * 16)]
	}
	return color
}

let intervalId

const startChangingColor = function () {
	intervalId = setInterval(() => {
		document.body.style.backgroundColor = randomColor()
	}, 1000)
}

const stopChangingColor = function () {
	clearInterval(intervalId)
}
```

the `Math.floor(Math.random() * 16)` part picks a random index into the hex string. Math.random() gives a decimal between 0 and 1, multiplying by 16 spreads it across 0 to 15, and floor drops the decimal. this is the same range formula from section 01, just with 16 instead of 6.

### comparison to cpp and python:

this is exactly the `rand() % n` idea from cpp, except Math.random() is a float in [0, 1), so you scale it yourself instead of using modulo.

in python, `random.randint(0, 15)` or `random.choice("0123456789ABCDEF")` is the direct equivalent of picking a random character.

## keydown events and special keys:

you can listen for keyboard events on the whole window.

```javascript
window.addEventListener("keydown", function (e) {
	console.log(e.key)
})
```

the event object has `e.key`, which is the character, and `e.code`, which is the physical key. for example, pressing the space bar gives `e.key === " "` and `e.code === "Space"`.

when handling keydown, always check for empty or special keys before doing work with the value. keys like " " and "Shift" produce values that are easy to forget, and conditional checks keep the logic safe.

## key takeaways:

- javascript is synchronous and single-threaded, async comes from the browser or node APIs.
- the event loop moves callbacks from the task queue to the call stack only when the stack is empty.
- setTimeout(0) is not immediate, it runs after the current synchronous code.
- microtasks (promises) run before task queue callbacks (timers).
- setTimeout runs once, setInterval runs repeatedly.
- always capture the id returned by setTimeout or setInterval if you want to cancel later.
- clearTimeout and clearInterval cancel timers, call them before the timer fires.
- guard against creating multiple overlapping intervals with a check.
- null the interval reference after clearing, good hygiene for state and garbage collection.
- cpp and python threads block on sleep, javascript hands the callback to an event loop and keeps running.
