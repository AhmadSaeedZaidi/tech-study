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

a promise has three states:

- pending: initial state, not settled yet.
- fulfilled: resolve was called, it has a value.
- rejected: reject was called, it has an error.

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

each of these returns a new promise, which is what makes chaining work.

in the example above, the first `.then` gets the whole user object and returns `user.username`. the second `.then` receives that username and logs it.

### from my research:

`.catch()` is just sugar for `.then(undefined, onRejected)`. and `.finally()` passes through whatever value or error it received, its own return value is ignored. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

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

### comparison to python:

this is almost identical to python's async/await. `async function` is `async def`, `await` is `await`, try/catch is try/except. the main difference is that in python you explicitly create a task with `asyncio.create_task()` to get concurrency, while javascript's promise is already scheduled by the engine.

### from my research:

an async function always returns a promise, even if you just `return 5`. and the part of an async function after an `await` runs as a microtask, which is why promises can interleave with timer callbacks. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

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

```javascript
const [users, posts] = await Promise.all([
	fetch("https://api.example.com/users"),
	fetch("https://api.example.com/posts"),
])
```

promise.all takes an array of promises and resolves when all of them resolve, returning an array of their values in order.

### edge case:

promise.all rejects as soon as the first promise rejects, so it fails fast and you lose the other results. if you want every result regardless of failures, use `Promise.allSettled()`.

```javascript
const results = await Promise.allSettled([p1, p2, p3])
// [{status: "fulfilled", value: ...}, {status: "rejected", reason: ...}]
```

### from my research:

there are four combinators. `Promise.all` for all-or-nothing, `Promise.allSettled` for every outcome, `Promise.race` for the first to settle, and `Promise.any` for the first to fulfill. `race` is the classic way to implement a timeout. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

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
