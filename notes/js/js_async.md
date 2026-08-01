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

the async story has four players plus a manager. it is worth understanding each one before tracing a real request, because the whole model is just these pieces passing work to each other.

### the four players:

**1. the call stack**

the call stack is a last-in, first-out stack of currently running functions. when you call a function, a new frame is pushed on top. when the function returns, its frame pops off.

```javascript
function a() {
	return "a"
}

function b() {
	return a()
}

b()
```

when `b()` runs, the stack is `[b]`. inside b, `a()` runs, so the stack becomes `[b, a]`. when a returns, it pops, and we are back to `[b]`. when b returns, the stack is empty.

here is the sentence that matters: javascript only executes code sitting on top of the stack. everything below a frame is paused and waiting for the frame above it to finish.

**2. the memory heap**

the heap is unstructured memory where objects and variables actually live. the stack holds small frames and references, the real data sits in the heap. this is the same stack vs heap idea from section 01.

**3. the web apis (or node apis)**

`setTimeout`, `fetch`, `addEventListener`, file reads, these are not part of javascript. the engine borrows them from the host, the browser or node. and crucially, the host does the slow waiting on its own threads, so the main thread is free to keep running.

the timer countdown is not a javascript thing. the browser's internal timer machinery handles it in the background.

**4. the task queue**

when a web api finishes its work, it does not run your callback directly. it drops the callback into a first-in, first-out line called the task queue (also known as the callback queue or macrotask queue). the callback sits there waiting for the event loop to let it in.

### the event loop:

the event loop is the manager that connects these pieces. its job is deceptively simple: it keeps checking one question, is the call stack empty? if yes, take the first callback from the front of the queue and push it onto the stack. if no, keep waiting.

```
call stack          web api              task queue
+----------+        +----------+         +-----------+
| main()   |        | setTimeout|         |   cb      |
| console  |  --->  | (browser |  --->   |   cb      |
| log      |        |  counts) |         +-----------+
+----------+        +----------+             |
      ^                                      |
      |          event loop                  v
      +-----------(stack empty?)-------------+
```

### tracing a real timer:

let's follow `setTimeout(cb, 1000)` all the way through.

```javascript
console.log("start")

setTimeout(() => {
	console.log("2 seconds passed")
}, 1000)

console.log("end")
```

step by step:

1. the whole script is pushed onto the call stack as a task.
2. `console.log("start")` runs, prints start, pops off.
3. `setTimeout(cb, 1000)` is called. javascript does not wait here. it hands the callback and the delay to the browser's timer api and moves on immediately.
4. `console.log("end")` runs, prints end, pops off. now the stack is empty, but the script's task is done.
5. meanwhile, in the background, the browser is counting down the 1 second on its own thread.
6. when the timer expires, the browser pushes `cb` into the task queue.
7. the event loop sees the stack is empty, takes `cb` from the front of the queue, and pushes it onto the stack.
8. `cb` runs and prints "2 seconds passed".

the key is step 3. javascript hands the timer to the browser and immediately keeps going. that is what makes it non-blocking, and that is why the "end" prints before "2 seconds passed".

### the run-to-completion guarantee:

because the event loop only moves a callback when the stack is empty, a running task can never be interrupted by other javascript. no callback gets cut off halfway through.

```javascript
setTimeout(() => console.log("first"), 0)
setTimeout(() => console.log("second"), 0)
```

both callbacks land in the task queue in order. "first" runs completely, then "second" runs. one task at a time, strictly.

this guarantee is what makes shared state easy to reason about. two pieces of code never touch the same variable at the same time, because nothing on the main thread truly runs in parallel. the concurrency is apparent, not real.

### from my research (mdn):

the spec calls each autonomous executor an "agent", which is roughly one thread. the stack + heap + job queue together are the engine, and the browser/dom apis are the host. the host can genuinely do work in parallel, but the engine runs exactly one javascript job at a time. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model

### comparison to cpp and python:

in cpp, there is no built-in event loop. `std::this_thread::sleep_for` blocks, and if you want a "one thread with a callback queue" model you bring in boost::asio or libuv (libuv is literally the loop that powers node). asyncio in python is the closest cousin: one loop, coroutines yield, the loop decides who runs next. the difference is asyncio only interleaves at await points, while javascript interleaves whenever a task finishes and the stack empties.

### key takeaway:

the event loop is a gatekeeper. the stack runs the code, the web apis do the slow waiting off-thread, the queue holds finished callbacks, and the loop lets exactly one callback in whenever the stack is empty. keep that picture in your head and both `setTimeout(0)` ordering and promise priority start to make sense.

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
