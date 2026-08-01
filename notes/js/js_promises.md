# important things in section 09 (promises, fetch, and api requests):

## the old way: XMLHttpRequest

before fetch existed, developers used XMLHttpRequest (xhr for short) to talk to servers.

the workflow has four steps:

```javascript
const xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.github.com/users/hiteshchoudhary")
xhr.send()
```

1. create an instance with `new XMLHttpRequest()`.
2. configure it with `open(method, url)`.
3. send it with `send()`.
4. track its lifecycle with an event listener.

to actually read the response, you attach an `onreadystatechange` handler. the request moves through several readyState values as it progresses:

```javascript
const xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.github.com/users/hiteshchoudhary")

xhr.onreadystatechange = function () {
	console.log(xhr.readyState)
	if (xhr.readyState === 4) {
		const data = JSON.parse(this.responseText)
		console.log(data.followers)
	}
}

xhr.send()
```

the readyState values are:

| value | name | meaning |
| :--- | :--- | :--- |
| 0 | UNSENT | client created, open() not called |
| 1 | OPENED | open() called |
| 2 | HEADERS_RECEIVED | send() called, headers and status available |
| 3 | LOADING | downloading, responseText holds partial data |
| 4 | DONE | operation complete |

you only get a usable response when readyState is 4. that is why every xhr handler checks for it.

### the `this` gotcha:

inside the `onreadystatechange` function, `this` refers to the xhr object itself, not the outer scope. so you can use `this.responseText` to access the response.

if you used the variable name `xhr` directly it would usually still work, but the video makes the point that `this` is the reliable, context-correct way inside the callback.

### parsing the response:

the server usually sends the data as a string. you must parse it with `JSON.parse()` before you can use it as a normal object.

```javascript
const data = JSON.parse(this.responseText)
console.log(data.followers)
```

without the parse, you have a raw string. `data.followers` would not work.

### comparison to cpp and python:

in python, `requests.get(url)` returns a response with `.json()` that parses for you. the xhr way is manual, you have to remember to call JSON.parse yourself.

in cpp, there is no standard http client at all, you pull in something like curl or cpprestsdk. the closest idea to a "request lifecycle" is curl's callback or a promise/future wrapper.

## console.log is not part of javascript:

an interesting fact from the video: `console.log` is not part of the ECMAScript standard. it is an api injected by the runtime, the browser or node, so that the engine can print things.

the v8 engine (used by chrome and node) is written in c++, and `console.log` is implemented inside the engine's c++ source. that is why console behavior can vary slightly between environments, it depends on the c++ code that manages input/output for that environment.

so `console.log` is basically a debug tool provided by the host, not a language feature.

## what is a promise?

a promise is an object representing the eventual completion or failure of an async operation. it is a placeholder for a value that will be available later.

a useful mental model: think of it like a receipt from a restaurant. you order food, the kitchen takes time, and in the meantime the waiter hands you a receipt. the receipt is not the food, but it is a guarantee that the food is coming. when it is ready, the receipt gets redeemed for the actual dish. if the kitchen runs out, you find out the order failed.

you create one with the `new Promise` constructor, which takes a function with two arguments: `resolve` and `reject`.

```javascript
const promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		let error = false
		if (!error) {
			resolve({ username: "hitesh", password: "123" })
		} else {
			reject("ERROR: Something went wrong")
		}
	}, 1000)
})
```

inside the executor you do the async work, like a db call or network request. when it succeeds, call `resolve(value)`. when it fails, call `reject(error)`.

### interesting: the executor runs immediately

here is a subtle thing most people miss. the executor function, the one you pass to `new Promise`, runs synchronously, right at construction time. it is not deferred.

```javascript
console.log("1")
const p = new Promise(() => console.log("2"))
console.log("3")
// 1
// 2
// 3
```

"2" prints in the middle, because the executor runs during construction. only the `resolve`/`reject` calls, and the handlers attached with `.then`, are async.

### the three states:

a promise has three states:

- pending: initial state, not settled yet.
- fulfilled: resolve was called, it has a value.
- rejected: reject was called, it has an error.

the transitions are one-way:

```
           resolve(value)
  pending  --------------->  fulfilled

           reject(error)
  pending  --------------->  rejected
```

once a promise leaves pending, it is settled, and it stays that way forever. you cannot go from fulfilled back to pending, and you cannot go from fulfilled to rejected.

### resolve and reject are one-shot:

calling resolve or reject more than once is a no-op. the first call wins.

```javascript
const p = new Promise((resolve, reject) => {
	resolve("first")
	resolve("second") // ignored
	reject("oops")    // also ignored
})

p.then((value) => console.log(value))
// "first"
```

### what happens to the handlers:

when you call resolve, the promise does not run your `.then` handlers right away. it queues them as microtasks. they only run after the current synchronous code finishes and the call stack empties.

```javascript
const p = new Promise((resolve) => resolve("done"))

p.then((value) => console.log(value))

console.log("sync")
// sync
// done
```

even though resolve runs before `console.log("sync")`, the `.then` callback prints after it, because the handler is a microtask and microtasks wait for the stack to empty.

### from my research:

the executor's `this` is not the promise itself, and a settled promise ignores any further resolve or reject calls. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

### comparison to python and cpp:

in python, `asyncio.Future` or `asyncio.Task` is the same idea. a promise is basically a future with await built in.

in cpp, `std::promise` and `std::future` are the pair. you fulfill the promise from one place and wait on the future from another. the difference is cpp futures block when you call `.get()`, while javascript promises never block the main thread.

## consuming promises with .then, .catch, .finally:

the first way to get a value out of a promise is chaining.

```javascript
promise
	.then((user) => {
		return user.username
	})
	.then((username) => {
		console.log(username)
	})
	.catch((err) => console.log(err))
	.finally(() => console.log("The promise is settled"))
```

- `.then()` handles success. it can return a value, and that value flows into the next `.then()`.
- `.catch()` handles rejection, any error in the chain.
- `.finally()` runs regardless of success or failure, usually for cleanup.

### how the chain works:

the key fact is that every `.then()`, `.catch()`, and `.finally()` returns a brand new promise. that is what makes chaining possible. you are not adding handlers to one promise, you are building a pipeline where each promise waits on the one before it.

```
promise -> .then -> new promise -> .then -> new promise -> .catch -> new promise -> .finally
```

in the example above, the first `.then` gets the whole user object and returns `user.username`. the second `.then` receives that username and logs it.

### what a handler can return:

what the next link in the chain receives depends on what the handler returns:

- a plain value: the new promise fulfills with that value.
- a promise: the new promise adopts its state, this is how async values flow down a chain.
- a thrown error: the new promise rejects with that error.

```javascript
fetch("/api/user")
	.then((res) => res.json())      // returns a promise, next .then waits for it
	.then((data) => data.username)  // plain value, flows into the next handler
	.catch((err) => console.log(err))
```

`.json()` returns a promise, so the next `.then` receives the parsed data, not the Response object.

### error propagation:

a rejection skips every following `.then` until it reaches a `.catch`. the error travels down the chain looking for a handler.

```javascript
promise
	.then((user) => user.username)
	.then((username) => console.log(username)) // skipped if the first rejects
	.catch((err) => console.log(err))          // the rejection lands here
	.finally(() => console.log("done"))        // always runs
```

one gotcha: a handler that returns normally "recovers" the chain. if you want the chain to stay in an error state, you have to re-throw inside the handler.

### .catch and .finally are sugar:

`.catch(onRejected)` is just `.then(undefined, onRejected)`. and `.finally(cb)` runs its callback when the promise settles either way, but it passes through the value or error it received, its own return value is ignored.

```javascript
promise
	.finally(() => cleanup())
	.then((value) => console.log(value)) // still receives the original value
```

### unhandled rejection:

if a promise rejects and nothing catches it, you get an unhandled rejection. the browser fires an `unhandledrejection` event, node logs a warning and can even crash. that is why the video always attaches a `.catch()` or wraps the code in try/catch.

### from my research:

each `.then` queues its own microtask, so a chain is not atomic, each link settles in its own turn of the event loop. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

## async/await:

the second way to consume a promise is async/await, which reads like synchronous code.

```javascript
async function consumePromise() {
	try {
		const response = await promise
		console.log(response)
	} catch (error) {
		console.log(error)
	}
}

consumePromise()
```

`await` pauses the function until the promise settles, without blocking the event loop. if the promise rejects, await throws, so you wrap it in try/catch.

### async functions always return a promise:

this is the part that surprises people. even a simple async function that returns a plain value wraps it in a promise.

```javascript
async function sayHi() {
	return "hi"
}

sayHi() // Promise { "hi" }
sayHi().then((value) => console.log(value)) // hi
```

so you can never read the return value directly. you have to `await` it or use `.then`, because the function always hands you a promise back.

### the await suspension:

when the function hits `await`, it suspends without blocking. the event loop keeps running other code while it waits. when the awaited promise settles, the rest of the function continues as a microtask.

```javascript
async function showDate() {
	const response = await fetch("/api/date")
	const date = await response.json() // second await, same suspension idea
	console.log(date)
}
```

each `await` in a row suspends and resumes in its own turn. that is why async code that reads like synchronous code is actually a chain of microtask hops under the hood.

### try/catch is the only error net:

there is no `.catch()` to append to an `await`. if the awaited promise rejects, the exception is thrown at the `await` line, and it is only caught by the surrounding try/catch.

```javascript
async function load() {
	try {
		const response = await fetch("/api/data")
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`)
		}
		const data = await response.json()
		console.log(data)
	} catch (error) {
		console.log("something failed", error)
	}
}
```

if you skip the try/catch entirely, the rejection becomes an unhandled rejection, same as a missing `.catch()` in a chain.

### comparison to python:

this is almost identical to python's async/await. `async function` is `async def`, `await` is `await`, try/catch is try/except. the main difference is that in python you explicitly create a task with `asyncio.create_task()` to get concurrency, while javascript's promise is already scheduled by the engine.

### from my research:

an async function always returns a promise, even if you just `return 5`. and the part of an async function after an `await` runs as a microtask, which is why promises can interleave with timer callbacks. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

## generators and yield:

generators are functions that can pause and resume. they are not technically part of the async story, but they tie into it directly, because async/await is built on top of generators plus promises. it is worth understanding them to see what `await` is really doing.

### the basics:

a generator function is declared with `function*`, and it uses the `yield` keyword to pause.

```javascript
function* counter() {
	yield 1
	yield 2
	yield 3
}
```

the interesting part: calling a generator function does not run its body. it just returns a generator object. the body stays frozen until you ask for the next value.

```javascript
const gen = counter()
gen.next() // { value: 1, done: false }
gen.next() // { value: 2, done: false }
gen.next() // { value: 3, done: false }
gen.next() // { value: undefined, done: true }
```

`next()` resumes the body until the next `yield`, then pauses again. it returns an object with two fields: `value`, the thing that was yielded, and `done`, whether the generator finished. once `done` is true, every further `next()` returns `{ value: undefined, done: true }`.

### you can pass values back in:

this is the part that makes generators different from plain functions. `next(value)` sends a value back into the generator, and that value becomes the result of the suspended `yield` expression.

```javascript
function* log() {
	const a = yield
	console.log(a)
}

const gen = log()
gen.next()          // prime it, the first next cannot send a value
gen.next("pretzel") // a === "pretzel"
```

the first `next()` cannot carry a useful value, because there is no suspended `yield` yet to receive it. so the pattern is: prime once, then feed values.

this makes generators bidirectional. the caller pushes values in with `next(value)`, and the generator pushes values out with `yield`.

### generators are iterables:

because generators follow the iterator protocol, they work everywhere iterables work.

```javascript
for (const x of counter()) {
	console.log(x)
}
// 1
// 2
// 3

[...counter()]     // [1, 2, 3]
Array.from(counter()) // [1, 2, 3]
```

### lazy and infinite sequences:

generators produce values lazily, one at a time, only when `next()` is called. nothing is computed in advance. that is why you can write an infinite sequence without blowing up memory.

```javascript
function* count() {
	let i = 0
	while (true) {
		yield i++
	}
}

const gen = count()
gen.next().value // 0
gen.next().value // 1
```

danger: spreading or Array.from on an infinite generator hangs forever, because it keeps asking for values that never run out.

### the async/await connection:

here is the payoff. before native async/await existed, people wrote generators that `yield` promises, and a driver function that resumed the generator when each promise settled. that driver is exactly what `co` (a famous library) did, and it is what async/await is sugar for.

```javascript
function run(genFunc) {
	const it = genFunc()

	function step(value) {
		const { value: yielded, done } = it.next(value)
		if (done) return Promise.resolve(yielded)
		return Promise.resolve(yielded).then(step)
	}

	return step()
}

function* fetchUser(id) {
	const user = yield fetch(`/users/${id}`) // yields a promise
	const posts = yield fetch(`/users/${id}/posts`)
	return { user, posts }
}

run(fetchUser).then((data) => console.log(data))
```

the `step` function calls `next()`, gets the yielded promise, and attaches a `.then` that resumes the generator with the resolved value. each `yield` pauses like an `await`, and the promise resumes it when settled.

now rewrite that same idea with async/await and you can see they are the same shape:

```javascript
async function fetchUser(id) {
	const user = await fetch(`/users/${id}`)
	const posts = await fetch(`/users/${id}/posts`)
	return { user, posts }
}
```

### yield vs await:

| | `yield` (generator) | `await` (async function) |
| :--- | :--- | :--- |
| what it suspends | a generator function | an async function |
| what resumes it | the caller's next `next(value)`, you choose | the promise settling |
| what it yields | any value you want | a promise to wait on |
| direction | bidirectional, caller can push values in | one-way, the result comes back from the promise |

### where they run:

generators do not create threads. a suspended generator just saves its execution context, the local variables and the current position, and releases the stack. the event loop stays free until `next()` is called again. same single-threaded story as everything else in this section.

### from my research:

the transpiled output of async functions (babel's regenerator, typescript's `__awaiter` helper) is literally a generator-based state machine. and mdn notes that generators were once the main way to avoid callback hell before promises and async/await took over. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield

### modern usage:

generators are not just history. redux-saga uses them for side-effect orchestration, and async generators (`async function*` with `for await...of`) are used for streaming data where each `yield` can await.

```javascript
async function* pages(url) {
	let next = url
	while (next) {
		const response = await fetch(next)
		const data = await response.json()
		yield data.items
		next = data.next
	}
}

for await (const items of pages("/api/list")) {
	render(items)
}
```

### comparison to python and cpp:

generators in python are nearly identical. `def` with `yield`, `next()`, and `generator.send(value)` is the exact equivalent of `next(value)` in javascript. `yield from` in python is the same as `yield*` delegation in javascript.

cpp has no direct equivalent. the closest ideas are ranges/views or manually written lazy iterators, and c++20 coroutines with `co_yield`, which is the same suspension concept but a lot more machinery.

### key takeaway:

`yield` pauses a generator, `await` pauses an async function, and async/await was literally built on the pattern of generators yielding promises. so when you see `await`, you can picture a generator pausing and a hidden driver resuming it when the promise settles.

## fetch:

fetch is the modern way to make network requests. it returns a promise.

```javascript
fetch("https://api.github.com/users/hiteshchoudhary")
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		console.log(data)
	})
	.catch((error) => console.log(error))
```

### how fetch works internally:

the video explains that calling fetch starts two parallel processes:

- process a: reserves space in memory for the `.then` handlers (the onFulfilled and onRejected callbacks) that will be attached later.
- process b: actually makes the network request through the browser or node environment.

both start at the same time. the memory for the handlers is set up immediately, while the network request runs in the background. that is why fetch returns a promise so fast, the response data is not there yet, but the machinery to receive it is already in place.

### fetch uses the microtask queue:

fetch responses are delivered through the microtask queue, not the normal task queue. that is why a fetch `.then` can beat a `setTimeout(..., 0)` that was registered earlier.

```javascript
setTimeout(() => console.log("timer"), 0)
fetch("/api/data").then(() => console.log("fetch"))

// fetch runs first, because its handler is a microtask
```

this is the same priority rule from section 08. the microtask queue drains before the task queue.

### the 404 trap:

this is the most important edge case. fetch does not reject on a 404 or 500 status.

if the server responds with an error status, the network request still succeeded, a response came back. so the promise resolves. the `.catch()` only runs when the request fails completely, like a network connection error.

```javascript
fetch("https://api.example.com/does-not-exist")
	.then((response) => {
		console.log(response.ok) // false for 404
		console.log(response.status) // 404
	})
```

to treat a 404 as an error, you check `response.ok` yourself:

```javascript
fetch("https://api.example.com/data")
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`)
		}
		return response.json()
	})
	.then((data) => console.log(data))
	.catch((error) => console.log("Error:", error))
```

### response.json() is async:

`response.json()` also returns a promise, because reading the body is async work. you must await it or return it in a chain.

```javascript
const response = await fetch(url)
const data = await response.json()
```

### from my research:

`.json()`, `.text()`, `.blob()`, and `.arrayBuffer()` are all async. they reject if the body cannot be parsed, for example invalid json. reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

### comparison to python and cpp:

in python, `requests.get(url).json()` blocks until done. the async version is `httpx.AsyncClient` or `aiohttp`, and you await the `.json()` call, which matches fetch's behavior.

in cpp, there is no built-in http, and nothing with a promise shape in the standard library. `std::async` is the closest "run something and wait for it" primitive, but it is blocking when you call `.get()`.

## configuring fetch with an options object:

you can pass a second argument to fetch to customize the request.

```javascript
fetch("https://api.example.com/data", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({ userId: 1, password: "abc" }),
})
```

- `method` defaults to GET.
- `headers` sends request headers.
- `body` must be a string or stream, so objects need `JSON.stringify()` first.

### from my research:

a GET request cannot have a body. and since bodies are streams, you cannot reuse the same request object twice, you have to clone it. reference: https://developer.mozilla.org/en-US/docs/Web/API/fetch

## why fetch replaced xmlhttprequest:

the old xhr approach led to callback hell and required tracking readyState manually. fetch gives a cleaner, promise-based api, and it works the same in the browser and node.js (since node 2022).

## promise.all:

the video mentions promise.all at the end with the note "kuch reading aap b kro", so here is my reading.

promise.all takes an array of promises and resolves when all of them resolve, returning an array of their values in order.

```javascript
const [users, posts] = await Promise.all([
	fetch("https://api.example.com/users"),
	fetch("https://api.example.com/posts"),
])
```

the destructuring line is a nice trick. promise.all returns one array, and you unpack the results into named variables in one go.

the big win is concurrency. the two fetches start at the same time instead of waiting for each other. if you wrote them with two separate awaits back to back, the second fetch would not start until the first finished.

### edge case:

promise.all rejects as soon as the first promise rejects, so it fails fast and you lose the other results. if you want every result regardless of failures, use `Promise.allSettled()`.

```javascript
const results = await Promise.allSettled([p1, p2, p3])
// [{status: "fulfilled", value: ...}, {status: "rejected", reason: ...}]
```

allSettled never rejects. it waits for everything to finish and reports each outcome, whether it succeeded or failed.

### the other combinators:

- `Promise.race()`: resolves or rejects with the first promise to settle, whichever comes first. this is the classic way to implement a timeout.
- `Promise.any()`: resolves with the first promise to fulfill. it ignores early rejections, and only rejects if every promise rejects.

```javascript
// timeout pattern with race
Promise.race([
	fetch("/api/data"),
	new Promise((_, reject) =>
		setTimeout(() => reject(new Error("timed out")), 5000)
	),
])
```

if the fetch takes longer than 5 seconds, the timeout promise rejects first and race reports the timeout.

### from my research:

the four combinators all take an iterable of promises: `all` for all-or-nothing, `allSettled` for every outcome, `race` for the first to settle, `any` for the first to fulfill. non-promise values in the array just pass through as-is. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

### comparison to python:

python's `asyncio.gather()` is the closest match to `Promise.all`, it runs multiple coroutines concurrently and collects their results. `asyncio.wait()` with return_when is more like race or allSettled.

## key takeaways:

- xhr is the legacy api, fetch is the modern one.
- xhr uses onreadystatechange and readyState 4 to know when the response is ready.
- server data comes as a string, use JSON.parse (xhr) or response.json (fetch) to get an object.
- a promise is a placeholder for a future value, with pending/fulfilled/rejected states.
- .then chains values forward, .catch handles errors, .finally runs always.
- async/await is cleaner syntax over promises, wrap await in try/catch.
- fetch does not reject on 404 or 500, check response.ok yourself.
- response.json() is async, it returns a promise.
- use the options object to set method, headers, and body.
- promise.all waits for all, allSettled waits for every outcome.
- console.log is a runtime-injected api, not part of the language.
- python has asyncio futures, cpp has std::future, javascript promises never block the main thread.
